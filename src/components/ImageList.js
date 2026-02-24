import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getImages, getImageUrl, getImage } from "../api/imageService";
import { IMAGES_SOCKET_BASE_URL } from "../config/api";
import { useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import "./ImageList.css";

export function ImageList({ refreshList, setRefreshList }) {
  const [images, setImages] = useState([]);
  const [imagesProgressMap, setImagesProgressMap] = useState(new Map());
  const [count, setCount] = useState(0);
  const [jobCompletedImagesCount, setJobCompletedImagesCount] = useState(0);
  const navigate = useNavigate();

  const userId = useSelector((state) => state.user.user_id);

  const toMB = (size) => {
    const sizeInMB = size / 1024 / 1024;
    return sizeInMB.toFixed(2);
  };

  useEffect(() => {
    getImages(userId)
      .then((response) => {
        setImages(response.images || []);
        setCount(response.count);
      })
      .catch((error) => {})
      .finally(() => {});
  }, [userId]);

  useEffect(() => {
    getImages(userId, {
      query: { jobs_status: "completed", limit: 0, offset: 0 },
    })
      .then((response) => {
        setJobCompletedImagesCount(response.count);
      })
      .catch((error) => {});
  }, [count, userId]);

  useEffect(() => {
    if (refreshList) {
      getImages(userId)
        .then((response) => {
          setImages(response.images || []);
          setCount(response.count);
          setRefreshList(false);
        })
        .catch((error) => {});
    }
  }, [refreshList, userId, setRefreshList]);

  const handleImageClick = (imageId, userId) => {
    navigate(`/users/${userId}/image/${imageId}`);
  };

  useEffect(() => {
    if (jobCompletedImagesCount < count) {
      const socketUrl = `${IMAGES_SOCKET_BASE_URL}/users/${userId}/images`;
      const socket = new WebSocket(socketUrl);
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setImagesProgressMap((prev) => {
          const newMap = new Map(prev);
          if (data.status !== "completed") {
            newMap.set(data.image_id, {
              progress: data.progress,
              job_status: data.status,
            });
          } else {
            getImage(userId, data.image_id)
              .then((response) => {
                setImages((prev) => {
                  const newImages = prev.map((image) => {
                    if (image.image_id === data.image_id) {
                      return response.image;
                    }
                    return image;
                  });
                  return newImages;
                });
              })
              .catch((error) => {
                console.log(error);
              });
            newMap.set(data.image_id, {
              progress: 100,
              job_status: data.status,
            });
          }
          return newMap;
        });
      };
    }
  }, [jobCompletedImagesCount, count, userId, setImagesProgressMap]);

  const renderImageCards = () => {
    return images.map((image) => {
      const jobStatus =
        imagesProgressMap.get(image.image_id)?.job_status || image.job_status;
      const isJobCompleted = jobStatus === "completed";
      let compressionRatio = 0;
      let compressedSize = 0;
      if (isJobCompleted) {
        const originalSize = toMB(image.size);
        compressedSize = toMB(image?.compressed_size?.Int64 || originalSize);
        compressionRatio =
          ((originalSize - compressedSize) / originalSize) * 100;
      }
      return (
        <div
          key={image.image_id}
          className={
            isJobCompleted ? "image-card" : "image-card image-card-disabled"
          }
          style={{
            transform: !isJobCompleted ? "none" : undefined,
            boxShadow: !isJobCompleted ? "none" : undefined,
          }}
          onClick={
            isJobCompleted
              ? () => handleImageClick(image.image_id, userId)
              : undefined
          }
        >
          <img
            className="image-card-thumbnail-image"
            src={getImageUrl(
              "thumbnail",
              userId,
              image.image_id,
              image.filename,
            )}
            alt={image.filename}
          />
          <div className="image-card-thumbnail-image-content">
            <h3 className="title-font-small-no-accent text-overflow-ellipsis">
              {image.filename}
            </h3>
            <h3 className="description-font text-overflow-ellipsis">
              {toMB(image.size)} MB
            </h3>
            <button
              className="image-card-thumbnail-image-button"
              onClick={() => handleImageClick(image.image_id, userId)}
              disabled={!isJobCompleted}
            >
              View
            </button>
            <div className="image-card-thumbnail-image-compression-ratio">
              <h3
                className={
                  compressionRatio && compressedSize
                    ? "description-font text-overflow-ellipsis"
                    : "display-none"
                }
              >
                {" "}
                Reduced to {compressedSize} MB{" "}
                <span className="green-font">
                  ({compressionRatio.toFixed(2)}% smaller)
                </span>
              </h3>
              <h3
                className={
                  !isJobCompleted
                    ? "description-font text-overflow-ellipsis"
                    : "display-none"
                }
              >
                {" "}
                Processing...
              </h3>
              <LinearProgress
                className={
                  !isJobCompleted
                    ? "image-card-thumbnail-image-compression-ratio-progress"
                    : "display-none"
                }
                variant={
                  imagesProgressMap.get(image.image_id)
                    ? "determinate"
                    : "indeterminate"
                }
                value={imagesProgressMap.get(image.image_id)?.progress || 0}
              />
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="image-list-container">
      <div
        className={
          images.length === 0 ? "how-it-works-container" : "display-none"
        }
      >
        <h3 className="title-font-small">How it works</h3>
        <ul>
          <li className="title-font-small-no-accent">Upload your image</li>
          <li className="title-font-small-no-accent">
            Wait for the image to be processed
          </li>
          <li className="title-font-small-no-accent">
            Download the compressed image
          </li>
        </ul>
      </div>
      {renderImageCards()}
    </div>
  );
}
