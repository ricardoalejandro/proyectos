import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Button, 
  TextField,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Card,
  CardContent,
  InputAdornment,
  Grid,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ViewKanban as ViewKanbanIcon,
  ViewList as ViewListIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  ArrowUpward as ArrowUpwardIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Tipos para nuestras tareas
interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: 'highest' | 'high' | 'medium' | 'low' | 'lowest';
  assignee?: {
    id: string;
    name: string;
    avatar: string;
  };
  dueDate?: string;
  tags?: string[];
  estimate?: number; // en horas
}

// Datos simulados
const initialTasks: Task[] = [
  {
    id: 'JIRA-123',
    title: 'Implementar autenticación con OAuth',
    description: 'Integrar la autenticación OAuth con los proveedores principales',
    status: 'todo',
    priority: 'high',
    assignee: {
      id: 'user-1',
      name: 'María López',
      avatar: 'https://i.pravatar.cc/48?u=1'
    },
    dueDate: '2023-03-20',
    tags: ['backend', 'security']
  },
  {
    id: 'JIRA-124',
    title: 'Diseñar nueva página de inicio',
    description: 'Crear diseño moderno según las especificaciones aprobadas',
    status: 'todo',
    priority: 'medium',
    assignee: {
      id: 'user-2',
      name: 'Juan Pérez',
      avatar: 'https://i.pravatar.cc/48?u=2'
    },
    dueDate: '2023-03-18',
    tags: ['design', 'frontend']
  },
  {
    id: 'JIRA-125',
    title: 'Optimizar consultas SQL en módulo de reportes',
    description: 'Mejorar el rendimiento de las consultas principales',
    status: 'in-progress',
    priority: 'highest',
    assignee: {
      id: 'user-3',
      name: 'Ana García',
      avatar: 'https://i.pravatar.cc/48?u=3'
    },
    dueDate: '2023-03-15',
    tags: ['backend', 'performance'],
    estimate: 8
  },
  {
    id: 'JIRA-126',
    title: 'Corregir bug en el filtro de búsqueda',
    status: 'in-progress',
    priority: 'high',
    assignee: {
      id: 'user-4',
      name: 'Carlos Ruiz',
      avatar: 'https://i.pravatar.cc/48?u=4'
    },
    dueDate: '2023-03-12',
    tags: ['bug', 'frontend'],
    estimate: 3
  },
  {
    id: 'JIRA-127',
    title: 'Añadir tests unitarios para el API',
    description: 'Crear tests para los endpoints principales',
    status: 'in-review',
    priority: 'medium',
    assignee: {
      id: 'user-1',
      name: 'María López',
      avatar: 'https://i.pravatar.cc/48?u=1'
    },
    dueDate: '2023-03-14',
    tags: ['testing', 'backend'],
    estimate: 5
  },
  {
    id: 'JIRA-128',
    title: 'Actualizar documentación del API',
    description: 'Actualizar la documentación con los nuevos endpoints',
    status: 'in-review',
    priority: 'low',
    assignee: {
      id: 'user-2',
      name: 'Juan Pérez',
      avatar: 'https://i.pravatar.cc/48?u=2'
    },
    dueDate: '2023-03-22',
    tags: ['documentation'],
    estimate: 2
  },
  {
    id: 'JIRA-129',
    title: 'Implementar nueva funcionalidad de exportación a PDF',
    status: 'done',
    priority: 'high',
    assignee: {
      id: 'user-3',
      name: 'Ana García',
      avatar: 'https://i.pravatar.cc/48?u=3'
    },
    dueDate: '2023-03-10',
    tags: ['feature', 'frontend'],
    estimate: 6
  },
  {
    id: 'JIRA-130',
    title: 'Migrar base de datos a la nueva versión',
    description: 'Actualizar esquemas y datos a la versión más reciente',
    status: 'done',
    priority: 'highest',
    assignee: {
      id: 'user-1',
      name: 'María López',
      avatar: 'https://i.pravatar.cc/48?u=1'
    },
    dueDate: '2023-03-08',
    tags: ['database', 'migration'],
    estimate: 12
  }
];

// Configuración de columnas para el tablero Kanban
const columns = [
  { id: 'todo', title: 'Por hacer', color: '#DFE1E6' },
  { id: 'in-progress', title: 'En progreso', color: '#4C9AFF' },
  { id: 'in-review', title: 'En revisión', color: '#998DD9' },
  { id: 'done', title: 'Completado', color: '#36B37E' }
];

const BoardView: React.FC = () => {
  // Estado para las tareas
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  // Estado para el filtro de prioridad
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  // Estado para el menú de opciones de una tarea
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Manejar apertura del menú de tareas
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  // Manejar cierre del menú de tareas
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

  // Manejar cambio en el filtro de prioridad
  const handlePriorityFilterChange = (event: SelectChangeEvent) => {
    setPriorityFilter(event.target.value);
  };

  // Función para filtrar las tareas según los criterios actuales
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (task.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesPriority;
  });

  // Agrupar tareas por estado
  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter(task => task.status === status);
  };

  // Manejar el arrastre de tareas entre columnas
  const handleDragEnd = (result: any) => {
    if (!result.destination) return; // Si se suelta fuera de una columna

    const { source, destination, draggableId } = result;
    
    // Si se suelta en la misma columna en la misma posición, no hacer nada
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    
    // Actualizar el estado de la tarea según la columna de destino
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === draggableId
          ? { ...task, status: destination.droppableId }
          : task
      )
    );
  };

  // Obtener el color de la prioridad
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'highest': return '#E83F5B';
      case 'high': return '#FF8B00';
      case 'medium': return '#FFAB00';
      case 'low': return '#65BA43';
      case 'lowest': return '#4CBB17';
      default: return '#FFAB00';
    }
  };

  // Obtener el icono de la prioridad
  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'highest': return <ArrowUpwardIcon sx={{ color: getPriorityColor(priority), transform: 'rotate(45deg)' }} />;
      case 'high': return <ArrowUpwardIcon sx={{ color: getPriorityColor(priority) }} />;
      case 'medium': return <FlagIcon sx={{ color: getPriorityColor(priority) }} />;
      case 'low': return <ArrowUpwardIcon sx={{ color: getPriorityColor(priority), transform: 'rotate(180deg)' }} />;
      case 'lowest': return <ArrowUpwardIcon sx={{ color: getPriorityColor(priority), transform: 'rotate(225deg)' }} />;
      default: return <FlagIcon sx={{ color: getPriorityColor(priority) }} />;
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Encabezado y herramientas */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ mb: { xs: 2, md: 0 } }}>
          <Typography variant="h4" fontWeight={600}>
            Tablero Kanban
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visualiza y gestiona tus tareas en formato de tablero
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ backgroundColor: '#0052CC', '&:hover': { backgroundColor: '#0747A6' } }}
          >
            Nueva tarea
          </Button>
        </Box>
      </Box>
      
      {/* Barra de filtros */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            placeholder="Buscar tareas..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton 
                    size="small" 
                    onClick={() => setSearchQuery('')}
                    edge="end"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="priority-filter-label">Prioridad</InputLabel>
            <Select
              labelId="priority-filter-label"
              value={priorityFilter}
              label="Prioridad"
              onChange={handlePriorityFilterChange}
            >
              <MenuItem value="all">Todas</MenuItem>
              <MenuItem value="highest">Muy alta</MenuItem>
              <MenuItem value="high">Alta</MenuItem>
              <MenuItem value="medium">Media</MenuItem>
              <MenuItem value="low">Baja</MenuItem>
              <MenuItem value="lowest">Muy baja</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              startIcon={<FilterListIcon />}
              size="small"
            >
              Más filtros
            </Button>
            <Tooltip title="Vista de tablero">
              <IconButton color="primary">
                <ViewKanbanIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vista de lista">
              <IconButton>
                <ViewListIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
      
      {/* Tablero Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box 
          sx={{ 
            display: 'flex', 
            overflowX: 'auto', 
            gap: 2,
            pb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: 4,
            },
          }}
        >
          {columns.map((column) => (
            <Box 
              key={column.id} 
              sx={{ 
                minWidth: 280, 
                width: 280, 
                display: 'flex', 
                flexDirection: 'column',
                flexShrink: 0,
              }}
            >
              {/* Encabezado de columna */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                  px: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      backgroundColor: column.color, 
                      mr: 1 
                    }} 
                  />
                  <Typography variant="subtitle2" fontWeight={600}>
                    {column.title}
                  </Typography>
                  <Chip 
                    label={getTasksByStatus(column.id).length} 
                    size="small"
                    sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                  />
                </Box>
                <IconButton size="small">
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              
              {/* Contenedor de tareas (área donde se pueden soltar) */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{
                      backgroundColor: snapshot.isDraggingOver ? 'rgba(222, 235, 255, 0.5)' : 'rgba(244, 245, 247, 0.5)',
                      borderRadius: 1,
                      p: 1,
                      flexGrow: 1,
                      minHeight: 500,
                    }}
                  >
                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            elevation={snapshot.isDragging ? 8 : 1}
                            sx={{
                              mb: 1,
                              backgroundColor: 'white',
                              borderLeft: `3px solid ${getPriorityColor(task.priority)}`,
                              '&:hover': {
                                boxShadow: 3
                              },
                            }}
                          >
                            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                              {/* Encabezado de la tarjeta */}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  {task.id}
                                </Typography>
                                <IconButton 
                                  size="small" 
                                  sx={{ ml: 'auto', mt: -1, mr: -1 }}
                                  onClick={(e) => handleMenuOpen(e, task.id)}
                                >
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>
                              </Box>
                              
                              {/* Título de la tarea */}
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 600, 
                                  mb: 1,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {task.title}
                              </Typography>
                              
                              {/* Descripción si existe */}
                              {task.description && (
                                <Typography 
                                  variant="caption" 
                                  color="text.secondary"
                                  sx={{ 
                                    mb: 1,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {task.description}
                                </Typography>
                              )}
                              
                              {/* Metadatos: Fecha y estimación */}
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                {task.dueDate && (
                                  <Tooltip title="Fecha límite">
                                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                      <ScheduleIcon fontSize="small" sx={{ fontSize: '0.875rem', mr: 0.5, color: 'text.secondary' }} />
                                      <Typography variant="caption" color="text.secondary">
                                        {task.dueDate}
                                      </Typography>
                                    </Box>
                                  </Tooltip>
                                )}
                                
                                {task.estimate && (
                                  <Tooltip title="Tiempo estimado">
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Typography variant="caption" color="text.secondary">
                                        {task.estimate}h
                                      </Typography>
                                    </Box>
                                  </Tooltip>
                                )}
                                
                                <Box sx={{ flexGrow: 1 }} />
                                
                                {/* Icono de prioridad */}
                                <Tooltip title={`Prioridad: ${task.priority}`}>
                                  {getPriorityIcon(task.priority)}
                                </Tooltip>
                              </Box>
                              
                              {/* Pie de la tarjeta: Etiquetas y asignado */}
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {/* Etiquetas */}
                                <Box sx={{ 
                                  display: 'flex', 
                                  gap: 0.5, 
                                  flexWrap: 'wrap',
                                  maxWidth: task.assignee ? '70%' : '100%'
                                }}>
                                  {task.tags && task.tags.map((tag) => (
                                    <Chip 
                                      key={tag}
                                      label={tag}
                                      size="small"
                                      sx={{ 
                                        height: 20, 
                                        fontSize: '0.625rem',
                                        backgroundColor: 'rgba(0, 82, 204, 0.1)',
                                        color: '#0052CC'
                                      }}
                                    />
                                  ))}
                                </Box>
                                
                                {/* Avatar del asignado */}
                                {task.assignee && (
                                  <Tooltip title={`Asignado a: ${task.assignee.name}`}>
                                    <Avatar 
                                      src={task.assignee.avatar} 
                                      alt={task.assignee.name} 
                                      sx={{ width: 24, height: 24, ml: 'auto' }}
                                    />
                                  </Tooltip>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Box>
          ))}
        </Box>
      </DragDropContext>
      
      {/* Menú de opciones para tareas */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar tarea
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ScheduleIcon fontSize="small" sx={{ mr: 1 }} />
          Registrar tiempo
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'success.main' }}>
          <CheckIcon fontSize="small" sx={{ mr: 1 }} />
          Marcar como completada
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          <ClearIcon fontSize="small" sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default BoardView;