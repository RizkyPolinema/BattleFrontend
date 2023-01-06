import axios from "axios";
import authHeader from "../../../services/auth-header";
import URL from "../../../services/API_URL";

const API_URL = URL + "/jawaban";

const createJawaban = (data) => {
    return axios.post(API_URL + "/", data, { headers: authHeader() });
}

const getAllJawaban = () => {
    return axios.get(API_URL + '/', { headers: authHeader() });
}

const getRanking = () => {
    return axios.get(API_URL + '/ranking', { headers: authHeader() });
}

const getAllJawabanByUID = (data) => {
    return axios.get(API_URL + '/byidtugas', { headers: authHeader(), params: data });
}

const getJawabanById = (data) => {
    return axios.get(API_URL + '/byid', { headers: authHeader(), params: data });
}

const updatePenghargaan = (data) => {
    return axios.put(API_URL + "/update_achieve", data, { headers: authHeader() });
};

const jawabanService = {
    createJawaban,
    getAllJawaban,
    getJawabanById,
    getAllJawabanByUID,
    getRanking,
    updatePenghargaan
};

export default jawabanService;
