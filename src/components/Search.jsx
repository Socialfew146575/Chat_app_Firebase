import React, { useContext, useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { setDoc } from 'firebase/firestore';

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState([]);

  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const handleSearch = async () => {

      setUser([])


      if (username.trim() != "") {

        const q = query(collection(db, 'users'));
        try {
          const querySnapshot = await getDocs(q);
          const userData = querySnapshot.docs.map((doc) => doc.data());
        
          const userRegEx = new RegExp(username, 'i')
          const filteredData = userData.filter((data) => userRegEx.test(data.displayName))
          // console.log(filteredData)
          setUser(filteredData);
        } catch (error) {
          console.log(error);
          toast.error('User not found !!!');
          setUser([]); // Set an empty array to clear previous search results
        }

      }
      else {
        setUser([]);
      }
    }


    handleSearch(); // Call the function directly in useEffect
    

  }, [username]);

  // const handleKey = (e) => {
  //   if (e.code === 'Enter') {
  //     handleSearch();
  //   }
  // };

  const handleSelect = async (u) => {
   
    const combinedId = currentUser.uid > u.uid ? currentUser.uid + u.uid : u.uid + currentUser.uid;
    
    try {
    
      
      const res = await getDoc(doc(db,"chats",combinedId));
      
     
     

      if (!res.exists()) {
        await setDoc(doc(db, 'chats', combinedId), { messages: [] });


        await updateDoc(doc(db,"userChats", currentUser.uid ),{

          [combinedId+".userInfo"]:{
              uid:u.uid,
              displayName:u.displayName,
              photoURL:u.photoURL
          },
          [combinedId+".date"]:serverTimestamp(),
          


        })   



        await updateDoc(doc(db,"userChats", u.uid ),{

          [combinedId+".userInfo"]:{
              uid:currentUser.uid,
              displayName:currentUser.displayName,
              photoURL:currentUser.photoURL
          },
          [combinedId+".date"]:serverTimestamp(),
          


        })

      }

      setUser([])
      setUsername("")

    } catch (error) {
      console.log(error)
    }

   

  };


  return (
    <div className='border-b border-b-[gray]'>
      <div className='p-[10px]'>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          // onKeyDown={handleKey}
          type='text'
          className='bg-transparent border-none text-white outline-none placeholder-[lightgray] text-sm'
          placeholder='Find a user'
        />
      </div>
      <Toaster />
      {user.map((u) => (
        <div key={u.id} className='p-2 flex items-center gap-2 cursor-pointer text-white hover:bg-[#2f2d52]' onClick={() => handleSelect(u)}>
          <img src={u.photoURL} alt='' className='h-12 w-12 rounded-[50%] object-cover' />
          <div className=''>
            <span className='font-[500] text-base'>{u.displayName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Search;
