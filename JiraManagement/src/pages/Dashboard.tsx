import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Avatar, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Chip,
  IconButton,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  MoreVert as MoreVertIcon,
  AccessTime as AccessTimeIcon,
  Today as TodayIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Datos de ejemplo para las tareas
const recentTasks = [
  {
    id: 'JIRA-123',
    title: 'Implementar autenticación OAuth',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-03-15',
    assignee: {
      name: 'María López',
      avatar: 'https://i.pravatar.cc/48?u=1'
    }
  },
  {
    id: 'JIRA-124',
    title: 'Crear interfaz de usuario para tablero Kanban',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-03-20',
    assignee: {
      name: 'Carlos Ruiz',
      avatar: 'https://i.pravatar.cc/48?u=4'
    }
  },
  {
    id: 'JIRA-125',
    title: 'Corregir bug en el filtro de búsqueda',
    status: 'in-review',
    priority: 'highest',
    dueDate: '2023-03-10',
    assignee: {
      name: 'Juan Pérez',
      avatar: 'https://i.pravatar.cc/48?u=2'
    }
  },
  {
    id: 'JIRA-126',
    title: 'Actualizar documentación de API',
    status: 'done',
    priority: 'low',
    dueDate: '2023-03-08',
    assignee: {
      name: 'Ana García',
      avatar: 'https://i.pravatar.cc/48?u=3'
    }
  }
];

// Datos de ejemplo para el gráfico de tareas por estado
const statusData = [
  { name: 'Por hacer', value: 8, color: '#DFE1E6' },
  { name: 'En progreso', value: 5, color: '#4C9AFF' },
  { name: 'En revisión', value: 3, color: '#998DD9' },
  { name: 'Completadas', value: 12, color: '#36B37E' }
];

// Datos de ejemplo para el gráfico de tiempo
const timeData = [
  { day: 'Lun', hours: 6.5 },
  { day: 'Mar', hours: 7.8 },
  { day: 'Mié', hours: 5.2 },
  { day: 'Jue', hours: 8.1 },
  { day: 'Vie', hours: 6.7 },
  { day: 'Sáb', hours: 2.3 },
  { day: 'Dom', hours: 0 }
];

// Datos de ejemplo para proyectos
const projects = [
  { 
    id: 'web',
    name: 'Proyecto Web', 
    progress: 75,
    tasksTotal: 24,
    tasksCompleted: 18
  },
  {
    id: 'api',
    name: 'API Backend',
    progress: 45,
    tasksTotal: 32,
    tasksCompleted: 14
  },
  {
    id: 'mobile',
    name: 'App Móvil',
    progress: 30,
    tasksTotal: 20,
    tasksCompleted: 6
  }
];

// Componente para mostrar una tarea
const TaskItem = ({ task }: { task: typeof recentTasks[0] }) => {
  // Función para determinar el color según la prioridad
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'highest': return '#E83F5B';
      case 'high': return '#FF8B00';
      case 'medium': return '#FFAB00';
      case 'low': return '#65BA43';
      default: return '#65BA43';
    }
  };
  
  // Función para obtener texto y color según el estado
  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'todo':
        return { label: 'Por hacer', color: '#DFE1E6', bgColor: '#F4F5F7' };
      case 'in-progress':
        return { label: 'En progreso', color: '#4C9AFF', bgColor: '#DEEBFF' };
      case 'in-review':
        return { label: 'En revisión', color: '#8777D9', bgColor: '#EAE6FF' };
      case 'done':
        return { label: 'Completado', color: '#36B37E', bgColor: '#E3FCEF' };
      default:
        return { label: status, color: '#DFE1E6', bgColor: '#F4F5F7' };
    }
  };
  
  const statusInfo = getStatusInfo(task.status);
  
  return (
    <ListItem 
      alignItems="flex-start" 
      sx={{ 
        px: 2, 
        py: 1.5, 
        borderRadius: 1,
        '&:hover': { 
          backgroundColor: 'rgba(0, 0, 0, 0.04)' 
        }
      }}
    >
      <ListItemAvatar>
        <Avatar src={task.assignee.avatar} alt={task.assignee.name} />
      </ListItemAvatar>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography 
              variant="subtitle2"
              sx={{ fontWeight: 500, flexGrow: 1 }}
            >
              {task.title}
            </Typography>
            <Typography 
              variant="caption"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              {task.id}
            </Typography>
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Chip
              label={statusInfo.label}
              size="small"
              sx={{
                fontSize: '0.75rem',
                height: 24,
                backgroundColor: statusInfo.bgColor,
                color: statusInfo.color,
                mr: 1,
              }}
            />
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                fontSize: '0.75rem',
                color: 'text.secondary',
                mr: 1
              }}
            >
              <TodayIcon fontSize="inherit" sx={{ mr: 0.5 }} />
              {task.dueDate}
            </Box>
            <FlagIcon sx={{ fontSize: '0.875rem', color: getPriorityColor(task.priority) }} />
          </Box>
        }
      />
    </ListItem>
  );
};

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ p: 1 }}>
      <Box sx={{ pb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bienvenido de nuevo, María. Aquí tienes un resumen de tu trabajo.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Resumen de tareas */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ height: '100%' }}>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600}>
                  Mis tareas recientes
                </Typography>
              }
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ pt: 0 }}>
              <List sx={{ width: '100%' }}>
                {recentTasks.map((task) => (
                  <React.Fragment key={task.id}>
                    <TaskItem task={task} />
                    <Divider component="li" sx={{ my: 1 }} />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Distribución de tareas por estado */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={0}>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600}>
                  Distribución de tareas
                </Typography>
              }
            />
            <Divider />
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ height: 240, width: '100%', my: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                {statusData.map((entry) => (
                  <Box 
                    key={entry.name}
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mx: 1
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        backgroundColor: entry.color,
                        mr: 0.5
                      }} 
                    />
                    <Typography variant="caption">
                      {entry.name}: {entry.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Gráfico de horas trabajadas */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={0}>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600}>
                  Horas registradas
                </Typography>
              }
              subheader="Últimos 7 días"
            />
            <Divider />
            <CardContent>
              <Box sx={{ height: 240, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="#0052CC" 
                      name="Horas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                <AccessTimeIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography>
                  Total: <strong>36.6 horas</strong>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Proyectos */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={0}>
            <CardHeader
              title={
                <Typography variant="h6" fontWeight={600}>
                  Proyectos activos
                </Typography>
              }
            />
            <Divider />
            <CardContent>
              {projects.map((project) => (
                <Box key={project.id} sx={{ mb: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="subtitle2">{project.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {project.tasksCompleted}/{project.tasksTotal} tareas
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={project.progress} 
                    sx={{ height: 6, borderRadius: 3 }} 
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Estadísticas rápidas */}
        <Grid item xs={12} sm={6} md={4}>
          <Grid container spacing={2}>
            {/* Tareas completadas */}
            <Grid item xs={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Box 
                  sx={{ 
                    backgroundColor: 'rgba(54, 179, 126, 0.1)', 
                    borderRadius: '50%', 
                    p: 1.5, 
                    mb: 1 
                  }}
                >
                  <CheckCircleIcon sx={{ color: '#36B37E', fontSize: 32 }} />
                </Box>
                <Typography variant="h4" fontWeight={600}>12</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Tareas completadas
                </Typography>
              </Paper>
            </Grid>
            
            {/* Tareas pendientes */}
            <Grid item xs={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Box 
                  sx={{ 
                    backgroundColor: 'rgba(0, 82, 204, 0.1)', 
                    borderRadius: '50%', 
                    p: 1.5, 
                    mb: 1 
                  }}
                >
                  <AssignmentIcon sx={{ color: '#0052CC', fontSize: 32 }} />
                </Box>
                <Typography variant="h4" fontWeight={600}>16</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Tareas pendientes
                </Typography>
              </Paper>
            </Grid>
            
            {/* Tareas cercanas a vencer */}
            <Grid item xs={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Box 
                  sx={{ 
                    backgroundColor: 'rgba(255, 171, 0, 0.1)', 
                    borderRadius: '50%', 
                    p: 1.5, 
                    mb: 1 
                  }}
                >
                  <WarningIcon sx={{ color: '#FFAB00', fontSize: 32 }} />
                </Box>
                <Typography variant="h4" fontWeight={600}>4</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Tareas a punto de vencer
                </Typography>
              </Paper>
            </Grid>
            
            {/* Tareas con prioridad alta */}
            <Grid item xs={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Box 
                  sx={{ 
                    backgroundColor: 'rgba(232, 63, 91, 0.1)', 
                    borderRadius: '50%', 
                    p: 1.5, 
                    mb: 1 
                  }}
                >
                  <ErrorIcon sx={{ color: '#E83F5B', fontSize: 32 }} />
                </Box>
                <Typography variant="h4" fontWeight={600}>3</Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  Tareas prioritarias
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;