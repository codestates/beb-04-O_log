import React, { useContext, useState } from 'react'
import axios from 'axios'
import './Uploadpost.css'
import { AuthContext, MessageContext } from '../context/store';
import Loading from './Loading';

export default function Uploadpost(props) {
  const [link, setlink] = useState('')
  const [confirm, setComfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {authstate} = useContext(AuthContext);
  const {notify} = useContext(MessageContext);


  const handleConfirm = () => {
    if(confirm){
      setComfirm(false);
      return;
    }
    if(!link) return;
    if(!authstate.auth) {
      notify('로그인 후 시도해 주세요', 'error')
      return;
    }
    setComfirm(true);
  }

  const handlelink = (e) => {
    setlink(e.target.value)
  }

  //post 업로드 요청
  const handleSubmit = () => {
    console.log(authstate)
    setIsLoading(true);
    axios.request({
      method: 'POST',
      url:'https://olog445.herokuapp.com/offchain/posts',
      data: {blogLink: link},
      withCredentials: true
    })
    .then((res) => {
      setComfirm(false);
      setIsLoading(false);
      setlink('')
      notify('업로드 완료!','success')
      if(props.getMyPosts) props.getMyPosts();
      if(props.getMyOLG) props.getMyOLG();
    })
    .catch((err) => {
      setIsLoading(false);
      notify('업로드에 실패했습니다', 'error')
      console.log(err)
    })
  }

  return (
    <div className='form_container'>
      <div className='title'>Upload Your Post</div>
      <div className='input_section'>
        <div className='inputs'>
          <input placeholder='링크' id='link' value={link} onChange={handlelink} />
        </div>
        <div className='submit'>
          <button onClick={handleConfirm}>upload</button>
        </div>
      </div>
    {confirm?       
      <div className='small_modal'>
        <div className='message_area'>
          <span>포스트 업로드 후에 삭제하실 수 없습니다.</span>
          <span>업로드 하시겠습니까?</span>
        </div>
        <div className='button_area'>
          <button className='yes_button' onClick={handleSubmit}>yes</button>
          <button className='no_button' onClick={handleConfirm}>no</button>
        </div>
        {isLoading ? <Loading /> : ''}
      </div>
    :''}

    </div>
  )
}
