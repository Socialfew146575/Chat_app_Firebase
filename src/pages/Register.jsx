import React, { useContext } from 'react'
import Add from '../img/addAvatar.png'
import toast, { Toaster } from 'react-hot-toast'
import { auth } from '../config/firebase'
import { createUserWithEmailAndPassword, prodErrorMap, updateProfile } from 'firebase/auth'
import { storage, db } from '../config/firebase'
import { uploadBytes, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { setDoc, doc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'


const Register = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const storageRef = ref(storage, displayName);
            await uploadBytesResumable(storageRef, file);

            const downloadURL = await getDownloadURL(storageRef);

            await updateProfile(userCredential.user, {
                displayName: displayName,
                photoURL: downloadURL,
            });

            const userDocRef = doc(db, 'users', userCredential.user.uid);
            await setDoc(userDocRef, {
                uid: userCredential.user.uid,
                displayName,
                email,
                photoURL: downloadURL,
            });

            // Create an empty userChats collection for the user
            await setDoc(doc(db, 'userChats', userCredential.user.uid), {});

            navigate('/');
        } catch (error) {
            console.error(error);

            let errorMessage = 'Registration failed: Something went wrong';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Registration failed: Email is already in use';
            }

            toast.error(errorMessage);
        }
    };

    return (
        <div className='formContainer'>
            <div className='formWrapper'>
                <span className='logo'>Chat App</span>
                <span className='title'> Register</span>
                <form action='' onSubmit={handleSubmit}>
                    <input type='text' name='' id='' placeholder='Display Name' />
                    <input type='email' name='' id='' placeholder='Email' />
                    <input type='password' name='' id='' placeholder='Password' />
                    <input type='file' name='' id='file' className='hidden' />
                    <label htmlFor='file'>
                        {' '}
                        <img src={Add} alt='' /> <span>Add an avatar</span>
                    </label>
                    <button type='submit'>Sign up</button>
                </form>
                <p>
                    Already have an account?{' '}
                    <Link className='link' to={'/login'}>
                        {' '}
                        Login
                    </Link>
                </p>
                <Toaster />
            </div>
        </div>
    );
};

export default Register;
