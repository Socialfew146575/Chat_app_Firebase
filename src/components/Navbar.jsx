import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { auth } from '../config/firebase'
import {AuthContext} from '../context/AuthContext'

const Navbar = () => {

const {currentUser} = useContext(AuthContext)

    return (
        <div className='flex items-center bg-[#2f2d52]  h-12 p-3 justify-between text-[#ddddf7] '   >
            <span className='font-bold tablet:flex hidden'>Chat App</span>
            <div className="flex gap-3 items-center ">
                <img src={currentUser.photoURL} alt="" className='h-6 w-6 bg-[#ddddf7] rounded-[50%] object-cover' />
                <span className='text-sm'>{currentUser.displayName}</span>
                <button onClick={()=>signOut(auth)} className='absolute bottom-1 tablet:relative tablet:bottom-auto tablet:left-auto  rounded-sm bg-[#5d5b8d] text-[#ddddf7] text-[10px] px-[2px] h-[20px] border-none cursor-pointer'>
                    Logout
                </button>

            </div>
        </div>
    )
}

export default Navbar
