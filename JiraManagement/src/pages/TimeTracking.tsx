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
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
  SelectChangeEvent,
  OutlinedInput,
  InputAdornment,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Datos de ejemplo para tareas
const tasksMock = [
  {
    id: 'JIRA-123',
    title: 'Implementar integración con API',
    project: 'Proyecto Web',
    assignee: 'María López',
    avatarUrl: 'https://i.pravatar.cc/48?u=1',
    status: 'En progreso'
  },
  {
    id: 'JIRA-124',
    title: 'Diseñar nueva interfaz de usuario',
    project: 'Proyecto Web',
    assignee: 'Juan Pérez',
    avatarUrl: 'https://i.pravatar.cc/48?u=2',
    status: 'Por hacer'
  },
  {
    id: 'JIRA-125',
    title: 'Solucionar bug en login',
    project: 'Proyecto Web',
    assignee: 'Ana García',
    avatarUrl: 'https://i.pravatar.cc/48?u=3',
    status: 'En progreso'
  },
  {
    id: 'JIRA-126',
    title: 'Optimizar consultas a base de datos',
    project: 'API Backend',
    assignee: 'Carlos Ruiz',
    avatarUrl: 'https://i.pravatar.cc/48?u=4',
    status: 'En revisión'
  },
  {
    id: 'JIRA-127',
    title: 'Implementar tests de integración',
    project: 'API Backend',
    assignee: 'María López',
    avatarUrl: 'https://i.pravatar.cc/48?u=1',
    status: 'Por hacer'
  }
];

// Datos de ejemplo para registros de tiempo
interface TimeLogEntry {
  id: string;
  taskId: string;
  taskTitle: string;
  date: Date;
  hours: number;
  description: string;
  user: string;
  avatarUrl: string;
}

const timeLogsMock: TimeLogEntry[] = [
  {
    id: '1',
    taskId: 'JIRA-123',
    taskTitle: 'Implementar integración con API',
    date: new Date(2023, 5, 15),
    hours: 2.5,
    description: 'Configuración inicial de la conexión con la API',
    user: 'María López',
    avatarUrl: 'https://i.pravatar.cc/48?u=1'
  },
  {
    id: '2',
    taskId: 'JIRA-123',
    taskTitle: 'Implementar integración con API',
    date: new Date(2023, 5, 16),
    hours: 3,
    description: 'Implementación de endpoints para autenticación',
    user: 'María López',
    avatarUrl: 'https://i.pravatar.cc/48?u=1'
  },
  {
    id: '3',
    taskId: 'JIRA-125',
    taskTitle: 'Solucionar bug en login',
    date: new Date(2023, 5, 15),
    hours: 1.5,
    description: 'Depuración del sistema de login',
    user: 'Ana García',
    avatarUrl: 'https://i.pravatar.cc/48?u=3'
  },
  {
    id: '4',
    taskId: 'JIRA-126',
    taskTitle: 'Optimizar consultas a base de datos',
    date: new Date(2023, 5, 14),
    hours: 4,
    description: 'Optimización de consultas principales',
    user: 'Carlos Ruiz',
    avatarUrl: 'https://i.pravatar.cc/48?u=4'
  },
];

// Componente principal
const TimeTracking: React.FC = () => {
  const [timeLogs, setTimeLogs] = useState<TimeLogEntry[]>(timeLogsMock);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLog, setSelectedLog] = useState<TimeLogEntry | null>(null);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [logDate, setLogDate] = useState<Date | null>(new Date());
  const [logHours, setLogHours] = useState<string>('');
  const [logDescription, setLogDescription] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Manejar apertura del diálogo
  const handleOpenDialog = (log?: TimeLogEntry) => {
    if (log) {
      setSelectedLog(log);
      setSelectedTask(log.taskId);
      setLogDate(log.date);
      setLogHours(log.hours.toString());
      setLogDescription(log.description);
    } else {
      setSelectedLog(null);
      setSelectedTask('');
      setLogDate(new Date());
      setLogHours('');
      setLogDescription('');
    }
    setOpenDialog(true);
  };

  // Manejar cierre del diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Manejar cambio de tarea seleccionada
  const handleTaskChange = (event: SelectChangeEvent) => {
    setSelectedTask(event.target.value as string);
  };

  // Manejar cambio de filtro
  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as string);
  };

  // Manejar búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Manejar guardar registro
  const handleSaveLog = () => {
    if (!selectedTask || !logDate || !logHours || isNaN(parseFloat(logHours))) {
      // Aquí deberías mostrar un error
      return;
    }

    const selectedTaskData = tasksMock.find(task => task.id === selectedTask);
    if (!selectedTaskData) return;

    if (selectedLog) {
      // Actualizar registro existente
      setTimeLogs(prevLogs => prevLogs.map(log => 
        log.id === selectedLog.id
          ? {
              ...log,
              taskId: selectedTask,
              taskTitle: selectedTaskData.title,
              date: logDate,
              hours: parseFloat(logHours),
              description: logDescription
            }
          : log
      ));
    } else {
      // Crear nuevo registro
      const newLog: TimeLogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        taskId: selectedTask,
        taskTitle: selectedTaskData.title,
        date: logDate as Date,
        hours: parseFloat(logHours),
        description: logDescription,
        user: 'María López', // Usuario actual (hardcoded para el ejemplo)
        avatarUrl: 'https://i.pravatar.cc/48?u=1'
      };
      
      setTimeLogs([...timeLogs, newLog]);
    }
    
    handleCloseDialog();
  };

  // Manejar eliminar registro
  const handleDeleteLog = (id: string) => {
    setTimeLogs(timeLogs.filter(log => log.id !== id));
  };

  // Filtrar registros
  const filteredLogs = timeLogs.filter(log => {
    // Filtro por tarea
    const taskFilter = filter === 'all' || log.taskId === filter;
    
    // Búsqueda por texto
    const searchFilter = searchTerm === '' || 
      log.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return taskFilter && searchFilter;
  });

  // Calcular horas totales
  const totalHours = filteredLogs.reduce((sum, log) => sum + log.hours, 0);
  const weeklyHours = filteredLogs
    .filter(log => {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      return log.date >= startOfWeek;
    })
    .reduce((sum, log) => sum + log.hours, 0);

  // Agrupar por tarea para el resumen
  const taskSummary = filteredLogs.reduce((acc: Record<string, number>, log) => {
    if (!acc[log.taskId]) {
      acc[log.taskId] = 0;
    }
    acc[log.taskId] += log.hours;
    return acc;
  }, {});

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Registro de Tiempo
      </Typography>

      {/* Resumen de horas */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Resumen
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body2">Total registrado</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    {totalHours} horas
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="body2">Esta semana</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight={600}>
                    {weeklyHours} horas
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Horas por Tarea
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {Object.entries(taskSummary).map(([taskId, hours]) => {
                const task = tasksMock.find(t => t.id === taskId);
                return (
                  <Box key={taskId} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={taskId} 
                      size="small" 
                      sx={{ mr: 1 }} 
                    />
                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                      {task?.title}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {hours} horas
                    </Typography>
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros y acciones */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="filter-label">Filtrar por tarea</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              onChange={handleFilterChange}
              label="Filtrar por tarea"
            >
              <MenuItem value="all">Todas las tareas</MenuItem>
              {tasksMock.map(task => (
                <MenuItem key={task.id} value={task.id}>
                  {task.id} - {task.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            size="small"
            placeholder="Buscar..."
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
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Registrar Tiempo
        </Button>
      </Box>

      {/* Tabla de registros */}
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Tarea</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell align="right">Horas</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip 
                      label={log.taskId} 
                      size="small" 
                      sx={{ mr: 1 }} 
                    />
                    <Typography variant="body2">
                      {log.taskTitle}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {format(log.date, 'dd MMM yyyy', { locale: es })}
                </TableCell>
                <TableCell align="right">{log.hours}</TableCell>
                <TableCell>{log.description}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      src={log.avatarUrl} 
                      alt={log.user} 
                      sx={{ width: 24, height: 24, mr: 1 }} 
                    />
                    <Typography variant="body2">
                      {log.user}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => handleOpenDialog(log)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" onClick={() => handleDeleteLog(log.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filteredLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" sx={{ py: 2 }}>
                    No se encontraron registros.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear/editar registros */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedLog ? 'Editar registro' : 'Nuevo registro de tiempo'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="task-select-label">Tarea</InputLabel>
              <Select
                labelId="task-select-label"
                value={selectedTask}
                onChange={handleTaskChange}
                label="Tarea"
              >
                {tasksMock.map(task => (
                  <MenuItem key={task.id} value={task.id}>
                    {task.id} - {task.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
              <DatePicker 
                label="Fecha"
                value={logDate}
                onChange={setLogDate}
                sx={{ mt: 2, width: '100%' }}
              />
            </LocalizationProvider>
            
            <TextField
              margin="normal"
              label="Horas"
              type="number"
              fullWidth
              value={logHours}
              onChange={(e) => setLogHours(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">h</InputAdornment>,
                inputProps: { min: 0, step: 0.25 }
              }}
            />
            
            <TextField
              margin="normal"
              label="Descripción"
              multiline
              rows={3}
              fullWidth
              value={logDescription}
              onChange={(e) => setLogDescription(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveLog} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimeTracking;