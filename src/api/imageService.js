import { IMAGES_BASE_URL } from '../config/api';
export const getImageUrl = (folder,userId,imageId,filename)=>{
   return `${IMAGES_BASE_URL}/${folder}/${userId}/${imageId}/${filename}`;
}