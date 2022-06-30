import React, { useContext } from 'react'
import { MessageContext } from '../context/store';
import Toast from './Toast';
import './NotificationCenter.css'

export default function NotificationCenter() {
  const {state} = useContext(MessageContext);
  return (
    <div className="notification-container">
    {
      state.messages.map((n) =>
        <Toast key={n.uuid} text={n.message} option={n.option} dismissTime={n.dismissTime} />
      )
    }
  </div>
  )
}
