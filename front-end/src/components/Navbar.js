import axios from 'axios';
import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext, MessageContext } from '../context/store';

import './Navbar.css'

export default function Navbar() {

  const {authstate, logout} = useContext(AuthContext);
  const {notify} = useContext(MessageContext)
  const location = useLocation();

  const navigate = useNavigate()

  const handleLogout = () => {
    axios.request({
      method: 'POST',
      url:'https://olog445.herokuapp.com/offchain/auth/logout',
      withCredentials:true
    })
    .then((res) => {
      logout()
      notify('로그아웃되었습니다.', 'success')
      navigate('/')
    })
    .catch((err) => {
      console.log(err);
    })
  }

    return (

      <div className='navbar'>
      <Link to='/'>
        <div className='title'>오늘의 Log</div>
      </Link>
      <div className='navbar_links'>
        {location.pathname === '/' ?
          '':
          <span>
            <Link to='explore'><span className={location.pathname === '/explore' ? 'navbar_link active':'navbar_link' } >explore</span></Link>
            <Link to='marketplace'><span className={location.pathname === '/marketplace' ? 'navbar_link active':'navbar_link' }>market place</span></Link>
          </span>
        }
        {authstate.auth ? 
          <span>
            <Link to={`mypage/${authstate.username}`}><span className={location.pathname === `/mypage/${authstate.username}` ? 'navbar_link active':'navbar_link' }>my page</span></Link>
            <span className='navbar_link logout' onClick={handleLogout}>logout</span>
          </span>
          :
          <span>
            <Link to='login'><span className={location.pathname === '/login' ? 'navbar_link active':'navbar_link' }>log in</span></Link>
            <Link to='signup'><span className={location.pathname === '/signup' ? 'navbar_link active':'navbar_link' }>sign up</span></Link>
          </span>
        }
      </div>
    </div>
  )

 

}
