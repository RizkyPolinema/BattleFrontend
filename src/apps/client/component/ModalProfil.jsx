import React, { useEffect, useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { UserIcon, FireIcon, AcademicCapIcon } from '@heroicons/react/solid'
import ReactTooltip from "react-tooltip";

export default function MyDialog({ isOpen, setIsOpen, user }) {
    // let [isOpen, setIsOpen] = useState(true)
    const [fotoProfil, setFotoProfil] = useState([]);
    const [achieve, setAchieve] = useState([])

    function closeModal() {
        setIsOpen(false)
    }

    const generateFotoProfil = () => {
        if (user) {
            const data = (user.profil && user.profil !== '') && JSON.parse(user.profil);
            setFotoProfil(data);
        }
    }

    useEffect(() => {
        generateFotoProfil()

        if(user){
            if (user.penghargaan && user.penghargaan != '') setAchieve(JSON.parse(user.penghargaan));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])


    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                                <div className='w-full flex flex-col items-center'>
                                    {fotoProfil.some(s => s.unlock && s.use) ? (<img src={fotoProfil.filter(f => f.unlock === true && f.use === true).map(e => ('/assets/' + e.nama + '.svg'))} alt="profil" />)
                                        : <UserIcon className='w-48 h-48 p-2 bg-custom-secondary text-white rounded-full' />}

                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        {user?.nama}
                                    </Dialog.Title>
                                </div>



                                <div className="mt-2">
                                    {/* <p className="text-sm text-gray-500">
                                        Penghargaan
                                    </p> */}

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
                                    </div>

                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={closeModal}
                                    >
                                        tutup
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}