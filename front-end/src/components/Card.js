import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Card.css'

export default function Card(props) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/mypage/${props.username}`)
  }

  const handleLength = (title) => {
    if(!title) return;
    if(title.length > 48) return title.slice(0,48)+'...'
    else return title;
  }
  return (
    <div className='card'>
      <a href={props.blogLink} target="_blank">
        <img className='card_image' src={props.postImageUrl} />
      </a>
      <div className='card_content'>
        <div className='card_content_main'>
          <span className='title'>{handleLength(props.title)}</span>
          <div className='created_at'>
            <span className='created_at_element'>{props.created_at.slice(0,10)}</span>
          </div>
        </div>
        <div className='divider'></div>
        <div className='user' onClick={handleClick}>
          <span className='username'>{props.username}</span>
          <img className='image' src={props.faviconUrl} />
        </div>
      </div>
    </div>
  )
}
