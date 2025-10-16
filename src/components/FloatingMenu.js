import {  Fab } from '@mui/material';
import './FloatingMenu.css';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { CloseOutlined, GitHub, HomeOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { setTheme } from '../store/userSlice';
import { useDispatch } from 'react-redux';

export function FloatingMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleThemeChange = () => {
        const currentTheme = localStorage.getItem('theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        dispatch(setTheme(newTheme)); 
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }
    return (
        <div className="floating-menu-container">
            <div className="floating-menu-item">
                <Fab className="floating-menu-item-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <CloseOutlined /> : <MenuIcon />}
                </Fab>
            </div>
            <div className={`floating-menu-item-menu ${isMenuOpen ? 'open' : ''}`}>
                <Fab className="floating-menu-item-button" onClick={() => navigate('/')}><HomeOutlined /></Fab>
                <Fab className="floating-menu-item-button" onClick={() => window.open('https://github.com/vaibhav-patil07/image-processor-api', '_blank')}><GitHub /></Fab>
                <Fab className="floating-menu-item-button" onClick={handleThemeChange}>{document.documentElement.getAttribute('data-theme') === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}</Fab>
            </div>
        </div>
    )
}