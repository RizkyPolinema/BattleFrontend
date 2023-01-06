import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { Link, useHistory, useParams } from 'react-router-dom'
import AuthService from '../../../services/auth.service';
import SoalService from '../../admin/service/soal.service';
import JawabanService from '../service/jawaban.service';
import UserService from '../../../services/user.service';
import toast, { Toaster } from 'react-hot-toast';

export default function Game() {

    const { uid } = useParams();
    const history = useHistory();
    const [dataSoal, setdataSoal] = useState([]);
    const [dataJawaban, setdataJawaban] = useState([]);
    const [currentSoal, setCurrentSoal] = useState([]);
    const [currentJawab, setCurrentJawab] = useState(null);
    const [indexSoal, setIndexSoal] = useState();
    // variabel untuk mengeset apakah soal sudah terjawab sebelumnya
    const [answered, setAnswered] = useState(false);

    const [achieve, setAchieve] = useState([])

    // counter jumlah soal yg sudah dijawab
    const [counterAnswered, setCounterAnswered] = useState(null)

    useEffect(() => {
        SoalService.getSoalByIdTugas(uid).then(
            (response) => {
                setdataSoal(response.data.data);
                if (response.data.data.length) {
                    setIndexSoal(0);
                }
                // console.log(response.data.data);
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

        const user = AuthService.getCurrentUser();
        if (user) {
            UserService.getUserById(user.uid).then(res => {
                if (res.data.success) {
                    if (res.data.data.penghargaan && res.data.data.penghargaan != '') setAchieve(JSON.parse(res.data.data.penghargaan));
                }

            }, (error => {
                console.log("Private page", error.response);
                // Invalid token
                if (error.response && error.response.status === 401) {
                    AuthService.logout();
                    history.push("/splash");
                    window.location.reload();
                }
            }));
        }
    }, [history]);

    useEffect(() => {
        if (indexSoal != undefined) {
            setCurrentSoal(dataSoal.filter((f, i) => i == indexSoal)[0]);
        }
        getAllAnswer();
    }, [indexSoal])

    useEffect(() => {
        getAnswer();
    }, [currentSoal])


    const getAllAnswer = () => {
        const user = AuthService.getCurrentUser();

        if (user) {
            JawabanService.getAllJawabanByUID({ id_user: user.uid, id_tugas: uid })
                .then(res => {
                    if (res.data.success) {
                        // console.log(res.data.data);
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

    const getAnswer = () => {
        const user = AuthService.getCurrentUser();

        if (user) {
            JawabanService.getJawabanById({ id_user: user.uid, id_soal: currentSoal.id_soal })
                .then(res => {
                    if (res.data.success) {
                        console.log(res.data.data);
                        // const answer = JSON.parse(res.data.data.jawab);
                        setAnswered(true);
                        setCurrentJawab(res.data.data);
                    } else {
                        setAnswered(false);
                        setCurrentJawab(null);
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

    async function jawab(data, id_soal) {
        const user = AuthService.getCurrentUser();

        const arr = (data == currentSoal.jawaban_benar) ? 1 : 0;

        // untuk menyimpan data jawaban
        toast.promise(
            JawabanService.createJawaban({ id_user: user.uid, id_soal: id_soal, jawab: data, nilai: arr })
                .then(res => {
                    // toast.success('data berhasil disimpan', { position: 'bottom-center' });
                    getAllAnswer();
                    getAnswer();
                    setCounterAnswered(prevState => prevState + 1);
                }, (error) => {
                    console.log("Private page", error.response);
                    // Invalid token
                    if (error.response && error.response.status === 401) {
                        AuthService.logout();
                        history.push("/login");
                        window.location.reload();
                    }
                }), {
            loading: 'Loading...',
            success: 'Data Berhasil Disimpan',
            error: 'gagal menyimpan data',
        }, { position: 'bottom-center' });

        if (arr) {
            UserService.updateCoin({ poin: 10, id_user: user.uid, tipe: 'tambah' })
                .then(res => {
                    console.log(res);
                }, (error) => {
                    console.log("Private page", error.response);
                    // Invalid token
                    if (error.response && error.response.status === 401) {
                        AuthService.logout();
                        history.push("/login");
                        window.location.reload();
                    }
                })
        }

        // set penghargaan
        if (user) {
            if (achieve.length && !achieve[0].unlock) {
                // set achieve index 0 ke true
                achieve[0].unlock = true

                JawabanService.updatePenghargaan({ penghargaan: JSON.stringify(achieve), id_user: user.uid })
                    .then(res => {
                        // toast.success('Berhasil mengganti foto profil');
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
    }

    const generateBackground = (pilihan) => {
        if (currentJawab) {
            if (pilihan == currentJawab?.jawab && currentJawab?.nilai == 1) {
                return 'bg-green-500'
            } else if (pilihan == currentJawab?.jawab && currentJawab?.nilai == 0) {
                return 'bg-red-500'
            } else if (pilihan == currentSoal?.jawaban_benar && currentJawab?.nilai == 0) {
                return 'bg-green-500'
            } else {
                return 'bg-white'
            }
        } else {
            return 'bg-white'
        }
    }

    const generateBackgroundCard = ({ id_soal }) => {
        const jawab = dataJawaban.filter(f => f.id_soal == id_soal).map(m => { return m.nilai })[0];
        if (dataJawaban.some(s => s.id_soal == id_soal)) {
            if (jawab) {
                return 'bg-green-500';
            } else {
                return 'bg-red-500';
            }
        } else {
            return 'bg-custom-gray';
        }
    }

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        console.log(dataJawaban.length, dataSoal.length, counterAnswered);
        // jika sudah menjawab soal ter akhir, akan dilakukan pengecekan apakah jawawaban benar semua
        if (dataSoal.length == dataJawaban.length && counterAnswered == dataSoal.length) {
            // console.log(dataSoal.length, dataJawaban.length, counterAnswered, achieve.length)
            console.log('jawab terakhir');
            if (achieve.length && dataJawaban.every(f => f.nilai == 1)) {
                achieve[1].data = [...achieve[1].data, parseInt(uid)]

                if (!achieve[1].unlock) {
                    achieve[1].unlock = true
                }

                JawabanService.updatePenghargaan({ penghargaan: JSON.stringify(achieve), id_user: user.uid })
                    .then(res => {
                        // toast.success('Berhasil mengganti foto profil');
                    }, (error) => {
                        console.log("Private page", error.response);
                        // Invalid token
                        if (error.response && error.response.status === 401) {
                            AuthService.logout();
                            history.push("/splash");
                            window.location.reload();
                        }
                    });

                console.log('benar semua');
            } else {
                console.log('ada yg salah');
            }
        }
    }, [history, dataJawaban, dataSoal, achieve])

    useEffect(() => {
        if (dataJawaban.length < dataSoal.length) {
            console.log(dataJawaban.length, dataSoal.length);
            setCounterAnswered(dataJawaban.length);
        }
    }, [dataJawaban, dataSoal])


    return (
        <>
            <Toaster />
            <div className='bg-custom-primary min-h-screen p-8'>
                <Link to={'/stageplay'}>
                    <ChevronLeftIcon className='w-10 h-10 text-custom-text bg-custom-secondary rounded-full' />
                </Link>

                <div className='flex mt-16'>

                    <div className='flex flex-wrap bg-white w-[20%] h-fit p-4 rounded'>
                        {dataSoal.map((e, i) => (
                            <button key={i} onClick={() => setIndexSoal(i)} className={`w-[30%] h-fit mx-[10%] mb-[20%] p-1 rounded flex justify-center text-lg text-custom-text font-semibold ${generateBackgroundCard(e)}`}>
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <div className='w-[80%]'>
                        <div className='min-h-[30vh] bg-white ml-4 rounded py-4 px-4 mb-4 '>
                            <p className='text-xl font-medium text-center mb-4'>Soal {indexSoal + 1}</p>
                            <div className='mb-4 flex justify-center'>
                                {currentSoal.data_tambahan && <img src={currentSoal.data_tambahan} alt="gambar soal" className='border w-[50%]' />}
                            </div>
                            <p className='text-lg'>
                                {currentSoal.kalimat_soal}
                            </p>
                        </div>

                        <div className='ml-4 flex flex-wrap'>
                            {currentSoal.pilihan_ganda && JSON.parse(currentSoal.pilihan_ganda).map((e, i) => (
                                <button
                                    key={i}
                                    onClick={() => jawab(String.fromCharCode(64 + (i + 1)), currentSoal.id_soal)}
                                    className={`w-[45%] mx-[2.5%] mb-4 p-3 rounded border-2 border-white ${generateBackground(String.fromCharCode(64 + (i + 1)))}`}
                                    disabled={answered}>
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}
