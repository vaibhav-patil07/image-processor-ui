import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
export const IMAGES_BASE_URL = process.env.REACT_APP_IMAGES_BASE_URL;
export const IMAGES_SOCKET_BASE_URL = process.env.REACT_APP_IMAGES_SOCKET_BASE_URL;
const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

export default api;