import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getImageUrl, getImages } from '../api/imageService';
import { IMAGES_SOCKET_BASE_URL } from '../config/api';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export function ImageList({refreshList, setRefreshList}) {
    const [images, setImages] = useState([]);
    const [imagesProgressMap, setImagesProgressMap ] = useState( new Map());
    const [count, setCount] = useState(0);
    const [jobCompletedImagesCount , setJobCompletedImagesCount] = useState(0);
    const navigate = useNavigate();

    const userId = useSelector((state) => state.user.user_id);

    const toMB = (size) => {
        const sizeInMB = size / 1024 / 1024;
        return sizeInMB.toFixed(2);
    }

    useEffect(() => {
        getImages(userId).then((response) => {
            setImages(response.images || []);
            setCount(response.count);
        }).catch((error) => {
        }).finally(() => {
        });
    }, [userId]);

    useEffect(() => {
        getImages(userId, {query:{jobs_status: 'completed' , limit: 0, offset: 0}}).then((response) => {
            setJobCompletedImagesCount(response.count);
        }).catch((error) => {
        });
       
    }, [count, userId]);

    useEffect(() => {
        if(refreshList) {
            getImages(userId).then((response) => {
                setImages(response.images || []);
                setCount(response.count);
                setRefreshList(false);
            }).catch((error) => {
            });
        }
    }, [refreshList,userId,setRefreshList]);

    const handleImageClick = (imageId, userId) => {
        navigate(`/users/${userId}/image/${imageId}`);
    }

    useEffect(() => {
        if(jobCompletedImagesCount < count) {
            const socketUrl = `${IMAGES_SOCKET_BASE_URL}/users/${userId}/images`;
            const socket = new WebSocket(socketUrl);
            socket.onmessage = (event) => {
               const data = JSON.parse(event.data);
               setImagesProgressMap((prev) => {
                const newMap = new Map(prev);
                newMap.set(data.image_id, {
                    progress: data.progress,
                    job_status: data.status
                });
                return newMap;
               });
            };
        }
    }, [jobCompletedImagesCount,count,userId,setImagesProgressMap]);

    const renderImageCards = () => {
        return images.map((image) => {
        const jobStatus = imagesProgressMap.get(image.image_id)?.job_status || image.job_status;
        const isJobCompleted = jobStatus === 'completed';
        return (<div key={image.image_id} className= {isJobCompleted ? 'image-card' : 'image-card cursor-not-allowed'} onClick={() => handleImageClick(image.image_id, userId)}>
                <div className='image-card-thumbnail-container'>
                    <img src={getImageUrl('thumbnail',userId,image.image_id,image.filename)} className="image-card-thumbnail" alt="Thumbnail"/>
                </div>
                <div>
                    <div className='image-card-content'>
                        <label className={isJobCompleted ? 'image-card-label' : 'image-card-label image-card-disabled-content'} >Name:</label>
                        <h3 className={isJobCompleted ? 'image-card-h3' : 'image-card-h3 image-card-disabled-content'} >{image.filename}</h3>
                    </div>
                    <div className='image-card-content'>
                        <label className={isJobCompleted ? 'image-card-label' : 'image-card-label image-card-disabled-content'} >Size:</label>
                        <h3 className={isJobCompleted ? 'image-card-h3' : 'image-card-h3 image-card-disabled-content'} >{toMB(image.size)} MB</h3>
                    </div>
                    <div className='image-card-content'>
                        <label className={isJobCompleted ? 'image-card-label' : 'image-card-label image-card-disabled-content'} >Uploaded At:</label>
                        <h3 className={isJobCompleted ? 'image-card-h3' : 'image-card-h3 image-card-disabled-content'} >{new Date(image.created_at).toLocaleString()}</h3>
                    </div>
                </div>
                <div className={isJobCompleted ? 'display-none' : 'image-card-progress-container'}>
                    <CircularProgress variant= { !isJobCompleted && imagesProgressMap.get(image.image_id) ? "determinate" : "indeterminate"} value={imagesProgressMap.get(image.image_id)?.progress || 0} />
                    <label className='image-card-progress-container-label' >Processing...</label>
                </div>
            </div>
        )})
    }

    return (
        <div className="image-list-container">
            {renderImageCards()}
        </div>
    )
}