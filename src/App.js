import './App.css';
import { useSelector } from 'react-redux';
import { setUserId } from './store/userSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Upload } from './components/Upload';
import { AppBar } from './components/AppBar';
import { ImageList } from './components/ImageList';
import { useState } from 'react';

function App() {
  let storedUser = JSON.parse(localStorage.getItem('user'));
  const user = useSelector((state) => state.user);
  const [refreshList, setRefreshList] = useState(false);
  
  const dispatch = useDispatch();
  if(!storedUser){
    storedUser = {user_id :crypto.randomUUID()};
    localStorage.setItem('user', JSON.stringify(storedUser));
  }
  useEffect(() => {
    if(user.user_id === ''){
      dispatch(setUserId(storedUser.user_id));
    }
  }, [user.user_id, dispatch, storedUser]);

  return (
    <div className="App">
      <AppBar />
      <div className="app-container">
        <div className="app-container-left">
          <Upload setRefreshList={setRefreshList} />
        </div>
        <div className="app-container-right">
          <ImageList refreshList={refreshList} setRefreshList={setRefreshList} />
        </div>
      </div>
    </div>
  );
}

export default App;
