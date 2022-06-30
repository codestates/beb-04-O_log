import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import Card from '../components/Card'
import Loading from '../components/Loading'
import { MessageContext } from '../context/store'
import './Explore.css'

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {notify} = useContext(MessageContext)
  useEffect(() => {
    getPosts();
  }, [])

  //모든 포스트 요청
  const getPosts = () => {
    setIsLoading(true);
    axios.request({
      method:'GET',
      url:'https://olog445.herokuapp.com/offchain/posts'
    })
    .then((res) => {
      //console.log(res.data)
      setPosts(res.data.reverse());
      setIsLoading(false);
    })
    .catch((err) => {
      //console.log(err)
      notify('포스트를 불러올 수 없습니다.')
      setIsLoading(false);
    })
  }

  return (
    <div className='explore'>
      <div className='container'>
        {posts.map((el, idx) => {
          return <Card key={idx} postImageUrl={el.postImageUrl} blogLink={el.blogLink} title={el.title} created_at={el.created_at} username={el.username} faviconUrl={el.faviconUrl} />
        })}
      </div>
      {isLoading ?<Loading />:''}
    </div>
  )
}
