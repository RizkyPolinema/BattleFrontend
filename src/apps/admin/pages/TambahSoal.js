import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/Typography/PageTitle";
import SectionTitle from "../../../components/Typography/SectionTitle";
import {
  Label,
  Select,
  Textarea,
  HelperText,
  Button,
  Input
} from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from 'react-router-dom';
import AuthService from "../../../services/auth.service";
import SoalService from "../service/soal.service";
import toast, { Toaster } from 'react-hot-toast';
import SoalTipe1 from "./component/TambahSoal/SoalTipe1";
import SoalTipe2 from "./component/TambahSoal/SoalTipe2";
import SoalTipe3 from "./component/TambahSoal/SoalTipe3";

function TambahSoal() {

  const { uid } = useParams();
  const history = useHistory();

  const { register, formState: { errors }, handleSubmit, setValue } = useForm();
  const [huruf, setHuruf] = useState([]);

  const [hurufSoal, setHurufSoal] = useState([]);

  // dibuat untuk array garis dan titik soal tipe 3
  const [lines, setLines] = useState([]);
  const [dot, setDot] = useState([]);

  const [tipeSoal, setTipeSoal] = useState('1');

  useEffect(() => {

  }, [history]);

  useEffect(() => {
    // console.log(hurufSoal);
  }, [hurufSoal])

  const createSoal = (data) => {
    console.log(data);
    // SoalService.createSoal(data).then(res => {

    // }, (err) => {
    //   console.log(err);
    // })
  }

  const tambahHurufSoal = (data) => {
    data && setHurufSoal([...hurufSoal, data]);
  }

  const hapusHurufSoal = (index) => {
    const data = [...hurufSoal];
    data.splice(index, 1);
    setHurufSoal(data)
  }

  const handleSimpan = (data) => {
    console.log(data.gambarsoal.length);

    if (data.gambarsoal.length) {

      let extensionFile = data.gambarsoal[0].name.toLowerCase().split('.').pop();

      if (extensionFile === 'jpg' || extensionFile === 'jpeg' || extensionFile === 'png' || extensionFile === 'gif') {
        const formData = new FormData();
        formData.append('gambarsoal', data.gambarsoal[0]);
        formData.append('id_tugas', uid);
        formData.append('kalimat_soal', data.kalimatsoal);
        formData.append('pilihan_ganda', JSON.stringify([data.pilihan_a, data.pilihan_b, data.pilihan_c, data.pilihan_d]));
        formData.append('jawaban_benar', data.jawaban_benar);
        formData.append('data_tambahan', '');

        SoalService.createSoal2(formData)
          .then(response => {
            toast.success('Soal berhasil dibuat', { position: 'bottom-center' });
            setTimeout(() => {
              history.push(`/app/detailtugas/${uid}`);
              window.location.reload();
            }, 3000);
          }, (error) => {
            console.log(error);
          });
      } else {
        toast.error('Ekstensi file harus jpg/jpeg/png/gif', { position: 'bottom-center' })
      }
    } else {
      const formData = new FormData();
      formData.append('gambarsoal', []);
      formData.append('id_tugas', uid);
      formData.append('kalimat_soal', data.kalimatsoal);
      formData.append('pilihan_ganda', JSON.stringify([data.pilihan_a, data.pilihan_b, data.pilihan_c, data.pilihan_d]));
      formData.append('jawaban_benar', data.jawaban_benar);
      formData.append('data_tambahan', '');

      SoalService.createSoal2(formData)
        .then(response => {
          toast.success('Soal berhasil dibuat', { position: 'bottom-center' });
          setTimeout(() => {
            history.push(`/app/detailtugas/${uid}`);
            window.location.reload();
          }, 3000);
        }, (error) => {
          console.log(error);
      });
    }
  }

  return (
    <>
      <Toaster />
      <PageTitle>Tambah Data Soal</PageTitle>

      <div className='mb-8 w-full'>
        <form onSubmit={handleSubmit(handleSimpan)} >
          <div className='px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
            <Label className='mb-3'>
              <span>Kalimat Soal* </span>
              <Textarea
                {...register('kalimatsoal', { required: 'Kalimat soal is required' })}
                className='mt-1'
                rows='4'
                placeholder='Tuliskan kalimat untuk soal...'
              />
            </Label>
            <div className="mb-3">
              {errors.kalimatsoal?.message && (
                <HelperText valid={false}>{errors.kalimatsoal?.message}</HelperText>
              )}
            </div>

            <Label className='mt-3'>
              <span>Gambar soal (optional)</span>
              <Input {...register('gambarsoal')} className='mt-1' type='file' />
            </Label>
            <div className="mb-3">
              {errors.gambarsoal?.message && (
                <HelperText valid={false}>{errors.gambarsoal?.message}</HelperText>
              )}
            </div>
          </div>

          <SectionTitle>Pilihan Ganda</SectionTitle>
          <div className='px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800 flex flex-wrap'>
            <div className="w-1/2 px-4">
              <Label className='mb-3'>
                <span>Pilihan A*</span>
                <Input {...register('pilihan_a', { required: 'Pilihan A is required' })} type="text" placeholder="Masukan Pilihan A" className="mt-2" />
              </Label>
              <div className="mb-3">
                {errors.pilihan_a?.message && (
                  <HelperText valid={false}>{errors.pilihan_a?.message}</HelperText>
                )}
              </div>
            </div>
            <div className="w-1/2 px-4">
              <Label className='mb-3'>
                <span>Pilihan B*</span>
                <Input {...register('pilihan_b', { required: 'Pilihan B is required' })} type="text" placeholder="Masukan Pilihan B" className="mt-2" />
              </Label>
              <div className="mb-3">
                {errors.pilihan_b?.message && (
                  <HelperText valid={false}>{errors.pilihan_b?.message}</HelperText>
                )}
              </div>
            </div>
            <div className="w-1/2 px-4">
              <Label className='mb-3'>
                <span>Pilihan C*</span>
                <Input {...register('pilihan_c', { required: 'Pilihan C is required' })} type="text" placeholder="Masukan Pilihan C" className="mt-2" />
              </Label>
              <div className="mb-3">
                {errors.pilihan_c?.message && (
                  <HelperText valid={false}>{errors.pilihan_c?.message}</HelperText>
                )}
              </div>
            </div>
            <div className="w-1/2 px-4">
              <Label className='mb-3'>
                <span>Pilihan D*</span>
                <Input {...register('pilihan_d', { required: 'Pilihan D is required' })} type="text" placeholder="Masukan Pilihan D" className="mt-2" />
              </Label>
              <div className="mb-3">
                {errors.pilihan_d?.message && (
                  <HelperText valid={false}>{errors.pilihan_d?.message}</HelperText>
                )}
              </div>
            </div>
          </div>

          <SectionTitle>Jawaban Benar</SectionTitle>
          <div className='px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800'>
            <Label className="w-1/3">
              <Select {...register('jawaban_benar', { required: 'Harap pilih salah satu' })}>
                <option value={''}>-</option>
                <option value={'A'}>Pilihan A</option>
                <option value={'B'}>Pilihan B</option>
                <option value={'C'}>Pilihan C</option>
                <option value={'D'}>Pilihan D</option>
              </Select>
            </Label>
            <div className="mb-3">
              {errors.jawaban_benar?.message && (
                <HelperText valid={false}>{errors.jawaban_benar?.message}</HelperText>
              )}
            </div>
          </div>


          <Button type='submit'>Simpan</Button>
        </form>
      </div>
      {/* {showSelectedOption()} */}
    </>
  );
}

export default TambahSoal;
