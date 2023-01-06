import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthService from "../../../services/auth.service";
import MateriService from "../service/materi.service";

import PageTitle from "../../../components/Typography/PageTitle";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, HelperText } from "@windmill/react-ui";
import { EditIcon, TrashIcon, PlusIcon } from "../../../icons";
import toast, { Toaster } from "react-hot-toast";
import { Document, Page, pdfjs } from "react-pdf";
import authHeader from "../../../services/auth-header";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function DataMateri() {

    const { uid } = useParams();
    const [dataMateri, setDataMateri] = useState([]);

    // data temporary untuk ditampilkan
    const [judulMateri, setJudulMateri] = useState('');
    const [isiMateri, setIsiMateri] = useState('');

    const history = useHistory();
    const { register, formState: { errors }, handleSubmit, resetField } = useForm();
    const { register: register2, formState: { errors: errors2 }, handleSubmit: handleSubmit2, setValue: setValue2 } = useForm();

    // pdf
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1); //setting 1 to show fisrt page

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    function changePage(offset) {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    }

    function previousPage() {
        changePage(-1);
    }

    function nextPage() {
        console.log('next');
        changePage(1);
    }

    useEffect(() => {
        MateriService.getMateriById(uid).then(
            (response) => {
                console.log(response.data.data);
                setDataMateri(response.data.data);
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

    const getMateriById = () => {
        MateriService.getMateriById(uid).then(
            (response) => {
                setDataMateri(response.data.data);
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

    const updateMateri = (data) => {
        MateriService.updateMateri(data).then(res => {
            getMateriById();
            toast.success('Data berhasil diedit', { position: 'bottom-center' });
        }, (err) => {
            console.log(err);
        })
    }

    return (
        <>
            <Toaster />
            <PageTitle>{dataMateri ? dataMateri[0]?.judul_materi : ''}</PageTitle>

            <div className='mb-4 flex flex-col items-center'>
                <div className="flex justify-evenly items-center">
                    <Button 
                    className="mr-4" 
                    disabled={pageNumber <= 1} 
                    onClick={previousPage}>
                        Previous
                    </Button>
                    <Document
                        // file={isiMateri[0]}
                        file={dataMateri && dataMateri[0]?.isi_materi}
                        // file={{
                        //     url: dataMateri && dataMateri[0]?.isi_materi,
                        //     httpHeaders: authHeader(),
                        // }}
                        options={{ workerSrc: "/pdf.worker.js" }}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <Page pageNumber={pageNumber} />
                    </Document>
                    <Button
                        className="ml-4"
                        disabled={pageNumber >= numPages}
                        onClick={nextPage}
                    >
                        Next
                    </Button>
                </div>

                <div className='w-full flex flex-col justify-center items-center my-4'>
                    <p className='text-lg mb-4 text-white'>
                        Page {pageNumber || (numPages ? 1 : "--")} of {numPages || "--"}
                    </p>
                    {/* <div className='flex justify-between items-center'>
                        <Button className="mr-4" disabled={pageNumber <= 1} onClick={previousPage}>
                            Previous
                        </Button>
                        <Button
                            disabled={pageNumber >= numPages}
                            onClick={nextPage}
                        >
                            Next
                        </Button>
                    </div> */}
                </div>
            </div>
        </>
    );
}

export default DataMateri;
