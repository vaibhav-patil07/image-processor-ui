import './ImagePage.css';
import { useState, useEffect } from 'react';
import { getImage } from '../api/imageService';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CompareIcon from '@mui/icons-material/Compare';
import DownloadIcon from '@mui/icons-material/Download';
import { getImageUrl } from '../api/imageService';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';



export function ImagePage() {
    const {imageId, userId} = useParams();
    const [image, setImage] = useState({});
    const [isSlider, setIsSlider] = useState(true);
    useEffect(() => {
        getImage(userId, imageId).then((response) => {
            setImage(response.image);
        }).catch((error) => {
            console.log(error);
        });
    }, [imageId, userId]);

    const handlerSliderOrCompareClick = (isSlider) => {
        setIsSlider(isSlider);
    }

    const toMB = (size) => {
        const sizeInMB = size / 1024 / 1024;
        return sizeInMB.toFixed(2);
    }

    function toCamelCase(str) {
        return str
          .toLowerCase()
          .replace(/[-_ ]+([a-z])/g, (_, c) => c.toUpperCase());
      }

    const originalSize = toMB(image.size);
    const compressedSize = toMB(image?.compressed_size?.Int64 || originalSize);
    const compressionRatio = (originalSize - compressedSize) / originalSize * 100;
    const originalImageUrl = encodeURI(getImageUrl('uploads',userId,image.image_id,image.filename));
    const compressedImageUrl =encodeURI(getImageUrl('resized',userId,image.image_id,image.filename));

    const handleDownloadCompressed = () => {
        window.open(compressedImageUrl);
    }

    return (
        <div className="image-page-container">
            <div className="image-page-container-header">
                <div className="image-page-container-header-left">
                    <h2 className="title-font">Image Comparison</h2>
                    <h3 className="title-font-small-no-accent">{image.filename}</h3>
                </div>
            </div>
            <div className='image-compression-metadata-container'>
                <div className='image-compression-metadata-card'>
                <h2 className="title-font-small-no-accent">Original Size</h2>
                <h3 className="description-font">{originalSize} MB</h3>
                </div>
                <div className='image-compression-metadata-card'>
                <h2 className="title-font-small-no-accent">Compressed Size</h2>
                <h3 className="description-font">{compressedSize} MB</h3>
                </div>
                <div className='image-compression-metadata-card'>
                    <h2 className="title-font-small-no-accent">Compression Ratio</h2>
                    <h3 className="description-font">{compressionRatio.toFixed(2)}%</h3>
                </div>
            </div>
            <div className='image-compression-image-metadata-container'>
                <div className='image-compression-image-metadata-title'>
                    <h2 className='title-font-small-no-accent'>Image Details</h2>
                </div>
                <div className='image-compression-image-metadata-row'>
                    <div className='image-compression-image-metadata-column'>
                        <div className='image-compression-image-metadata-item'>
                            <h3 className='title-font-small-no-accent'>Dimensions</h3>
                            <h3 className='description-font'>{image.width + "X" + image.height}</h3>
                        </div>
                        <div className='image-compression-image-metadata-item'>
                            <h3 className='title-font-small-no-accent'>Uploaded At</h3>
                            <h3 className='description-font'>{new Date(image.created_at).toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className='image-compression-image-metadata-column'>    
                        <div className='image-compression-image-metadata-item'>
                            <h3 className='title-font-small-no-accent'>Format</h3>
                            <h3 className='description-font'>{image.format?.toUpperCase()}</h3>
                        </div>
                        <div className='image-compression-image-metadata-item'>
                            <h3 className='title-font-small-no-accent'>Compressed At</h3>
                            <h3 className='description-font'>{image.compressed_at?.Time? new Date(image.compressed_at?.Time).toLocaleString() : 'N/A'}</h3>
                        </div>
                    </div>
                    <div className='image-compression-image-metadata-column'>    
                        <div className='image-compression-image-metadata-item'>
                            <h3 className='title-font-small-no-accent'>Status</h3>
                            <h3 className='description-font'>{toCamelCase("_" +image.job_status)}</h3>
                        </div>
                        <div className='image-compression-image-metadata-item'>
                            <h3 className='title-font-small-no-accent'>Image ID</h3>
                            <h3 className='description-font'>{image.image_id}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="image-page-container-buttons-container">
                    <Button className={(isSlider ? 'image-page-container-buttons-active' : 'image-page-container-buttons')} startIcon={<TuneIcon />} onClick={() => handlerSliderOrCompareClick(true)}>Slider</Button>
                    <Button className={(!isSlider ? 'image-page-container-buttons-active' : 'image-page-container-buttons')} startIcon={<CompareIcon />} onClick={() => handlerSliderOrCompareClick(false)}>Side by Side</Button>
                    <Button className='image-page-container-buttons-active' startIcon={<DownloadIcon /> } onClick={() => handleDownloadCompressed()}>Download Compressed</Button>
            </div>
            <div className='image-comparison-container'>
                    {isSlider? <ReactCompareSlider 
                        itemOne={
                            <div className='image-comparison-item-one'>
                                <div className='image-comparison-item-label'>Original</div>
                                <ReactCompareSliderImage src={originalImageUrl} alt="Image one" />
                            </div>
                        } 
                        itemTwo={
                            <div className='image-comparison-item-two'>
                                <div className='image-comparison-item-label'>Compressed</div>
                                <ReactCompareSliderImage src={compressedImageUrl} alt="Image two" />
                            </div>
                        }
                    />:
                    <div className='image-comparison-side-by-side-container'>
                        <div className='image-comparison-side-by-side-item-one'>
                            <div className='image-comparison-side-by-side-item-label'>Original</div>
                            <ReactCompareSliderImage src={originalImageUrl} alt="Image one" />
                        </div>
                        <div className='image-comparison-side-by-side-item-two'>
                            <div className='image-comparison-side-by-side-item-label'>Compressed</div>
                            <ReactCompareSliderImage src={compressedImageUrl} alt="Image two" />
                        </div>
                    </div>}
            </div>
        </div>
    )
}