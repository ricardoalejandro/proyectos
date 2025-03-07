import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Tooltip,
  Divider,
  ListItemIcon,
  alpha
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Help as HelpIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

interface HeaderProps {
  open: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ open, onToggle }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
  };

  const isProfileMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        transition: theme => theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
          ml: { md: 240 },
          width: { md: `calc(100% - 240px)` },
        }),
        ...(!open && {
          ml: { md: 73 },
          width: { md: `calc(100% - 73px)` },
        }),
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="abrir menú"
          onClick={onToggle}
          sx={{
            marginRight: 1,
            display: { md: 'none' },
          }}
        >
          <MenuIcon />
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            noWrap
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              fontWeight: 700,
              color: 'primary.main' 
            }}
          >
            JIRA Management
          </Typography>
        </Box>
        
        <Box sx={{ 
          position: 'relative',
          borderRadius: 1,
          backgroundColor: (theme) => alpha(theme.palette.common.black, 0.04),
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.common.black, 0.08),
          },
          marginLeft: 2,
          marginRight: 'auto',
          width: 'auto',
          maxWidth: 500,
          display: { xs: 'none', sm: 'block' }
        }}>
          <Box sx={{ 
            padding: '0 16px', 
            height: '100%', 
            position: 'absolute', 
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Buscar tareas, proyectos..."
            sx={{
              color: 'inherit',
              width: '100%',
              '& .MuiInputBase-input': {
                padding: '8px 8px 8px 48px',
                transition: (theme) => theme.transitions.create('width'),
                width: '100%',
                minWidth: 200,
                [theme.breakpoints.up('md')]: {
                  width: '30ch',
                },
              },
            }}
          />
        </Box>
        
        <Box sx={{ display: { xs: 'flex' } }}>
          <Tooltip title="Notificaciones">
            <IconButton 
              size="large" 
              color="inherit" 
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Mi cuenta">
            <IconButton
              size="large"
              edge="end"
              aria-label="cuenta del usuario"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar 
                src="https://i.pravatar.cc/48?u=1" 
                alt="María López"
                sx={{ width: 32, height: 32 }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      
      {/* Menú de Perfil */}
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id="profile-menu"
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isProfileMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Configuración
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          Ayuda
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Cerrar sesión</Typography>
        </MenuItem>
      </Menu>
      
      {/* Menú de Notificaciones */}
      <Menu
        anchorEl={notificationAnchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id="notification-menu"
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={isNotificationMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>Notificaciones</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              Carlos Ruiz te asignó JIRA-123
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hace 5 minutos
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              Ana García comentó en JIRA-125
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hace 30 minutos
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Box>
            <Typography variant="body2" fontWeight={500}>
              Juan Pérez marcó JIRA-122 como completada
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hace 2 horas
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <MenuItem onClick={handleMenuClose} sx={{ justifyContent: 'center' }}>
            <Typography variant="body2" color="primary">
              Ver todas las notificaciones
            </Typography>
          </MenuItem>
        </Box>
      </Menu>
    </AppBar>
  );
};

export default Header;