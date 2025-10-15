import './App.css';
import { useSelector } from 'react-redux';
import { setUserId } from './store/userSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { HomePage } from './components/HomePage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ImagePage } from './components/ImagePage';

function App() {
  let storedUser = JSON.parse(localStorage.getItem('user'));
  const user = useSelector((state) => state.user);
  
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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/users/:userId/image/:imageId" element={<ImagePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
