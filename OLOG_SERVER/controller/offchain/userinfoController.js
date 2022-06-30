const User = require("../../models/user");
const Comment = require("../../models/comment");

module.exports = {
  /*
    GET /offchain/userinfo/status
    */
  status: async (req, res) => {
    const username = res.locals.user.username;

    try {
      user = await User.findByUsername(username);

      res.status(200).send(user.hidePw());
    } catch (e) {
      res.status(404).send(e);
    }
  },

  /*
    GET /offchain/userinfo/comment/:username
    */
  read: async (req, res) => {
    const username = req.params.username;
    console.log(username);
    const query = {
      ...(username ? { ownerName: username } : {}),
    };
    console.log(query);
    try {
      const comments = await Comment.find(query).exec();
      console.log(comments);
      res.status(200).send(comments);
    } catch (e) {
      res.status(404).send(e);
    }
  },

  /*
    POST /offchain/userinfo/comment/:username
    {
        "contents": "댓글 내용"
    }
    */
  write: async (req, res) => {
    const ownerName = req.params.username;
    const { contents } = req.body;

    const newComment = new Comment({
      visiterName: res.locals.user.username,
      ownerName,
      contents,
    });

    try {
      await newComment.save();
      res.status(200).send(newComment);
    } catch (e) {
      res.status(404).send(e);
    }
  },
};
