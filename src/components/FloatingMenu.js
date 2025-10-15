import {  Fab } from '@mui/material';
import './FloatingMenu.css';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { CloseOutlined, GitHub, HomeOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export function FloatingMenu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
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
            </div>
        </div>
    )
}