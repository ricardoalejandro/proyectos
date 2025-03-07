import React from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, open, onToggle }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* Header / AppBar */}
      <Header open={open} onToggle={onToggle} />
      
      {/* Sidebar / Drawer */}
      <Sidebar open={open} onToggle={onToggle} />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${open ? 240 : 73}px)` },
          ml: { md: `${open ? 240 : 73}px` },
          transition: theme => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          backgroundColor: 'background.default',
          minHeight: '100vh',
          overflow: 'auto'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;