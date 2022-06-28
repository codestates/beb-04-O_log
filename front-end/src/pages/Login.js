import React, { useContext, useState, useEffect } from 'react'
//import { useDispatch } from 'react-redux';
//import { registerUser } from '../../../_actions/user_action';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './Login.css'
import { AuthContext, MessageContext } from '../context/store';

export default function Login() {
  //const dispatch = useDispatch();
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


    let body = {
      username: Username,
      password: Password
    }
    axios.request({
      method:'POST',
      url:'http://localhost:3030/offchain/auth/login',
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
      if(err.response.status === 401) notify('잘못된 비밀번호입니다', 'error')
      else alert('Error')
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