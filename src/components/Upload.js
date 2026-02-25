import Dropzone, { useDropzone } from "react-dropzone";
import { useState } from "react";
import { uploadImage } from "../api/imageService";
import { useSelector } from "react-redux";
import "./Upload.css";
import { Button, LinearProgress } from "@mui/material";
import UploadIcon from "../assets/upload.png";
import { CloudUpload } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";

export function Upload({ setRefreshList }) {
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const userId = useSelector((state) => state.user.user_id);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    onDrop: (acceptedFiles) => {
      setImage(URL.createObjectURL(acceptedFiles[0]));
      setFile(acceptedFiles[0]);
    },
  });

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("image", file);
    uploadImage(userId, formData, {
      onUploadProgress: (e) => {
        if (e.total) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      },
    })
      .then((response) => {
        setImage(null);
        setFile(null);
        setRefreshList(true);
        setSnackbarMessage("Image uploaded successfully");
        setIsSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackbarMessage("Image upload failed");
        setIsSnackbarOpen(true);
      })
      .finally(() => {
        setIsUploading(false);
        setUploadProgress(0);
      });
  };

  return (
    <div className="home-page-upload-container">
      <Dropzone>
        {() => (
          <div {...getRootProps()} className="home-page-upload-container-input">
            <input
              {...getInputProps()}
              onChange={(e) => {
                setFile(e.target.files[0]);
                setImage(URL.createObjectURL(e.target.files[0]));
              }}
            />
            <div
              className={
                image
                  ? "display-none"
                  : "home-page-upload-container-input-items"
              }
            >
              <div className="home-page-upload-container-input-icon">
                <img src={UploadIcon} alt="Upload Icon" />
              </div>
              <div className="title-font-small-no-accent">
                <h3>Drag and drop images here</h3>
              </div>
              <div className="description-font">
                <h3>or</h3>
              </div>
              <div>
                <Button
                  variant="contained"
                  className="home-page-upload-container-input-button"
                >
                  Browse Images
                </Button>
              </div>
              <div className="description-font">
                <h3>Supports: PNG, JPG, JPEG</h3>
              </div>
            </div>
            <div
              className={
                image
                  ? "home-page-upload-container-input-image-container"
                  : "display-none"
              }
            >
              <img
                src={image}
                className="home-page-upload-container-input-image"
                alt="Uploaded"
              />
            </div>
          </div>
        )}
      </Dropzone>
      <div className="home-page-upload-container-upload-wrapper">
        <Button
          variant="contained"
          className="home-page-upload-container-upload-button"
          onClick={handleUpload}
          endIcon={<CloudUpload />}
          disabled={!image || isUploading}
          style={{ cursor: isUploading || !image ? "not-allowed" : "pointer" }}
        >
          {isUploading ? `Uploading ${uploadProgress}%` : "Upload"}
        </Button>
        {isUploading && (
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            className="home-page-upload-container-upload-progress"
            sx={{
              marginTop: 1,
              borderRadius: 1,
              backgroundColor: "var(--bg-secondary)",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "var(--accent-color)",
              },
            }}
          />
        )}
      </div>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
