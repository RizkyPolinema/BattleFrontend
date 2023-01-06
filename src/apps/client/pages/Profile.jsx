import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { ChevronLeftIcon, LogoutIcon, PencilIcon, AcademicCapIcon, FireIcon } from '@heroicons/react/solid'
import { UserIcon } from '@heroicons/react/outline'
import AuthService from '../../../services/auth.service';
import UserService from '../../../services/user.service';
import ReactTooltip from "react-tooltip";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from "@windmill/react-ui";
import toast, {Toaster} from 'react-hot-toast';

export default function Profile() {

    const history = useHistory();

    const [currentUser, setCurrentUser] = useState();
    const [achieve, setAchieve] = useState([])
    const [fotoProfil, setFotoProfil] = useState([]);
    const [modalEditProfil, setModalEditProfil] = useState(false);

    function openModalEditProfil() {
        setModalEditProfil(true);
    }

    function closeModalEditProfil() {
        setModalEditProfil(false);
    }

    const navigate = (route) => {
        history.push(route);
    }

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            UserService.getUserById(user.uid).then(res => {
                if (res.data.success) {
                    console.log(res.data.data);
                    setCurrentUser(res.data.data);

                    if (res.data.data.penghargaan && res.data.data.penghargaan != '') setAchieve(JSON.parse(res.data.data.penghargaan));
                }

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

    const logOut = () => {
        AuthService.logout();
        navigate('/');
    }

    const getCurrentUser = () => {
        const user = AuthService.getCurrentUser();

        if (user) {
            UserService.getUserById(user.uid).then(res => {
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
    }

    const editProfil = (changed) => {
        let arrayTemp = [...fotoProfil];

        arrayTemp.forEach((e, i) => {
            if (e.nama === changed) {
                e.use = true;
            } else {
                e.use = false;
            }
        });

        const user = AuthService.getCurrentUser();

        if (user) {
            UserService.updateFotoProfil({ profil: JSON.stringify(arrayTemp), id_user: user.uid })
                .then(res => {
                    getCurrentUser();
                    toast.success('Berhasil mengganti foto profil');
                    closeModalEditProfil();
                }, (error) => {
                    console.log("Private page", error.response);
                    // Invalid token
                    if (error.response && error.response.status === 401) {
                        AuthService.logout();
                        navigate("/splash");
                        window.location.reload();
                    }
                });
        }

    }

    const generateFotoProfil = () => {
        if (currentUser) {
            const data = (currentUser.profil && currentUser.profil !== '') && JSON.parse(currentUser.profil);
            setFotoProfil(data);
        }
    }

    const generateListImage = () => {
        let arrayTemp = []

        fotoProfil.forEach((e, i) => {
            if (e.unlock === true && e.use === true) {
                arrayTemp.push(
                    <button
                        key={i}
                        className='w-47% mx-1.5% mb-8 flex flex-col justify-between items-center bg-custom-secondary shadow-custom-shadow-yellow rounded-md'
                        onClick={() => toast.success('Foto sudah terpasang sebelumnya !!!')}
                    >
                        <img className='my-4' src={`/assets/${e.nama}.svg`} alt="profil" />
                    </button>)
            } else if (e.unlock === true && e.use === false) {
                arrayTemp.push(
                    <button
                        key={i}
                        className='w-47% mx-1.5% mb-8 flex flex-col justify-between items-center bg-custom-yellow shadow-custom-shadow-yellow rounded-md'
                        onClick={() => editProfil(e.nama)}
                    >
                        <img className='my-4' src={`/assets/${e.nama}.svg`} alt="profil" />
                    </button>)
            } else if (e.unlock === false) {
                arrayTemp.push(
                    <button
                        key={i}
                        className='w-47% mx-1.5% mb-8 flex flex-col justify-between items-center bg-gray-300 shadow-custom-shadow-gray rounded-md'
                        onClick={() => toast.error('Anda belum membuka profil ini !!!')}
                    >
                        <img className='my-4' src={`/assets/${e.nama}.svg`} alt="profil" />
                    </button>)
            }
        });

        return arrayTemp;
    }

    useEffect(() => {
        generateFotoProfil()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])

    return (
        <>
            <Toaster />
            <div className='bg-custom-primary h-screen flex justify-center'>
                <div className='w-1/2 h-fit bg-white my-4 p-4 rounded-md'>

                    {/* navigation top */}
                    <div className='flex justify-between items-center'>
                        <Link to={'/home'}>
                            <ChevronLeftIcon className='w-10 h-10 text-custom-text bg-custom-secondary rounded-full' />
                        </Link>

                        <div>
                            <button onClick={() => openModalEditProfil()}>
                                <PencilIcon className='w-10 h-10 text-custom-text bg-custom-secondary rounded-full p-2 mr-4' />
                            </button>
                            <button onClick={() => logOut()}>
                                <LogoutIcon className='w-10 h-10 text-custom-text bg-custom-secondary rounded-full p-2' />
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-col items-center mt-4 mb-8'>
                        { fotoProfil.some(s => s.unlock && s.use) ? (<img src={fotoProfil.filter(f => f.unlock === true && f.use === true).map(e => ('/assets/' + e.nama + '.svg'))} alt="profil" />)
                        : <UserIcon className='w-48 h-48 p-2 bg-custom-secondary text-white rounded-full' /> }

                        <h1 className='text-custom-text font-medium text-2xl mt-4'>{currentUser?.nama}</h1>
                    </div>

                    <div className=' p-4 rounded'>
                        <div className='flex justify-center'>
                            <h2 className='text-center bg-custom-text text-white p-2 text-lg rounded'>Penghargaan</h2>
                        </div>

                        <div className='w-full flex justify-evenly my-8'>
                            {(achieve.length && achieve[0].unlock) &&
                                (<>
                                    <a data-tip="Penghargaan diberikan ketika berhasil menyelesaikan tugas pertama kali" className='bg-white w-24 h-24 rounded-full shadow border-4 flex flex-col justify-center items-center'>
                                        <AcademicCapIcon className='w-14 h-14 text-custom-primary rounded-full p-2' />
                                        {/* <img className='w-16 h-16' src='/assets/star.png' alt='star' /> */}
                                    </a>
                                    <ReactTooltip place="bottom" type="warning" effect="solid" />
                                </>)}

                            {(achieve.length && achieve[1].unlock) &&
                                (<>
                                    <a data-tip="Penghargaan diberikan setiap kali mendapatkan nilai 100" className='bg-white w-24 h-24 rounded-full shadow border-4 flex flex-col justify-center items-center'>
                                        <FireIcon className='w-14 h-14 text-custom-primary rounded-full p-2' />
                                        {achieve[1].data.length}
                                        {/* <img className='w-16 h-16' src='/assets/star-1.png' alt='star' /> */}
                                    </a>
                                    <ReactTooltip place="bottom" type="warning" effect="solid" />
                                </>)}


                            {(achieve.length && achieve.every(e => e.unlock == false)) && (
                                <p className='text-gray-500'>Belum mendapatkan penghargaan</p>
                            )}
                            {/* <ReactTooltip place="top" type="warning" effect="solid"/> */}
                            {/* <div className='bg-white p-4 rounded-full shadow'>
                                <img className='w-16 h-16' src='/assets/star-2.png' alt='star' />
                            </div> */}
                        </div>
                    </div>

                </div>
            </div>

            <Modal isOpen={modalEditProfil} onClose={closeModalEditProfil}>
                <ModalHeader className='text-center'>Ganti Foto Profil</ModalHeader>
                <ModalBody>
                    <div className='w-full h-50vh flex flex-wrap overflow-y-auto'>
                        {generateListImage()}
                    </div>
                </ModalBody>
                <ModalFooter>
                    <div className="hidden sm:block">
                        <Button layout="outline" onClick={closeModalEditProfil}>
                            Batal
                        </Button>
                    </div>
                    <div className="block w-full sm:hidden">
                        <Button block size="large" layout="outline" onClick={closeModalEditProfil}>
                            Batal
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    )
}
