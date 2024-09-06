import { signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate()
    const handleSubmit = (e) => {

        e.preventDefault();

        const email = e.target[0].value
        const password = e.target[1].value
       

        signIn(email, password)


    }

    const signIn = async (email, password) => {

        try {

         await signInWithEmailAndPassword(auth, email, password)
           
         navigate('/')   



        } catch (error) {
            console.log(error)
            toast.error('Login failed: Incorrect email or password.');


        }





    }


  return (
      <div className='formContainer'>

          <div className="formWrapper">

              <span className='logo'>Chat App</span>
              <span className='title'> Login</span>
              <form action="" onSubmit={handleSubmit}>


                
                  <input type="email" name="" id="" placeholder='Email' />
                  <input type="password" name="" id="" placeholder='Password' />

                 
                 

                  <button type='submit'>Sign In</button>

              </form>

              <p>You don't have an account? <Link className='link' to={"/register"}> Register</Link></p>
              <Toaster />
          </div>
      </div>
  )
}

export default Login
