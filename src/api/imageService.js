import { IMAGES_BASE_URL } from '../config/api';
import api from '../config/api';

export const getImages = async (userId, options={}) => {
    if(!userId) {
        return [];
    }
    const query = options.queryKey || {};
    let queryString = '';
    if(query) {
        Object.keys(query).forEach((key) => {
            queryString += `&${key}=${query[key]}`;
        });
    }
    const response = await api.get(`users/${userId}/images${queryString ? `?${queryString}` : ''}`);
    return response.data;
}

export const uploadImage = async (userId, formData, options = {}) => {
    if(!userId || !formData) {
        return;
    }
    const response = await api.post(`users/${userId}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: options.onUploadProgress
    });
    return response.data;
}

export const getImageUrl = (folder,userId,imageId,filename)=>{
   return `${IMAGES_BASE_URL}/${folder}/${userId}/${imageId}/${filename}`;
}

export const getImage = async (userId,imageId) => {
    if(!userId || !imageId) {
        return;
    }
    const response = await api.get(`users/${userId}/images/${imageId}`);
    return response.data;
}