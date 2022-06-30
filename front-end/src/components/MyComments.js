import React, { useState, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import Comment from './Comment';
import axios from 'axios';
import { AuthContext, MessageContext } from '../context/store';
import './MyComments.css'

export default function MyComments() {
  const [input, setInput] = useState('');
  const [comments, setComments] = useState([]);
  const location = useLocation();
  const {authstate} = useContext(AuthContext);
  const {notify} = useContext(MessageContext)

  useEffect(() => {
    getComments();
    //test();
  },[location.pathname])

  //댓글 요청
  const getComments = () => {
    axios.request({
      method: 'GET',
      url: `https://olog445.herokuapp.com/offchain/userinfo/comment/${location.pathname.slice(8,)}`,
      withCredentials: true
    })
    .then((res) => {
      //console.log(res.data);
      setComments(res.data.reverse())
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const handleInput = (e) => {
    setInput(e.target.value)
  }

  //댓글 추가 요청
  const handleClick = () => {
    if(!authstate.auth) {
      notify('로그인이 필요합니다.', 'error')
      return;
    }
    if(!input){
      return;
    }

    axios.request({
      method: 'POST',
      url:`https://olog445.herokuapp.com/offchain/userinfo/comment/${location.pathname.slice(8,)}`,
      data:{
        contents: input
      },
      withCredentials: true
    })
    .then((res) => {
      console.log(res)
      setInput('')
      notify('댓글이 등록되었습니다.','sccuess')
      getComments();
    })
    .catch((err) => {
      console.log(err)
    })
  }
  
  return (
    <div>
      <div className='upload_comment'>
        <div className='input'>
          <input type='text' value={input} onChange={handleInput} placeholder='댓글 추가...'/>
        </div>
        <button onClick={handleClick}>add</button>
      </div>
      {!comments.length ? '' :
        <div className='comments_container'>
          {comments.map((el, idx) => {
            return <Comment key={idx} visiterName={el.visiterName} contents={el.contents} created_at={el.created_at} />
          })}
        </div>
      }
    </div>

  )
}
