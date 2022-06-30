import React, { useState, useEffect, useContext } from 'react'
//import { useDispatch } from 'react-redux';
//import { registerUser } from '../../../_actions/user_action';
import { useNavigate } from "react-router-dom";
import './Signup.css'
import axios from 'axios';
import { AuthContext, MessageContext } from '../context/store';

export default function Signup() {
  //const dispatch = useDispatch();
  const navigate = useNavigate();
  const {authstate} = useContext(AuthContext);
  const {notify} = useContext(MessageContext);

  const [Username, setUsername] = useState("")
  const [Password, setPassword] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")


  useEffect(() => {

    if(authstate.auth){
      //console.log("you already login");
      navigate('/');

  
    }else{
      //console.log("카몬 mate");
    }
  
  }, [])


  const onUsernameHandler = (event) => {
    setUsername(event.target.value);
}

  const onPasswordHandler = (event) => {
      setPassword(event.target.value)
  }

  const onConfirmPasswordHandler = (event) => {
      setConfirmPassword(event.target.value)
  }


  const onSubmitHandler = () => {

    if(!Username || !Password) {
      notify('username, password 모두 입력해주세요', 'error')
      return;
    }

    if (Password !== ConfirmPassword) {
        notify('비밀번호와 비밀번호 확인은 같아야 합니다.','error')
        return;
    }

    let body = {
        username: Username,
        password: Password,
    }

    axios.request({
      method:'POST',
      url:'https://olog445.herokuapp.com/offchain/auth/register',
      data: body
    })
    .then((res) => {
      //console.log(res.data)
      notify('회원가입 성공! 로그인하여 사용해주세요.', 'success')
      navigate('/login');
    })
    .catch((err) => {
      if(err.response.status === 409) {
        notify('이미 존재하는 username 입니다.', 'error')
      }
      else{
        notify('회원가입에 실패했습니다. 다시 시도해주세요','error')
      }
    })
  }

  const onKeyPress = (e) => {
    if(e.key === 'Enter'){
      onSubmitHandler();
    }
  }



  return (
    <div className='signup'>
    <div className='form_container'>
      <div className='title'>Signup</div>
      <div className='inputs'>
        <input type="username" value={Username} onChange={onUsernameHandler} placeholder="Username" onKeyPress={onKeyPress}/>
        <input type="password" value={Password} onChange={onPasswordHandler}  placeholder="Password" onKeyPress={onKeyPress}/>
        <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} placeholder="Confirm Password" onKeyPress={onKeyPress}/>
      </div>
      <div className='submit'>
        <button type="submit" onClick={onSubmitHandler}>
          회원가입
        </button>
      </div>
    </div>
    </div>

  )
}