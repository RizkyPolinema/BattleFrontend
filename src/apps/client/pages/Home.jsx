import React, { useEffect, useState } from 'react'
import { UserIcon, CogIcon, CurrencyDollarIcon } from '@heroicons/react/solid'
import { LogoutIcon } from '@heroicons/react/outline'
import { Link, useHistory } from 'react-router-dom'
import MyDialog from '../component/ModalHome';
import AuthService from '../../../services/auth.service';
import UserService from '../../../services/user.service';

export default function Home() {
    const history = useHistory();

    const [isOpen, setIsOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState();
    
    const navigate = (route) => {
        history.push(route);
    }

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      UserService.getUserById(user.uid).then(res => {
        console.log(res.data.data);
        setCurrentUser(res.data.data);
      }, (error => {
        console.log("Private page", error.response);
        // Invalid token
        if (error.response && error.response.status === 401) {
          AuthService.logout();
          navigate("/splash");
          window.location.reload();
        }
      }));
    }
  }, [])

  return (
    <>
      <div className='bg-custom-primary h-screen'>

        <div className='flex justify-between  p-8'>
          <div className='flex'>
            <div className='flex items-center mr-4'>
              <button onClick={() => navigate('/profil')}>
                <UserIcon className='
          w-10 h-10 text-cu\stom-text bg-custom-secondary p-1 mr-4 rounded-sm' />
              </button>
              <p className='font-bold text-lg'>{currentUser?.nama}</p>
            </div>

            <div className='bg-custom-secondary paralellogram flex items-center'>
              <CurrencyDollarIcon className='w-10 h-10 text-custom-text p-2 ml-4' />
              <p className='font-bold mr-12'>{currentUser?.poin}</p>
            </div>
          </div>

        </div>

        <div className='flex'>
          <div className='w-30% flex flex-col justify-center p-8'>
            {/* <div className='bg-slate-400 h-8 w-14 card-corner'>Home</div> */}
            <button className='w-90% mb-4' onClick={() => setIsOpen(!isOpen)}>
              <img src="/assets/btn.png" alt="btn" />
            </button>
            <button className='w-90% mb-4' onClick={() => navigate('/leaderboard')}>
              <img src="/assets/btn-1.png" alt="btn" />
            </button>
            <button className='w-90%' onClick={() => navigate('/toko')}>
              <img src="/assets/btn-2.png" alt="btn" />
            </button>
          </div>

          <div className='w-70% flex items-center'>
            <img className='w-40% absolute bottom-0 right-0 z-10' src='/assets/building.png' alt='building' />
            <img src="/assets/title2.jpg" alt="title" className='w-65%' />
          </div>

          <img src="/assets/bg-2.svg" alt="" className='w-full absolute bottom-0 z-0' />
        </div>
      </div>

      <MyDialog isOpen={isOpen} setIsOpen={(e) => setIsOpen(e)} />
    </>
  )
}

// WARUNKWOWMLG