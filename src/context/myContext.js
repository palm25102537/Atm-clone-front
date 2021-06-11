import { useState, useContext, createContext, useReducer } from 'react'
import service from '../service/localStorage'

const { getToken, setToken, clearToken } = service

const myContext = createContext()

const INITIAL_STATE = {
  isAuthen: getToken(),

}

function checkAuthenByReducer(state, action) {
  switch (action.type) {
    case 'getToken': {
      setToken(action.token)

      return { isAuthen: action.token }
    }
    case 'clearToken': {
      clearToken()

      return { isAuthen: getToken() }
    }
    default: return state
  }
}

function ContextProvider(props) {
  const [state, dispatch] = useReducer(checkAuthenByReducer, INITIAL_STATE)
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const provide = { state, dispatch, show1, show2, setShow1, setShow2 }

  return (
    <myContext.Provider value={provide}>{props.children}</myContext.Provider>
  )
}

function useMyContext() {
  const context = useContext(myContext)

  return context
}

export { ContextProvider, useMyContext }