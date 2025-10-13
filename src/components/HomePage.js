import { useState } from 'react';
import { Upload } from './Upload';
import { ImageList } from './ImageList';


export function HomePage() {
  const [refreshList, setRefreshList] = useState(false);
    return (
        <div className="app-container">
        <div className="app-container-left">
          <Upload setRefreshList={setRefreshList} />
        </div>
        <div className="app-container-right">
          <ImageList refreshList={refreshList} setRefreshList={setRefreshList} />
        </div>
      </div>
    )
}