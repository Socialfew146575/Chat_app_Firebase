import React from 'react'
import Sidebar from '../components/Sidebar'
import Chat from '../components/Chat'

const Home = () => {
  return (
    <div className='bg-primary h-[100vh] flex items-center justify-center'>
        <div className='border border-white rounded-xl w-[90%] tablet:w-[65%] h-[80%] flex overflow-hidden '>
            <Sidebar/>
          
            <Chat/>


        </div>
      
    </div>
  )
}

export default Home
