const Post = require("../../models/post");
const User = require("../../models/user");
const NFT = require("../../models/nft");
const ogs = require("open-graph-scraper");

module.exports = {
  /*
    Explore: 모든 posts를 보내줌
    Get /offchain/posts
*/

  list: async (req, res) => {
    try {
      const posts = await Post.find().exec();
      res.status(200).send(posts);
    } catch (e) {
      res.status(404).send(e);
    }
  },

  /*  
  MyPage: post를 게시함
  Post /offchain/posts
  {
      "blogLink": "블로그링크",
    }
*/

  write: async (req, res) => {
    // 링크만 받아옴
    const { blogLink } = req.body;

    // 링크에서 데이터 뽑아오는 작업 > title, postImgUrl 가져옴
    const options = { url: blogLink };
    const data = await ogs(options);
    const { er, result, response } = data;

    // 새로운 post 인스턴스 만들어 줌
    const newPost = new Post({
      blogLink,
      title: result.ogTitle,
      username: res.locals.user.username,
      postImageUrl: result.ogImage.url,
      faviconUrl: result.favicon,
    });

    try {
      await newPost.save();
      const { expectedToken, NFTPossessed } = await User.findByUsername(
        res.locals.user.username
      );
      let finalReward = 0;
      const rewards = await NFT.find({ tokenId: { $in: NFTPossessed } });
      if (rewards.length !== 0) {
        const rewardFactors = rewards.map((el) => {
          return el.NFTrewardFactor;
        });
        const sumOfRewardFactor = rewardFactors.reduce(
          (prv, cur) => prv + cur,
          0
        );
        finalReward = sumOfRewardFactor * 10;
      } else {
        finalReward = 5;
      }
      const rewardedToken = expectedToken + finalReward;

      const filter = { username: res.locals.user.username };
      const update = { expectedToken: rewardedToken };
      await User.findOneAndUpdate(filter, update, {
        returnDocument: "after",
      });
      res.status(200).send(newPost);
    } catch (e) {
      res.status(404).send(e);
    }
  },

  /* 
    MyPage: 한 명의 유저의 post들을 보내줌
    Get /offchain/posts/mypage/:username
*/
  read: async (req, res) => {
    const username = req.params.username;
    const query = {
      ...(username ? { username: username } : {}),
    };
    try {
      const posts = await Post.find(query).exec();
      res.status(200).send(posts);
    } catch (e) {
      res.status(404).send(e);
    }
  },
};
