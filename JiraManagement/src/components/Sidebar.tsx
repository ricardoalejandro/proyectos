import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Collapse,
  Box,
  Button,
  Tooltip,
  Typography,
  styled
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  ViewKanban as ViewKanbanIcon,
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  ExpandLess,
  ExpandMore,
  StarBorder,
  Folder as FolderIcon,
  Star as StarIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

// Lista de proyectos de ejemplo
const projects = [
  { id: 'web', name: 'Proyecto Web', starred: true },
  { id: 'api', name: 'API Backend', starred: false },
  { id: 'mobile', name: 'App Móvil', starred: true },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);

  // Comprobar si la ruta actual coincide con la proporcionada
  const isActive = (path: string) => location.pathname === path;

  // Manejar clic en un elemento de navegación
  const handleNavClick = (path: string) => {
    navigate(path);
  };
  
  // Alternar el menú desplegable de proyectos
  const handleProjectsToggle = () => {
    setProjectsOpen(!projectsOpen);
  };
  
  // Alternar el menú desplegable de informes
  const handleReportsToggle = () => {
    setReportsOpen(!reportsOpen);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 73,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 73,
          boxSizing: 'border-box',
          border: 'none',
          boxShadow: '1px 0 5px rgba(0,0,0,0.08)',
          backgroundColor: 'background.paper',
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
      open={open}
    >
      <DrawerHeader>
        {open && (
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: 'center',
            mx: 2,
          }}>
            <Typography 
              variant="h6" 
              fontWeight={700} 
              color="primary.main"
              noWrap
            >
              JIRA
            </Typography>
          </Box>
        )}
        <IconButton onClick={onToggle}>
          {open ? <ChevronLeftIcon /> : <DashboardIcon color="primary" />}
        </IconButton>
      </DrawerHeader>
      
      <Divider />
      
      {/* Botón de Crear Tarea */}
      <Box sx={{ p: open ? 2 : 1 }}>
        <Button
          variant="contained"
          startIcon={open ? <AddIcon /> : null}
          fullWidth
          sx={{ 
            borderRadius: 2,
            minWidth: open ? 'auto' : 40,
            px: open ? 2 : 0,
          }}
          onClick={() => handleNavClick('/create-issue')}
        >
          {open ? 'Crear Tarea' : <AddIcon />}
        </Button>
      </Box>
      
      {/* Navegación principal */}
      <List>
        <Tooltip title={open ? '' : 'Dashboard'} placement="right">
          <ListItem disablePadding>
            <ListItemButton
              selected={isActive('/')}
              onClick={() => handleNavClick('/')}
              sx={{ 
                minHeight: 48,
                px: 2.5,
                borderLeft: isActive('/') ? '3px solid' : '3px solid transparent',
                borderColor: 'primary.main',
                backgroundColor: isActive('/') ? 'rgba(0, 82, 204, 0.08)' : 'transparent',
              }}
            >
              <ListItemIcon sx={{ minWidth: open ? 56 : 0, color: isActive('/') ? 'primary.main' : 'inherit' }}>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </Tooltip>
        
        <Tooltip title={open ? '' : 'Mis Tareas'} placement="right">
          <ListItem disablePadding>
            <ListItemButton
              selected={isActive('/my-tasks')}
              onClick={() => handleNavClick('/my-tasks')}
              sx={{ 
                minHeight: 48,
                px: 2.5,
                borderLeft: isActive('/my-tasks') ? '3px solid' : '3px solid transparent',
                borderColor: 'primary.main',
                backgroundColor: isActive('/my-tasks') ? 'rgba(0, 82, 204, 0.08)' : 'transparent',
              }}
            >
              <ListItemIcon sx={{ minWidth: open ? 56 : 0, color: isActive('/my-tasks') ? 'primary.main' : 'inherit' }}>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText primary="Mis Tareas" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </Tooltip>
        
        <Tooltip title={open ? '' : 'Tablero Kanban'} placement="right">
          <ListItem disablePadding>
            <ListItemButton
              selected={isActive('/board')}
              onClick={() => handleNavClick('/board')}
              sx={{ 
                minHeight: 48,
                px: 2.5,
                borderLeft: isActive('/board') ? '3px solid' : '3px solid transparent',
                borderColor: 'primary.main',
                backgroundColor: isActive('/board') ? 'rgba(0, 82, 204, 0.08)' : 'transparent',
              }}
            >
              <ListItemIcon sx={{ minWidth: open ? 56 : 0, color: isActive('/board') ? 'primary.main' : 'inherit' }}>
                <ViewKanbanIcon />
              </ListItemIcon>
              <ListItemText primary="Tablero Kanban" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </Tooltip>
        
        <Tooltip title={open ? '' : 'Registro de Tiempo'} placement="right">
          <ListItem disablePadding>
            <ListItemButton
              selected={isActive('/time-tracking')}
              onClick={() => handleNavClick('/time-tracking')}
              sx={{ 
                minHeight: 48,
                px: 2.5,
                borderLeft: isActive('/time-tracking') ? '3px solid' : '3px solid transparent',
                borderColor: 'primary.main',
                backgroundColor: isActive('/time-tracking') ? 'rgba(0, 82, 204, 0.08)' : 'transparent',
              }}
            >
              <ListItemIcon sx={{ minWidth: open ? 56 : 0, color: isActive('/time-tracking') ? 'primary.main' : 'inherit' }}>
                <AccessTimeIcon />
              </ListItemIcon>
              <ListItemText primary="Registro de Tiempo" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      {/* Proyectos */}
      {open && (
        <>
          <List>
            <ListItemButton onClick={handleProjectsToggle}>
              <ListItemIcon sx={{ minWidth: 56 }}>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Proyectos" />
              {projectsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={projectsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {projects.map((project) => (
                  <ListItemButton 
                    key={project.id}
                    sx={{ pl: 4 }}
                    onClick={() => handleNavClick(`/projects/${project.id}`)}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {project.starred ? 
                        <StarIcon fontSize="small" color="warning" /> : 
                        <StarBorder fontSize="small" />
                      }
                    </ListItemIcon>
                    <ListItemText primary={project.name} />
                  </ListItemButton>
                ))}
                <ListItemButton 
                  sx={{ pl: 4 }}
                  onClick={() => handleNavClick('/projects')}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AddIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Ver todos" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          
          {/* Reportes */}
          <List>
            <ListItemButton onClick={handleReportsToggle}>
              <ListItemIcon sx={{ minWidth: 56 }}>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Reportes" />
              {reportsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Resumen de trabajo" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Tiempo dedicado" />
                </ListItemButton>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary="Rendimiento" />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
        </>
      )}
      
      {!open && (
        <List>
          <Tooltip title="Proyectos" placement="right">
            <ListItem disablePadding>
              <ListItemButton sx={{ minHeight: 48, px: 2.5 }}>
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <FolderIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
          <Tooltip title="Reportes" placement="right">
            <ListItem disablePadding>
              <ListItemButton sx={{ minHeight: 48, px: 2.5 }}>
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <BarChartIcon />
                </ListItemIcon>
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </List>
      )}
      
      <Box sx={{ flexGrow: 1 }} />
      
      {/* Configuración y ayuda */}
      <List>
        <Tooltip title={open ? '' : 'Configuración'} placement="right">
          <ListItem disablePadding>
            <ListItemButton sx={{ minHeight: 48, px: 2.5 }}>
              <ListItemIcon sx={{ minWidth: open ? 56 : 0 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configuración" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </Tooltip>
        <Tooltip title={open ? '' : 'Ayuda'} placement="right">
          <ListItem disablePadding>
            <ListItemButton sx={{ minHeight: 48, px: 2.5 }}>
              <ListItemIcon sx={{ minWidth: open ? 56 : 0 }}>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary="Ayuda" sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
};

export default Sidebar;