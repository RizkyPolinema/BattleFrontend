import React, { useState, useEffect } from 'react'
import AuthService from '../services/auth.service'
import { useHistory } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';

export default function Login() {

    const history = useHistory();
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = (route) => {
        history.push(route);
    }

    const handleLogin = async () => {
        try {
            await AuthService.login(username, password)
                .then((res) => {
                    console.log(res);
                    toast.success('Berhasil Login', { position: 'bottom-center' });
                    // navigate('/home')
                    if (res.role === '1' || res.role === '0') {
                        setTimeout(() => {
                            navigate('/app/dashboard')
                            window.location.reload();
                        }, 1000);
                    } else {
                        setTimeout(() => {
                            navigate('/home')
                            window.location.reload();
                        }, 1000);
                    }
                }, (error) => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className='bg-custom-primary'>
                <div className='flex pt-32'>
                    <div className='w-48% flex items-center justify-center'>
                        <div className='w-1/2 bg-custom-text text-white border-2 border-white px-4 py-8 rounded-lg'>

                            <h1 className='text-2xl text-center'>Login</h1>

                            <div className='flex flex-col mx-8 mt-4'>
                                <label>Username</label>
                                <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" className='text-custom-text mt-2 px-1 py-1 rounded' />
                            </div>

                            <div className='flex flex-col mx-8 mt-4'>
                                <label>Password</label>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='text-custom-text mt-2 px-1 py-1 rounded' />
                            </div>

                            <div className='mx-8 mt-4'>
                                <button onClick={() => handleLogin()} className='text-custom-text font-semibold bg-gray-400 px-3 py-1 rounded'>Masuk</button>
                            </div>
                        </div>
                    </div>

                    <div className='w-48% flex items-center justify-center'>
                        <img src="/assets/title2.jpg" alt="title" className='w-3/4' />
                    </div>
                </div>

                <img src="/assets/soldier.png" alt="banner" className='w-full' />
            </div>
        </>
    )
}
