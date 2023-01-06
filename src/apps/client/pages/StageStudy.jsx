import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { Link, useHistory } from 'react-router-dom'
import MateriService from '../../admin/service/materi.service';
import AuthService from '../../../services/auth.service';

export default function StageStudy() {

    const history = useHistory();
    const [dataMateri, setDataMateri] = useState([]);

    const getAllMateri = () => {
        MateriService.getAllMateri().then(
            (response) => {
                console.log(response.data.data);
                setDataMateri(response.data.data);
                // setdataSoal(response.data.soal);
            },
            (error) => {
                console.log("Private page", error.response);
                // Invalid token
                if (error.response && error.response.status === 401) {
                    AuthService.logout();
                    history.push("/login");
                    window.location.reload();
                }
            }
        );
    }

    useEffect(() => {
      getAllMateri();
    }, [])
    

    return (
        <>
            <div className='bg-custom-primary h-screen'>
                <img src="/assets/bg-2.svg" alt="" className='w-full absolute bottom-0' />

                <div className='p-8'>
                    <Link to={'/home'}>
                        <ChevronLeftIcon className='w-10 h-10 text-custom-text bg-custom-secondary rounded-full' />
                    </Link>

                    <div className='flex justify-center mt-8'>
                        <h1 className='text-3xl font-bold text-custom-text bg-custom-gray px-3 py-1 rounded'>Belajar</h1>
                    </div>

                    <div className='flex flex-wrap mt-16'>
                        {dataMateri.map((e, i) => (
                        <Link key={i} to={`/detailmateri/${e.id_materi}`} className='w-31% mx-1% mb-1% bg-custom-gray p-4 rounded flex flex-col justify-center'>
                            <p className='text-lg text-custom-text font-semibold'>Materi {i + 1} <br />
                            </p>
                            <p className='text-custom-text font-medium'>
                                {e?.judul_materi}
                            </p>
                        </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
