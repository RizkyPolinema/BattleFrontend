import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { Link, useHistory } from 'react-router-dom'
import AuthService from '../../../services/auth.service';
import TugasService from '../service/tugas.service';
import JawabanService from '../service/jawaban.service';
import SoalService from '../../admin/service/soal.service';

export default function Stage() {

    const history = useHistory();
    const [dataTugas, setDataTugas] = useState([]);
    const [dataJawaban, setdataJawaban] = useState([]);
    const [dataSoal, setdataSoal] = useState([]);

    useEffect(() => {
        TugasService.getAllTugas().then(
            (response) => {
                setDataTugas(response.data.tugas);
                console.log(response.data.tugas);
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

        getAllAnswer();
    }, [history]);

    const getSoalByIdTugas = (id_tugas) => {
        SoalService.getSoalByIdTugas(id_tugas).then(
            (response) => {
                // setdataSoal(response.data.data);
                return response.data.data;
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

    const getAllAnswer = () => {
        const user = AuthService.getCurrentUser();

        if (user) {
            JawabanService.getAllJawaban()
                .then(res => {
                    if (res.data.success) {
                        console.log(res.data.data);
                        // const answer = JSON.parse(res.data.data.jawab);
                        setdataJawaban(res.data.data);
                    }
                }, (error) => {
                    console.log("Private page", error.response);
                    // Invalid token
                    if (error.response && error.response.status === 401) {
                        AuthService.logout();
                        history.push("/splash");
                        window.location.reload();
                    }
                });
        }
    }

    //   { rumus : (100 / jumlahsoal) * jawabanbenar}
     function generateNilai(id_tugas) {

        const data = dataTugas.filter(f => f.id_tugas == id_tugas);
        const score = dataJawaban.filter(f => f.id_tugas == id_tugas && f.nilai == 1)
        
        if (data.length && score) {
            // // console.log(data.total_soal)
            // // console.log(score.length)
            return (~~(100 / data[0].total_soal) * score.length)
            // return (~~(100 / totalSoal.length) * score.length)
        }
    }

    return (
        <>
            <div className='bg-custom-primary h-screen'>
                <img src="/assets/bg-2.svg" alt="" className='w-full absolute bottom-0' />

                <div className='p-8'>
                    <Link to={'/home'}>
                        <ChevronLeftIcon className='w-10 h-10 text-custom-text bg-custom-secondary rounded-full' />
                    </Link>

                    <div className='flex justify-center mt-8'>
                        <h1 className='text-3xl font-bold text-custom-text bg-custom-gray px-3 py-1 rounded'>Stage</h1>
                    </div>

                    <div className='flex flex-wrap mt-16'>
                        {dataTugas.map((e, i) => (
                            <Link key={i} to={`/game/${e.id_tugas}`} className='relative w-31% mx-1% mb-1% bg-custom-gray p-4 rounded flex justify-center'>
                                <p className='text-lg text-custom-text font-semibold'>Minggu {i + 1}</p>
                                { (dataJawaban.filter(f => f.id_tugas == e.id_tugas).length == e.total_soal) && <p className='absolute top-0 right-0 bg-custom-secondary p-2 rounded'>{generateNilai(e.id_tugas)}</p>}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}
