import React from 'react'
import { Link } from 'react-router-dom'
import Uploadpost from '../components/Uploadpost'
import './Main.css'

export default function Main() {
  return (
    <div className='main'>
      <div className='upload'>
        <Uploadpost />
      </div>
      <div className='typo'>
        <div>매일 블로깅 인증 하고 보상을 받아보세요</div>
      </div>
      <div className='links'>
        <Link to='explore'>
          <button>
            Explore
          </button>
        </Link>
        <Link to='marketplace'>
          <button>
            Market Place
          </button>
        </Link>
      </div>
    </div>
  )
}
