import { ChevronLeftIcon, UserIcon } from '@heroicons/react/solid'
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import ModalProfil from '../component/ModalProfil'
import UserService from '../../../services/user.service'
import AuthService from '../../../services/auth.service'
import JawabanService from '../service/jawaban.service'

export default function Leaderboard() {

    const history = useHistory();
    const [dataUser, setDataUser] = useState([])
    
    const [isOpen, setIsOpen] = useState(false);
    // data temporary sebelum dikirim ke ModalProfil
    const [dataUserModal, setDataUserModal] = useState();
    
    const [currentUser, setCurrentUser] = useState();

    const navigate = (route) => {
        history.push(route);
    }

    useEffect(() => {
        getAllUsers();
    }, [])


    const getAllUsers = () => {
        JawabanService.getRanking().then(
            (response) => {
                const data = response.data.data.filter((e) => e.role === "2");
                if (data.length) {
                    setDataUser(data.sort((a,b) => b.total_nilai - a));
                }
            },
            (error) => {
                console.log("Private page", error.response);
                // Invalid token
                if (error.response && error.response.status === 401) {
                    AuthService.logout();
                    navigate('/login')
                    window.location.reload();
                }
            }
        );
    };

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

    const generateStar = (value) => {
        if (value === 1) {
            return (<img className='w-12 h-12' src='/assets/star.png' alt='star' />)
        } else if (value === 2) {
            return (<img className='w-12 h-12' src='/assets/star-1.png' alt='star' />)
        } else if (value === 3) {
            return (<img className='w-12 h-12' src='/assets/star-2.png' alt='star' />)
        } else {
            return (<p className='flex justify-center items-center w-10 h-10 m-1 bg-gray-400 text-custom-text rounded-full text-sm'>{value}</p>)
        }
    }

    const openModal = (user) => {
        setDataUserModal(user);
        setIsOpen(true);
    }

    return (
        <>
            <div className='bg-custom-primary min-h-screen p-8'>
                <Link to={'/home'}>
                    <ChevronLeftIcon className='w-10 h-10 text-custom-text bg-custom-secondary rounded-full' />
                </Link>

                <div className='flex justify-center'>
                    <h1 className='text-white font-bold text-3xl mb-4'>PERINGKAT</h1>
                </div>

                <div className='bg-white w-full rounded-lg p-8'>
                    {currentUser && dataUser.filter(f => f.id_angkatan == currentUser.id_angkatan).map((e, i) => (

                        <div key={i} className='flex items-center justify-between mb-4'>
                            <div className='flex items-center'>
                                {generateStar(i + 1)}

                                <button onClick={() => openModal(e)}>
                                    <UserIcon className='w-10 h-10 p-2 bg-custom-secondary text-white ml-4 rounded-full' />
                                </button>

                                <p className='text-custom-text ml-4 font-semibold text-lg'>{e?.nama}</p>
                            </div>
                            <div>
                                <p className='text-custom-text ml-4 font-semibold text-lg'>{e?.total_nilai}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* <Modal isOpen={isOpen} setIsOpen={(e) => setIsOpen(e)} Title={'Hello'} Body={''} /> */}
            <ModalProfil isOpen={isOpen} setIsOpen={(e) => setIsOpen(e)} user={dataUserModal} />
        </>
    )
}
