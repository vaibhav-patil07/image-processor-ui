import UploadIcon from '../assets/cloud-upload.svg';
import { CloudUpload } from '@mui/icons-material';
import { Box, Paper, Snackbar } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { uploadImage } from '../api/uploadService';
import { useSelector } from 'react-redux';



export function Upload({setRefreshList}) {
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const userId = useSelector((state) => state.user.user_id);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
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
        <div className="upload-image-container">
            <Paper
            {...getRootProps()}
            className="image-container-dropzone">
            <input {...getInputProps()} />
            {image ? (
                <div className="upload-image-container">
                {/* <Avatar 
                    src={image} 
                    alt="Preview" 
                /> */}
                <div className="image-container">
                    <img src={image} className="image-container-icon-avatar" alt="Upload Icon"/>
                </div>
                <Typography>
                    {isDragActive ? "Drop the image here..." : "Drag & drop an image here, or click to select"}
                </Typography>
                </div>
            ) : (
                <div>
                <div className="image-container">
                    <img src={UploadIcon} className="image-container-icon-avatar" alt="Upload Icon"/>
                </div>
                <Typography>
                    {isDragActive ? "Drop the image here..." : "Drag & drop an image here, or click to select"}
                </Typography>
                </div>
            )}
            </Paper>
            <Button variant="contained" endIcon={<CloudUpload />} className="image-container-upload-button" disabled={!image} onClick={handleUpload} loading={isUploading}>
                Upload
            </Button>
            <Box sx={{ width: '500' }}>
                <Snackbar open={isSnackbarOpen} autoHideDuration={3000} onClose={() => setIsSnackbarOpen(false)} message={snackbarMessage} ></Snackbar>
            </Box>
      </div>
    )
}