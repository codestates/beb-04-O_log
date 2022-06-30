import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Login.css'
import { AuthContext, MessageContext } from '../context/store';

export default function Login() {

  const navigate = useNavigate();
  const {authstate, login} = useContext(AuthContext)
  const {notify} = useContext(MessageContext)

  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");

  const onUsernameHandler = (event) => {
    setUsername(event.currentTarget.value);
  }

  const onPasswordHandler = (event) => {
      setPassword(event.currentTarget.value);
  }

  useEffect(() => {

    if(authstate.auth){
      //console.log("you already login");
      navigate('/');
    }else{
      //console.log("카몬 mate");
    }
    return () => {
    }
  }, [])


  const onSubmitHandler = ()=> {
    // console.log('submit1');
    // event.preventDefault(); // 페이지 리프레시가 안됨
    // console.log('submit2');
    if(Username.length === 0 || Password.length === 0){
      notify('username, password 모두 입력해주세요', 'error')
      return;
    }
    let body = {
      username: Username,
      password: Password
    }

    axios.request({
      method:'POST',
      url:'https://olog445.herokuapp.com/offchain/auth/login',
      data: body,
      withCredentials: true
    })
    .then((res) => {
      const user = res.data;
      login({id: user.id, username: user.username})
      notify(`환영합니다! ${user.username}님` , 'success')
      navigate('/')
    })
    .catch((err) => {
      console.log(err)
      if(err.response.data === '잘못된 비밀번호 입니다.') notify('잘못된 비밀번호입니다', 'error')
      else if(err.response.data === '계정이 존재하지 않습니다.') notify('계정이 존재하지 않습니다', 'error')
      else notify('로그인할 수 없습니다. 관리자에게 문의해주세요','error')
    })
  }


  const onKeyPress = (e) => {
    if(e.key === 'Enter'){
      onSubmitHandler();
    }
  }

  return (
    <div className='login'>
  <div className='form_container'>
    <div className='title'>Login</div>
    <div className='inputs'>
      <input type="username" value={Username} onChange={onUsernameHandler} placeholder="Username" onKeyPress={onKeyPress} />
      <input type="password" value={Password} onChange={onPasswordHandler}  placeholder="Password" onKeyPress={onKeyPress} />
    </div>
    <div className='submit'>
        <button type="submit" onClick={onSubmitHandler}>
            로그인
        </button>
    </div>
  </div>
  </div>

  )
}