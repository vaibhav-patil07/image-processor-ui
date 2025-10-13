import { useState, useEffect } from 'react';
import { getImage } from '../api/imageService';
import { useParams } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
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

    return (
        <div className="image-page-container">
            <div className="image-page-container-header">
                <div className="image-page-container-header-left">
                    <Typography variant="h4" style={{fontWeight: '500'}}>Image Comparison</Typography>
                    <Typography variant="h6" style={{textAlign: 'left', width: '100%'}}>{image.filename}</Typography>
                </div>
                <div className="image-page-container-header-right">
                    <Button variant={isSlider ? "contained" : "outlined"} color="primary" startIcon={<TuneIcon />} onClick={() => handlerSliderOrCompareClick(true)}>Slider</Button>
                    <Button variant={!isSlider ? "contained" : "outlined"} color="primary" startIcon={<CompareIcon />} onClick={() => handlerSliderOrCompareClick(false)}>Side by Side</Button>
                    <Button variant="contained" color="primary" startIcon={<DownloadIcon />}>Download Compressed</Button>
                </div>
            </div>
            <div className='image-compression-metadata-container'>
                <div className='image-compression-metadata-card'>
                <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '600'}}>Original Size</Typography>
                <Typography variant="h6" style={{textAlign: 'left', width: '100%'}}>{originalSize} MB</Typography>
                </div>
                <div className='image-compression-metadata-card'>
                <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '600'}}>Compressed Size</Typography>
                <Typography variant="h6" style={{textAlign: 'left', width: '100%'}}>{compressedSize} MB</Typography>
                </div>
                <div className='image-compression-metadata-card'>
                    <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '600'}}>Compression Ratio</Typography>
                    <Typography variant="h6" style={{textAlign: 'left', width: '100%'}}>{compressionRatio.toFixed(2)}%</Typography>
                </div>
            </div>
            <div className='image-compression-image-metadata-container'>
                <div className='image-compression-image-metadata-title'>
                    <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '600'}}>Image Details</Typography>
                </div>
                <div className='image-compression-image-metadata-row'>
                    <div className='image-compression-image-metadata-column'>
                        <div className='image-compression-image-metadata-item'>
                            <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '200'}}>Dimensions</Typography>
                            <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '500'}}>{image.width + "X" + image.height}</Typography>
                        </div>
                        <div className='image-compression-image-metadata-item'>
                            <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '200'}}>Uploaded At</Typography>
                            <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '500'}}>{new Date(image.created_at).toLocaleString()}</Typography>
                        </div>
                    </div>
                    <div className='image-compression-image-metadata-column'>    
                        <div className='image-compression-image-metadata-item'>
                            <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '200'}}>Format</Typography>
                            <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '500'}}>{image.format?.toUpperCase()}</Typography>
                        </div>
                        <div className='image-compression-image-metadata-item'>
                            <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '200'}}>Compressed At</Typography>
                            <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '500'}}>{image.compressed_at?.Time? new Date(image.compressed_at?.Time).toLocaleString() : 'N/A'}</Typography>
                        </div>
                    </div>
                    <div className='image-compression-image-metadata-column'>    
                        <div className='image-compression-image-metadata-item'>
                            <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '200'}}>Status</Typography>
                            <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '500'}}>{toCamelCase("_" +image.job_status)}</Typography>
                        </div>
                        <div className='image-compression-image-metadata-item'>
                            <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '200'}}>Image ID</Typography>
                            <Typography variant="h6" style={{textAlign: 'left', width: '100%', fontWeight: '500'}}>{image.image_id}</Typography>
                        </div>
                    </div>
                </div>
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