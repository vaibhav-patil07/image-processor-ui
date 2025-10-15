import Dropzone, { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { uploadImage } from '../api/imageService';
import { useSelector } from 'react-redux';
import './Upload.css';
import { Button } from '@mui/material';
import UploadIcon from '../assets/upload.png';
import {CloudUpload} from '@mui/icons-material';
import { Snackbar, Alert } from '@mui/material';



export function Upload({setRefreshList}) {
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const userId = useSelector((state) => state.user.user_id);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const { getRootProps, getInputProps } = useDropzone({
    accept: {
        'image/*': ['.png', '.jpg', '.jpeg'],
    },
    onDrop: (acceptedFiles) => {
        setImage(URL.createObjectURL(acceptedFiles[0]));
        setFile(acceptedFiles[0]);
    },
    });

    const handleUpload = () => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('image',file);
        uploadImage(userId,formData).then((response) => {
            setImage(null);
            setRefreshList(true);
            setSnackbarMessage('Image uploaded successfully');
            setIsSnackbarOpen(true);
        }).catch((error) => {
            setSnackbarMessage('Image upload failed');
            setIsSnackbarOpen(true);
        }).finally(() => {
            setIsUploading(false);
        });
    }

    return (
        <div className="home-page-upload-container">
            <Dropzone>
            {() => (
                <div {...getRootProps()} className="home-page-upload-container-input">
                    <input {...getInputProps()} onChange={(e) => {
                        setFile(e.target.files[0]);
                        setImage(URL.createObjectURL(e.target.files[0]));
                    }} />
                    <div className={ image ? 'display-none' : 'home-page-upload-container-input-items'}>
                        <div className='home-page-upload-container-input-icon'>
                            <img src={UploadIcon} alt="Upload Icon" />
                        </div>
                        <div className='title-font-small-no-accent'>
                            <h3>Drag and drop images here</h3>
                        </div>
                        <div className='description-font'>
                            <h3>or</h3>
                        </div>
                        <div>
                            <Button variant="contained" className="home-page-upload-container-input-button">Browse Images</Button>
                        </div>
                        <div className='description-font'>
                            <h3>Supports: PNG, JPG, JPEG</h3>
                        </div>
                    </div>
                    <div className={ image ? 'home-page-upload-container-input-image-container' : 'display-none'}>
                        <img src={image} className='home-page-upload-container-input-image' alt="Uploaded" />
                    </div>
                </div>
            )}
            </Dropzone>
            <Button variant="contained" className="home-page-upload-container-upload-button" onClick={handleUpload} endIcon={<CloudUpload />}  disabled={!image || isUploading} loading={isUploading}>Upload</Button>
            <Snackbar open={isSnackbarOpen} autoHideDuration={3000} onClose={() => setIsSnackbarOpen(false)}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}