import { useState } from 'react';
import { Upload } from './Upload';
import { ImageList } from './ImageList';
import './HomePage.css';


export function HomePage() {
  const [refreshList, setRefreshList] = useState(false);
    return (
      <div className="home-page-container">
        <div className="home-page-container-header">
          <h2 className="title-font">Image Size Compressor</h2>
          <h3 className="title-font-small-no-accent">Upload images to compress them and compare the results</h3>
        </div>
        <Upload setRefreshList={setRefreshList} />
        <ImageList refreshList={refreshList} setRefreshList={setRefreshList} />
      </div>
    )
}