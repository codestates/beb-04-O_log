import React from 'react'
import './Comment.css'

export default function Comment(props) {
  return (
    <div className='comment'>
      <div className='content'>
        {props.contents}
      </div>
      <div className='info'>
        <span className='username'>{props.visiterName}</span>
        <span className='created_at'>{props.created_at.slice(0,10)+' '+props.created_at.slice(11,19)}</span>
      </div>
    </div>
  )
}
