import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthService from "../../../services/auth.service";
import MateriService from "../service/materi.service";

import PageTitle from "../../../components/Typography/PageTitle";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, HelperText } from "@windmill/react-ui";
import { EditIcon, TrashIcon, PlusIcon } from "../../../icons";
import toast, { Toaster } from "react-hot-toast";

function DataMateri() {
  const [dataMateri, setDataMateri] = useState([]);
  const [dataSoal, setdataSoal] = useState([]);

  const [modalCreate, setModalCreate] = useState(false)
  const [modalUpdate, setModalUpdate] = useState(false)

  const history = useHistory();
  const { register, formState: { errors }, handleSubmit, resetField } = useForm();
  const { register: register2, formState: { errors: errors2 }, handleSubmit: handleSubmit2, setValue: setValue2 } = useForm();

  useEffect(() => {
    MateriService.getAllMateri().then(
      (response) => {
        console.log(response.data.data);
        setDataMateri(response.data.data);
        setdataSoal(response.data.soal);
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
  }, [history]);

  function openModalCreate() {
    setModalCreate(true);
  }

  function closeModalCreate() {
    resetField('judul_materi');
    setModalCreate(false);
  }

  function openModalUpdate(id) {
    id && setValue2('id_materi', id);
    id && setValue2('judul_materi', dataMateri.filter(e => e.id_materi === id).map(e => e.judul_materi));
    setModalUpdate(true);
  }

  function closeModalUpdate() {
    setModalUpdate(false);
  }

  const getAllMateri = () => {
    MateriService.getAllMateri().then(
      (response) => {
        setDataMateri(response.data.data);
        setdataSoal(response.data.soal);
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

  // const createMateri = (data) => {
  //   MateriService.createMateri(data).then(res => {
  //     getAllMateri();
  //     closeModalCreate();
  //     toast.success('Data berhasil dibuat', { position: 'bottom-center'});
  //   }, (err) => {
  //     console.log(err);
  //   })
  // }

  const createMateri = (data) => {
    let extensionFile = data.filemateri[0].name.split('.').pop();

    if (extensionFile === 'pdf') {
      const formData = new FormData();
      formData.append('filemateri', data.filemateri[0]);
      formData.append('judul_materi', data.judul_materi);

      MateriService.createMateri(formData)
        .then(response => {
          toast.success('Materi berhasil dibuat', { position: 'bottom-center' });
          // setTimeout(() => {
          //   history.push(`/app/detailtugas/${uid}`);
          //   window.location.reload();
          // }, 3000);
        }, (error) => {
          console.log(error);
        });
    } else {
      toast.error('Ekstensi file harus pdf', { position: 'bottom-center' })
    }
  }

  const updateMateri = (data) => {
    let extensionFile = data.filemateri[0].name.split('.').pop();

    if (extensionFile === 'pdf') {
      const formData = new FormData();
      formData.append('id_materi', data.id_materi);
      formData.append('filemateri', data.filemateri[0]);
      formData.append('judul_materi', data.judul_materi);

      MateriService.updateMateri(formData).then(res => {
        getAllMateri();
        closeModalUpdate();
        toast.success('Data berhasil diedit', { position: 'bottom-center' });
      }, (err) => {
        console.log(err);
      })
    } else {
      toast.error('Ekstensi file harus pdf', { position: 'bottom-center' })
    }
  }

  const deleteMateri = (id) => {
    console.log(id);
    MateriService.deleteMateri({ id_materi: id }).then(res => {
      getAllMateri();
      toast.success('Data berhasil dihapus', { position: 'bottom-center' });
    }, (err) => {
      console.log(err);
    })
  }

  return (
    <>
      <Toaster />
      <PageTitle>Data Materi</PageTitle>

      <div className='mb-4'>
        <Button
          onClick={openModalCreate}
          size={"regular"}
          iconRight={PlusIcon}
        >
          <span>Tambah Data</span>
        </Button>
      </div>

      <div className='flex flex-wrap py-3 mb-8'>

        {/* Card */}

        {dataMateri.map((el, index) => (
          <div key={index} className='w-full md:w-1/4 md:mr-4 mb-4 text-left bg-custom-secondary shadow-md rounded-lg dark:bg-gray-800'>
            <div className='flex justify-end'>
              <Button onClick={() => openModalUpdate(el.id_materi)} size='small' icon={EditIcon} />
              <Button onClick={() => deleteMateri(el.id_materi)} size='small' icon={TrashIcon} />
            </div>

            <Link to={`/app/detailmateri/${el.id_materi}`}>
              <div className="px-6 pb-4">
                <h2 className='text-xl font-medium text-white dark:text-gray-300'>
                  {index + 1}
                </h2>
                <p className='text-gray-100 dark:text-gray-400 my-2'>
                  Judul Materi : {el.judul_materi}
                </p>
              </div>
            </Link>
            {/* <Link to={`/app/detailtugas/${el.id_materi}`}>
              <div className="px-6 pb-4">
                <h2 className='text-xl font-medium text-white dark:text-gray-300'>
                  {index+1}
                </h2>
                <p className='text-gray-100 dark:text-gray-400 my-2'>
                  Judul Materi : {el.judul_materi}
                </p>
              </div>
            </Link> */}
          </div>
        ))}
      </div>

      {/* Modal Create */}
      <Modal isOpen={modalCreate} onClose={closeModalCreate}>
        <form onSubmit={handleSubmit(createMateri)}>
          <ModalHeader>Form Tambah Materi Baru</ModalHeader>
          <ModalBody className="mt-4">
            <div>
              <Label>
                <span>Nama Materi</span>
                <Input {...register('judul_materi', { required: 'Judul Materi is required' })} type="text" placeholder="Masukan judul materi" className="mt-2" />
              </Label>
              {errors.judul_materi?.message && (
                <HelperText valid={false}>{errors.judul_materi?.message}</HelperText>
              )}

              <Label className='mt-3'>
                <span>File Materi</span>
                <Input {...register('filemateri', { required: 'File Materi soal is required' })} className='mt-1' type='file' />
              </Label>
              {errors.filemateri?.message && (
                <HelperText valid={false}>{errors.filemateri?.message}</HelperText>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hidden sm:block">
              <Button layout="outline" onClick={closeModalCreate}>
                Batal
              </Button>
            </div>
            <div className="hidden sm:block">
              <Button type="submit">Buat</Button>
            </div>
            <div className="block w-full sm:hidden">
              <Button block size="large" layout="outline" onClick={closeModalCreate}>
                Batal
              </Button>
            </div>
            <div className="block w-full sm:hidden">
              <Button type="submit" block size="large">
                Buat
              </Button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal Update */}
      <Modal isOpen={modalUpdate} onClose={closeModalUpdate}>
        <form onSubmit={handleSubmit2(updateMateri)}>
          <ModalHeader>Form Edit Materi</ModalHeader>
          <ModalBody className="mt-4">
            <div>
              <Input {...register2('id_materi')} type="hidden" />
              <Label>
                <span>Judul Materi</span>
                <Input {...register2('judul_materi', { required: 'Judul Materi is required' })} type="text" placeholder="Masukan Judul Materi" className="mt-2" />
              </Label>
              {errors2.judul_materi?.message && (
                <HelperText valid={false}>{errors2.judul_materi?.message}</HelperText>
              )}

              <Label className='mt-3'>
                <span>File Materi</span>
                <Input {...register2('filemateri', { required: 'File Materi soal is required' })} className='mt-1' type='file' />
              </Label>
              {errors2.filemateri?.message && (
                <HelperText valid={false}>{errors2.filemateri?.message}</HelperText>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="hidden sm:block">
              <Button layout="outline" onClick={closeModalUpdate}>
                Batal
              </Button>
            </div>
            <div className="hidden sm:block">
              <Button type="submit">Simpan</Button>
            </div>
            <div className="block w-full sm:hidden">
              <Button block size="large" layout="outline" onClick={closeModalUpdate}>
                Batal
              </Button>
            </div>
            <div className="block w-full sm:hidden">
              <Button type="submit" block size="large">
                Simpan
              </Button>
            </div>
          </ModalFooter>
        </form>
      </Modal>

    </>
  );
}

export default DataMateri;
