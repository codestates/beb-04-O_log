import {useContext, useState} from 'react'
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/store';
import axios from 'axios';
import './UploadComment.css'

export default function UploadComment() {
  const [input, setInput] = useState('');
  const location = useLocation();
  const {authstate} = useContext(AuthContext);

  const handleInput = (e) => {
    setInput(e.target.value)
  }

  const handleClick = () => {
    if(!authstate.auth) {
      alert('로그인이 필요합니다.')
      return;
    }
    if(!input){
      return;
    }
    //로그인상태인지 확인
    //location.pathname.slice(8,) page 주인
    //요청
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
    })
    .catch((err) => {
      console.log(err)
    })
  }

  return (
    <div className='upload_comment'>
      <div className='input'>
        <input type='text' value={input} onChange={handleInput} placeholder='댓글 추가...'/>
      </div>
      <button onClick={handleClick}>add</button>
    </div>
  )
}
