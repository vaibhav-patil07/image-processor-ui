import { AppBar as MuiAppBar, Button, Toolbar, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import GithubIcon from '../assets/github.svg';

export function AppBar() {
    return (
        <MuiAppBar position="static" className="app-bar">
            <Toolbar
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            >
            <div className="app-bar-items-container ">
                <div className="app-bar-items-container-left">
                <Typography variant="h5">Image Size Compressor</Typography>
                </div>
                <div className="app-bar-items-container-right">
                <Button color="inherit" href="https://github.com/vaibhav-patil07/image-processor-api" target="_blank" rel="noopener noreferrer">
                    <Avatar src={GithubIcon} className="app-bar-items-container-right-button-icon"/>
                </Button>
                </div>
            </div>
            </Toolbar>
        </MuiAppBar>
    )
}