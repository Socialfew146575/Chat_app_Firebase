import { onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../config/firebase'
import { AuthContext } from '../context/AuthContext'
import { doc } from 'firebase/firestore'
import { ChatContext } from '../context/ChatContext'

const Chats = () => {

  const { currentUser } = useContext(AuthContext)

  const { dispatch } = useContext(ChatContext)

  const [chats, setChats] = useState([])

  useEffect(() => {

    const getChats = () => {

      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data())


      })


      return () => unsub()
    }


    currentUser && getChats()


  }, [currentUser.uid])


  const handleSelect = (user) => {


    dispatch({ type: "CHANGE_USER", payload: user })


  }

  

  return (
    <div className=''>


      {Object.entries(chats)?.sort((a,b)=>a=b[1].date - a[1].date ).map((chat) => (



        <div key={chat[0]} className="p-[8px] flex items-center gap-2 cursor-pointer text-white hover:bg-[#2f2d52]" onClick={() => handleSelect(chat[1].userInfo)}>
          <img src={chat[1].userInfo.photoURL} alt="" className='h-12 w-12 rounded-[50%] object-cover' />
          <div className="">
            <span className='font-[500] text-base'> {chat[1].userInfo.displayName}</span>
            <p className='text-xs text-[lightgray]'>{chat[1].lastMessage?.text}</p>
          </div>
        </div>


      ))}



    </div>
  )
}

export default Chats
