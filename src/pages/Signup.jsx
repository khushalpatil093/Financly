import React from 'react'
import Header from '../Components/Header'
import SignUpSignIn from '../Components/SignUpSignIn'

const Signup = () => {
  return (
    <div className='signup'>
      <Header/>
      <div className='wrapper'>
        <SignUpSignIn/>
      </div>
    </div>
  )
}

export default Signup