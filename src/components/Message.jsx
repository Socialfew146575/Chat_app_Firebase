import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const Message = ({message}) => {

  const {currentUser} = useContext(AuthContext)
  const {data} = useContext(ChatContext)


  const ref = useRef()

  useEffect(()=>{

    ref.current?.scrollIntoView({behavious:"smooth"})

  },[message])

  const owner = message.senderId === currentUser.uid?"owner":"";

 
 const pic = owner==="owner"?currentUser.photoURL:data.user.photoURL;

  // Assuming you have a timestamp from Firestore
  const timestamp = message.date; // replace this with your actual Firestore timestamp


  
  const date = timestamp.toDate();

  
  const formattedTime = date.toLocaleTimeString();

 
  


  return (
    <div ref={ref} className={`flex gap-[20px] mb-5 ${owner}`}>
      <div className="flex flex-col text-[gray] text-xs font-light">
        <img className="h-10 w-10 rounded-[50%] object-cover" src={pic} alt="" />
        <span>{formattedTime}</span>
      </div>
      <div className="flex max-w-[80%] flex-col gap-[10px] message" >
        {message.text && <p className='bg-white p-[10px] max-w-fit ' style={{ borderRadius: "0px 10px 10px 10px" }} >
          {message.text}
        </p>}
        
        
        {message.img && <img className='w-1/2' src={message.img} alt="" />}
       
      </div>
    </div>
  );
}

export default Message;
