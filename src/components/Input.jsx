import React, { useState } from 'react'

import Img from '../img/img.png'
import Attach from '../img/attach.png'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { Timestamp, arrayUnion, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../config/firebase'
import { v4 as uuid } from 'uuid'
import { ref, uploadBytesResumable } from 'firebase/storage'
import { useContext } from 'react'
import { doc } from 'firebase/firestore'
import { getDownloadURL } from 'firebase/storage'

const Input = () => {
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleImageChange = (e) => {
    const selectedImg = e.target.files[0];
    setImg(selectedImg);
    setImgPreview(URL.createObjectURL(selectedImg));
  };

  const handleSend = async () => {
    if (img) {
      try {
        const storageRef = ref(storage, uuid());
        await uploadBytesResumable(storageRef, img);
        const downloadURL = await getDownloadURL(storageRef);

        await updateDoc(doc(db, 'chats', data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            img: downloadURL,
          }),
        });
      } catch (error) {
        console.log(error);
      }
    } else if (text) {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    await updateDoc(doc(db, 'userChats', data.user.uid), {
      [data.chatId + '.lastMessage']: {
        text,
      },
      [data.chatId + '.date']: serverTimestamp(),
    });

    setImg(null);
    setText('');
    setImgPreview(null);
  };

  return (
    <div className='h-[50px] bg-white p-[10px] flex items-center justify-between'>
      <div className='flex-[2] flex gap-4'>
        {imgPreview && (
          <img
            src={imgPreview}
            alt='Image Preview'
            className='h-10 w-10 rounded-lg object-cover'
          />
        )}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type='text'
          placeholder='Type something...'
          className='outline-none w-full  border-none text-[#2f2d52] text-[16px] placeholder-[lightgray]'
        />
      </div>
      <div className='flex items-center gap-[10px]'>
        <img src={Attach} alt='' className='h-6 cursor-pointer' />
        <input
          type='file'
          className='hidden'
          name=''
          id='file'
          onChange={(e)=>handleImageChange(e)}
        />
        <label htmlFor='file'>
          <img
            src={Img}
            alt=''
            className='h-6 cursor-pointer'
            loading='lazy'
          />
        </label>
       
        <button
          onClick={handleSend}
          className='py-[4px] px-[8px] border-none text-white bg-[#8da4f1] text-sm  rounded-sm'
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;