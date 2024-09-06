import React, { useContext, useEffect, useState } from 'react';
import Message from './Message'
import { ChatContext } from '../context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

const Messages = () => {

  const {data} = useContext(ChatContext)
 
  const [messages,setMessages] = useState([])
  useEffect(()=>{

    const unsub = onSnapshot(doc(db,"chats",data.chatId),(doc)=>{


      doc.exists() && setMessages(doc.data().messages)

   
    })



    return ()=>unsub()


  },[data.chatId])

 

  return (
    <div className='bg-[#ddddf7] p-[10px] overflow-scroll overflow-x-hidden chatScrollbarArea ' style={{ height: 'calc(100% - 100px)' }}>

    {messages && messages.map((message)=>(

      <Message message = {message} key={message.id} />

    ))}

    
     

    </div>
  );
}

export default Messages;
