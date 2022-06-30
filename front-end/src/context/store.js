import { createContext, useReducer} from 'react'
import { initialState_m, messageReducer } from './reducer'

export const AuthContext = createContext(null)

export const MessageContext = createContext(null)

export const MessageProvider = ({children}) => { 
  const [state, dispatch] = useReducer(messageReducer, initialState_m);
  
  const notify = (message, option, dismissTime = 5000) => {
    const uuid = Math.random()
    dispatch(enqueueNotification(message, option, dismissTime, uuid))
    setTimeout(() => {
      dispatch(dequeueNotification())
    }, dismissTime)
  }

  const enqueueNotification = (message, option, dismissTime, uuid) => {
    return {
      type: 'ENQUEUE_MESSAGE',
      payload: {
        message,
        option,
        dismissTime,
        uuid
      }
    }
  }
  
  const dequeueNotification = () => {
    return {
      type: 'DEQUEUE_MESSAGE'
    }
  }



  return(
    <MessageContext.Provider value={{state, notify}}>
      {children}
    </MessageContext.Provider>
  )
}