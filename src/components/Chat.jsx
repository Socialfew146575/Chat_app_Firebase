import React, { useContext } from 'react';

import Cam from '../img/cam.png';
import Add from '../img/add.png';
import More from '../img/more.png';
import Messages from './Messages';
import Input from './Input';
import { ChatContext } from '../context/ChatContext';

const Chat = () => {
  const { data } = useContext(ChatContext);
  
  if (!data || !data.user || Object.keys(data.user).length === 0) {
    return (
      <div className="flex-[2] flex items-center justify-center bg-[#5d5b8d] w-full text-white text-lg">
        <p>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className='flex-[2] h-full'>
      <div className="h-[50px] bg-[#5d5b8d] flex items-center justify-between p-[10px] text-[lightgray]">
        <span>{data.user.displayName}</span>
        <div className="flex gap-[10px] ">
          <img src={Cam} alt="" className='h-6 cursor-pointer ' />
          <img src={Add} alt="" className='h-6 cursor-pointer' />
          <img src={More} alt="" className='h-6 cursor-pointer' />
        </div>
      </div>

      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
