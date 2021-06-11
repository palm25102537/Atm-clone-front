import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Header from '../component/Header'
import axios from '../config/axios'
import { useMyContext } from '../context/myContext'
import Error from '../component/Error'

function HomePage() {

  const history = useHistory()

  const { dispatch, show1, show2, setShow1, setShow2 } = useMyContext()

  const [signIn, setSignIn] = useState({
    username: '',
    password: ''
  })


  function handleSignInInputChange(event) {
    const { id, value } = event.target

    setSignIn((previous) => ({ ...previous, [id]: value }))

    if (id === 'password') {

      if (isNaN(value)) {
        setShow1(true)
      } else {
        setShow1(false)
      }
    }
  }

  async function login() {
    const response = await axios.post('/account/login', signIn)
    const { data: { message, token } } = response
    alert(message)
    dispatch({ type: 'getToken', token })
    setSignIn({ username: '', password: '' })
    history.push('/transaction')
  }

  const [signUpInput, setSignUpInput] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    citizenId: '',
    name: '',
    surname: ''
  })

  function handleSignUpInputChange(event) {
    const { title, value } = event.target
    setSignUpInput((previous) => ({ ...previous, [title]: value }))

    if (title === 'password') {
      if (isNaN(value)) {
        setShow2(true)
      } else {
        setShow2(false)
      }
    }
  }

  async function register() {
    const response = await axios.post('/account/register', signUpInput)
    const { data: { message, respond: { name, surname, balance, id, password, username, email } } } = response
    alert(message)
    window.confirm(`Please keep this information in secret \n
      account number : ${id} \n
      name : ${name} \n
      surname : ${surname} \n
      username : ${username} \n
      password: ${password} \n
      email : ${email} \n
      balance : ${balance}
    `)
  }

  return (
    <div>
      <Header />
      <div className='app-sign-container'>
        <div className='sign-in-container'>
          <h3>Sign In</h3>
          <div className='sign-in-content'>
            <div>
              <label htmlFor='username'>Username : </label>
              <input onChange={(e) => handleSignInInputChange(e)} style={{ width: '200px', padding: '3px', border: '1px solid black', borderRadius: '10px' }} id='username' value={signIn.username} type='text'></input>
            </div>
            <br />
            <div>
              <label htmlFor='password'>Password : </label>
              <input onChange={(e) => handleSignInInputChange(e)} style={{ width: '205px', padding: '3px', border: '1px solid black', borderRadius: '10px' }} id='password' value={signIn.password} type='password'></input>
              {
                show1 ? (<Error />) : (
                  <div style={{ height: '14px', marginTop: '2px' }}>
                  </div>
                )
              }
            </div>
            <div style={{ marginTop: '11px' }}>
              <button onClick={login} className='sign-in-button'>SignIn</button>
            </div>
          </div>
        </div>
        <div className='sign-up-container'>
          <h3>Sign up</h3>
          <div className='sign-up-content'>
            <div >
              <input onChange={(e) => handleSignUpInputChange(e)} style={{ width: '200px', height: '23px', paddingLeft: '5px', border: '1px solid black', borderRadius: '10px' }} title='username' type='text' value={signUpInput.username} placeholder='Username'></input>
            </div>
            <div>
              <input onChange={(e) => handleSignUpInputChange(e)} style={{ width: '200px', height: '23px', paddingLeft: '5px', border: '1px solid black', borderRadius: '10px', marginTop: '20px' }} title='password' type='password' value={signUpInput.password} placeholder='Password'></input>
              {
                show2 ? (<Error />) : (
                  <div style={{ height: '14px', marginTop: '2px' }}>
                  </div>
                )
              }
            </div>
            <div>
              <input onChange={(e) => handleSignUpInputChange(e)} style={{ width: '200px', height: '23px', paddingLeft: '5px', border: '1px solid black', borderRadius: '10px', marginTop: '5px' }} title='confirmPassword' type='password' value={signUpInput.confirmPassword} placeholder='Confirm Password'></input>
            </div>
            <div>
              <input onChange={(e) => handleSignUpInputChange(e)} style={{ width: '200px', height: '23px', paddingLeft: '5px', border: '1px solid black', borderRadius: '10px', marginTop: '20px' }} title='name' type='text' value={signUpInput.name} placeholder='Name'></input>
            </div>
            <div>
              <input onChange={(e) => handleSignUpInputChange(e)} style={{ width: '200px', height: '23px', paddingLeft: '5px', border: '1px solid black', borderRadius: '10px', marginTop: '20px' }} title='surname' type='text' value={signUpInput.surname} placeholder='Lastname'></input>
            </div>
            <div>
              <input onChange={(e) => handleSignUpInputChange(e)} style={{ width: '200px', height: '23px', paddingLeft: '5px', border: '1px solid black', borderRadius: '10px', marginTop: '20px' }} title='email' type='text' value={signUpInput.email} placeholder='Email'></input>
            </div>
            <div>
              <input onChange={(e) => handleSignUpInputChange(e)} style={{ width: '200px', height: '23px', paddingLeft: '5px', border: '1px solid black', borderRadius: '10px', marginTop: '20px' }} title='citizenId' type='text' value={signUpInput.citizenId} placeholder='Citizen ID'></input>
            </div>
            <div style={{ marginTop: '30px' }}>
              <button onClick={register} className='sign-up-button'>SignUp</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default HomePage
