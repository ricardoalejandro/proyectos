import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Button,
  Tabs,
  Tab,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Flag as FlagIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as CircleIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Datos de ejemplo para tareas
const tasksMock = [
  {
    id: 'JIRA-123',
    title: 'Implementar integración con API',
    status: 'En progreso',
    priority: 'Alta',
    project: 'Proyecto Web',
    assignee: 'María López',
    avatarUrl: 'https://i.pravatar.cc/48?u=1',
    dueDate: '2023-07-20',
    created: '2023-07-01',
    reporter: 'Carlos Ruiz',
    description: 'Desarrollar la integración con la API de pagos',
    labels: ['backend', 'api', 'integración'],
    estimateRemaining: 5,
    logged: 2.5
  },
  {
    id: 'JIRA-125',
    title: 'Solucionar bug en login',
    status: 'En progreso',
    priority: 'Alta',
    project: 'Proyecto Web',
    assignee: 'María López',
    avatarUrl: 'https://i.pravatar.cc/48?u=1',
    dueDate: '2023-07-15',
    created: '2023-07-05',
    reporter: 'Juan Pérez',
    description: 'El formulario de login no valida correctamente las credenciales',
    labels: ['frontend', 'bug', 'seguridad'],
    estimateRemaining: 3,
    logged: 1.5
  },
  {
    id: 'JIRA-127',
    title: 'Implementar tests de integración',
    status: 'Por hacer',
    priority: 'Media',
    project: 'API Backend',
    assignee: 'María López',
    avatarUrl: 'https://i.pravatar.cc/48?u=1',
    dueDate: '2023-07-30',
    created: '2023-07-10',
    reporter: 'Ana García',
    description: 'Crear tests de integración para los endpoints principales',
    labels: ['testing', 'qa'],
    estimateRemaining: 8,
    logged: 0
  },
  {
    id: 'JIRA-130',
    title: 'Diseñar pantalla de perfil de usuario',
    status: 'Por hacer',
    priority: 'Baja',
    project: 'Proyecto Web',
    assignee: 'María López',
    avatarUrl: 'https://i.pravatar.cc/48?u=1',
    dueDate: '2023-08-05',
    created: '2023-07-12',
    reporter: 'Carlos Ruiz',
    description: 'Crear maquetas y diseño para la pantalla de perfil',
    labels: ['diseño', 'ui'],
    estimateRemaining: 6,
    logged: 0
  },
  {
    id: 'JIRA-122',
    title: 'Actualizar documentación de API',
    status: 'Completada',
    priority: 'Media',
    project: 'API Backend',
    assignee: 'María López',
    avatarUrl: 'https://i.pravatar.cc/48?u=1',
    dueDate: '2023-07-10',
    created: '2023-06-28',
    reporter: 'Juan Pérez',
    description: 'Actualizar la documentación con los nuevos endpoints',
    labels: ['documentación', 'api'],
    estimateRemaining: 0,
    logged: 4
  }
];

// Función para determinar el color del chip basado en el estado
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completada':
      return 'success';
    case 'En progreso':
      return 'primary';
    case 'En revisión':
      return 'info';
    case 'Por hacer':
      return 'default';
    default:
      return 'default';
  }
};

// Función para determinar el color del indicador de prioridad
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'Alta':
      return '#FF5630';
    case 'Media':
      return '#FFAB00';
    case 'Baja':
      return '#36B37E';
    default:
      return '#DFE1E6';
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MyTasks: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  
  // Manejar cambio de pestaña
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Manejar cambio de filtro
  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };
  
  // Manejar cambio de ordenamiento
  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };
  
  // Manejar búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  // Manejar menú de tarea
  const handleTaskMenuOpen = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    setAnchorEl(event.currentTarget);
    setCurrentTask(taskId);
  };
  
  // Cerrar menú
  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentTask(null);
  };
  
  // Navegar a detalles de tarea
  const handleViewTask = () => {
    if (currentTask) {
      navigate(`/issues/${currentTask}`);
    }
    handleMenuClose();
  };
  
  // Filtrar tareas
  const filteredTasks = tasksMock.filter(task => {
    // Filtro por estado según la pestaña
    let statusFilter = true;
    if (tabValue === 1) {
      statusFilter = task.status === 'En progreso';
    } else if (tabValue === 2) {
      statusFilter = task.status === 'Completada';
    }
    
    // Filtro por proyecto
    const projectFilter = filter === 'all' || task.project === filter;
    
    // Búsqueda por texto
    const searchFilter = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusFilter && projectFilter && searchFilter;
  });
  
  // Ordenar tareas
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        // Mapear prioridad a un valor numérico para ordenar
        const priorityValue = {
          'Alta': 3,
          'Media': 2,
          'Baja': 1
        };
        return (priorityValue as any)[b.priority] - (priorityValue as any)[a.priority];
      case 'dueDate':
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case 'created':
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      default:
        return 0;
    }
  });
  
  // Estadísticas
  const totalTasks = tasksMock.length;
  const completedTasks = tasksMock.filter(task => task.status === 'Completada').length;
  const inProgressTasks = tasksMock.filter(task => task.status === 'En progreso').length;
  const toDoTasks = tasksMock.filter(task => task.status === 'Por hacer').length;
  
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Mis Tareas
      </Typography>
      
      {/* Resumen de tareas */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    width: 48, 
                    height: 48, 
                    bgcolor: 'primary.main',
                    mr: 2
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    María López
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Desarrolladora Full-Stack
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={600}>
                      {totalTasks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={600} color="primary.main">
                      {inProgressTasks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      En Progreso
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={600} color="warning.main">
                      {toDoTasks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Por Hacer
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={600} color="success.main">
                      {completedTasks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completadas
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Progreso General
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  Completadas: {completedTasks}
                </Typography>
                <Typography variant="body2">
                  {completedTasks}/{totalTasks}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(completedTasks / totalTasks) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filtros y pestañas */}
      <Box sx={{ mb: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          aria-label="task tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<AssignmentIcon fontSize="small" />} 
            iconPosition="start" 
            label="Todas" 
          />
          <Tab 
            icon={<CircleIcon fontSize="small" sx={{ color: 'primary.main' }} />} 
            iconPosition="start" 
            label="En Progreso" 
          />
          <Tab 
            icon={<CheckCircleIcon fontSize="small" sx={{ color: 'success.main' }} />} 
            iconPosition="start" 
            label="Completadas" 
          />
        </Tabs>
      </Box>
      
      {/* Controles de búsqueda y filtro */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="project-filter-label">Proyecto</InputLabel>
            <Select
              labelId="project-filter-label"
              value={filter}
              onChange={handleFilterChange}
              label="Proyecto"
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="Proyecto Web">Proyecto Web</MenuItem>
              <MenuItem value="API Backend">API Backend</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="sort-label">Ordenar por</InputLabel>
            <Select
              labelId="sort-label"
              value={sortBy}
              onChange={handleSortChange}
              label="Ordenar por"
            >
              <MenuItem value="priority">Prioridad</MenuItem>
              <MenuItem value="dueDate">Fecha límite</MenuItem>
              <MenuItem value="created">Fecha de creación</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box>
          <Button 
            variant="outlined" 
            startIcon={<FilterIcon />}
          >
            Más filtros
          </Button>
        </Box>
      </Box>
      
      {/* Contenido según la pestaña */}
      <TabPanel value={tabValue} index={0}>
        <TasksTable tasks={sortedTasks} onMenuOpen={handleTaskMenuOpen} />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TasksTable tasks={sortedTasks} onMenuOpen={handleTaskMenuOpen} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <TasksTable tasks={sortedTasks} onMenuOpen={handleTaskMenuOpen} />
      </TabPanel>
      
      {/* Menú de opciones para las tareas */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewTask}>Ver detalles</MenuItem>
        <MenuItem onClick={handleMenuClose}>Actualizar estado</MenuItem>
        <MenuItem onClick={handleMenuClose}>Registrar tiempo</MenuItem>
        <MenuItem onClick={handleMenuClose}>Asignar a otro usuario</MenuItem>
      </Menu>
    </Box>
  );
};

// Componente para la tabla de tareas
interface TasksTableProps {
  tasks: typeof tasksMock;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, taskId: string) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks, onMenuOpen }) => {
  const navigate = useNavigate();
  
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Tarea</TableCell>
            <TableCell>Proyecto</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Fecha límite</TableCell>
            <TableCell>Tiempo</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task) => (
            <TableRow 
              key={task.id}
              hover
              onClick={() => navigate(`/issues/${task.id}`)}
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 4, 
                      height: 36, 
                      backgroundColor: getPriorityColor(task.priority),
                      borderRadius: 1,
                      mr: 2
                    }} 
                  />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mr: 1 }}
                      >
                        {task.id}
                      </Typography>
                      <FlagIcon 
                        fontSize="small" 
                        sx={{ 
                          color: getPriorityColor(task.priority),
                          mr: 1,
                          fontSize: '0.8rem'
                        }} 
                      />
                    </Box>
                    <Typography variant="body1" fontWeight={500}>
                      {task.title}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{task.project}</TableCell>
              <TableCell>
                <Chip 
                  label={task.status} 
                  size="small"
                  color={getStatusColor(task.status) as any}
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              </TableCell>
              <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {task.logged}h / {task.logged + task.estimateRemaining}h
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(task.logged / (task.logged + task.estimateRemaining)) * 100} 
                    sx={{ width: 50, height: 6, borderRadius: 3 }}
                  />
                </Box>
              </TableCell>
              <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <IconButton 
                  size="small"
                  onClick={(e) => onMenuOpen(e, task.id)}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No se encontraron tareas.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyTasks;