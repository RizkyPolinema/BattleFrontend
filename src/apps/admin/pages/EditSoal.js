import React, { useState, useEffect } from "react";
import PageTitle from "../../../components/Typography/PageTitle";
import SectionTitle from "../../../components/Typography/SectionTitle";
import {
  Label,
  Select,
  Textarea,
  HelperText,
  Input,
  Button
} from "@windmill/react-ui";
import { useHistory, useParams, useLocation } from 'react-router-dom';
import AuthService from "../../../services/auth.service";
import HurufService from "../service/huruf.service";
import SoalService from "../service/soal.service";
import toast, { Toaster } from 'react-hot-toast';
import SoalTipe1 from "./component/EditSoal/SoalTipe1";
import SoalTipe2 from "./component/EditSoal/SoalTipe2";
import SoalTipe3 from "./component/EditSoal/SoalTipe3";
import { useForm } from "react-hook-form";
import { Switch } from "@headlessui/react";

function EditSoal() {

  // tipesoal dari parameter
  const { uid } = useParams();
  const history = useHistory();
  const { state: { data: detailSoal } } = useLocation();
  const { register, formState: { errors }, handleSubmit, setValue } = useForm();
  const [editImage, setEditImage] = useState(false)

  useEffect(() => {

    if (detailSoal) {
      console.log(detailSoal);
      const pilgan = JSON.parse(detailSoal?.pilihan_ganda);

      setValue('kalimatsoal', detailSoal?.kalimat_soal);
      setValue('pilihan_a', pilgan[0]);
      setValue('pilihan_b', pilgan[1]);
      setValue('pilihan_c', pilgan[2]);
      setValue('pilihan_d', pilgan[3]);
      setValue('jawaban_benar', detailSoal?.jawaban_benar);

    }
  }, [history]);

  const handleSimpan = (data) => {
    console.log({ ...data, uid });

    if (editImage) {

      if (data.gambarsoal.length) {
        let extensionFile = data.gambarsoal[0].name.toLowerCase().split('.').pop();

        console.log(extensionFile);
        if (extensionFile === 'jpg' || extensionFile === 'jpeg' || extensionFile === 'png') {
          const formData = new FormData();
          formData.append('gambarsoal', data.gambarsoal[0]);
          formData.append('id_soal', detailSoal.id_soal);
          formData.append('kalimat_soal', data.kalimatsoal);
          formData.append('pilihan_ganda', JSON.stringify([data.pilihan_a, data.pilihan_b, data.pilihan_c, data.pilihan_d]));
          formData.append('jawaban_benar', data.jawaban_benar);
          formData.append('data_tambahan', '');
          formData.append('editimage', editImage);

          SoalService.updateSoal2(formData)
            .then(response => {
              toast.success('Soal berhasil diedit', { position: 'bottom-center' });
              setTimeout(() => {
                history.push(`/app/detailtugas/${uid}`);
                window.location.reload();
              }, 3000);
            }, (error) => {
              console.log(error);
            });
        } else {
          toast.error('Ekstensi file harus jpg/jpeg/png', { position: 'bottom-center' })
        }
      } else {
        const formData = new FormData();
        formData.append('gambarsoal', []);
        formData.append('id_soal', detailSoal.id_soal);
        formData.append('kalimat_soal', data.kalimatsoal);
        formData.append('pilihan_ganda', JSON.stringify([data.pilihan_a, data.pilihan_b, data.pilihan_c, data.pilihan_d]));
        formData.append('jawaban_benar', data.jawaban_benar);
        formData.append('data_tambahan', '');
        formData.append('editimage', editImage);

        SoalService.updateSoal2(formData)
            .then(response => {
              toast.success('Soal berhasil diedit', { position: 'bottom-center' });
              setTimeout(() => {
                history.push(`/app/detailtugas/${uid}`);
                window.location.reload();
              }, 3000);
            }, (error) => {
              console.log(error);
            });
      }
    } else {
      const formData = new FormData();
        formData.append('gambarsoal', []);
        formData.append('id_soal', detailSoal.id_soal);
        formData.append('kalimat_soal', data.kalimatsoal);
        formData.append('pilihan_ganda', JSON.stringify([data.pilihan_a, data.pilihan_b, data.pilihan_c, data.pilihan_d]));
        formData.append('jawaban_benar', data.jawaban_benar);
        formData.append('data_tambahan', '');
        formData.append('editimage', editImage);

        SoalService.updateSoal2(formData)
            .then(response => {
              toast.success('Soal berhasil diedit', { position: 'bottom-center' });
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
      <PageTitle>Edit Data Soal</PageTitle>

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
              <span className="mb-2">Edit Gambar soal ?</span>
              <div className="block md:hidden mt-2">
                <Switch
                  checked={editImage}
                  onChange={setEditImage}
                  className={`${editImage ? 'bg-teal-900' : 'bg-teal-700'}
                  relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${editImage ? 'translate-x-9' : 'translate-x-0'}
                    pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                </Switch>
              </div>
              <div className="hidden md:block mt-2">
                <Switch
                  checked={editImage}
                  onChange={setEditImage}
                  className={`${editImage ? 'bg-teal-900' : 'bg-teal-700'}
                  relative inline-flex h-[29px] w-[65px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${editImage ? 'translate-x-9' : 'translate-x-0'}
                    pointer-events-none inline-block h-[25px] w-[25px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                    />
                </Switch>
              </div>
            </Label>

            { editImage &&
            (<><Label className='mt-3'>
              <span>Gambar soal (optional)</span>
              <Input {...register('gambarsoal')} className='mt-1' type='file' />
            </Label>
            <div className="mb-3">
              {errors.gambarsoal?.message && (
                <HelperText valid={false}>{errors.gambarsoal?.message}</HelperText>
              )}
            </div></>)}
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

export default EditSoal;
