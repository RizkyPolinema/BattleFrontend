import axios from "axios";
import authHeader from "../../../services/auth-header";
import authHeader2 from "../../../services/auth-header2";
import URL from "../../../services/API_URL";

const API_URL = URL + "/materi";

const createMateri = (data) => {
    return axios.post(API_URL + "/", data, { headers: authHeader2() });
}

const getAllMateri = () => {
    return axios.get(API_URL + "/", { headers: authHeader() });
}

const getMateriById = (id) => {
    return axios.get(API_URL + `/${id}`, { headers: authHeader() });
}

const updateMateri = (data) => {
    return axios.put(API_URL + '/', data, { headers: authHeader2() });
}

const deleteMateri = (data) => {
    return axios.delete(API_URL + '/', { headers: authHeader(), data });
}

const materiService = {
    getAllMateri,
    createMateri,
    getMateriById,
    updateMateri,
    deleteMateri
};

export default materiService;
