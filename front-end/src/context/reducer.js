

export const initialState = {
  auth: false,
  username: undefined
}

export const authReducer = (state, action) => {
  switch(action.type){
    case 'LOGIN':
      return{
        ...state,
        auth: true,
        username: action.username,

      }
    case 'LOGOUT': 
      return{
        ...state,
        auth: false,
        username: undefined,
      }
    default:
      throw new Error('error')
  }
}

export const initialState_m = {
  messages: [],
}

export const messageReducer = (state, action) => {
  switch(action.type){
    case 'ENQUEUE_MESSAGE':
      return {
        ...state, messages: [...state.messages, action.payload]
      }
    case 'DEQUEUE_MESSAGE':
      return {
        ...state, messages: state.messages.slice(1)
      }
    default:
      return state;
  }
}