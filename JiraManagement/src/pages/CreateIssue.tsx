import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Grid, 
  Divider, 
  Chip,
  FormHelperText,
  Autocomplete,
  Avatar,
  IconButton,
  Stack,
  Alert,
  Card,
  CardContent,
  SelectChangeEvent,
  Snackbar
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { 
  Description as DescriptionIcon,
  People as PeopleIcon,
  Flag as FlagIcon,
  Label as LabelIcon,
  Today as TodayIcon,
  AttachFile as AttachFileIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

// Datos de ejemplo
const projectsData = [
  { id: 'WEB', name: 'Proyecto Web', key: 'WEB' },
  { id: 'API', name: 'API Backend', key: 'API' },
  { id: 'MOBILE', name: 'Aplicación Móvil', key: 'MOBILE' }
];

const issueTypesData = [
  { id: 'task', name: 'Tarea', icon: '🔧', color: '#4BADE8' },
  { id: 'bug', name: 'Bug', icon: '🐞', color: '#E83F5B' },
  { id: 'story', name: 'Historia', icon: '📝', color: '#65BA43' },
  { id: 'epic', name: 'Epic', icon: '🚀', color: '#904EE2' }
];

const prioritiesData = [
  { id: 'highest', name: 'Crítica', color: '#E83F5B' },
  { id: 'high', name: 'Alta', color: '#FF8B00' },
  { id: 'medium', name: 'Media', color: '#FFAB00' },
  { id: 'low', name: 'Baja', color: '#65BA43' }
];

const usersData = [
  { id: 'user1', name: 'María López', avatar: 'https://i.pravatar.cc/48?u=1' },
  { id: 'user2', name: 'Juan Pérez', avatar: 'https://i.pravatar.cc/48?u=2' },
  { id: 'user3', name: 'Ana García', avatar: 'https://i.pravatar.cc/48?u=3' },
  { id: 'user4', name: 'Carlos Ruiz', avatar: 'https://i.pravatar.cc/48?u=4' }
];

const labelsData = [
  'frontend', 'backend', 'api', 'bug', 'feature', 'documentation', 
  'ui', 'ux', 'performance', 'security', 'testing', 'database'
];

// Interfaz para el formulario
interface IssueFormData {
  project: string;
  issueType: string;
  summary: string;
  description: string;
  assignee: string;
  reporter: string;
  priority: string;
  labels: string[];
  dueDate: Date | null;
  estimatedTime: string;
  files: File[];
}

const CreateIssue: React.FC = () => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);
  
  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<IssueFormData>({
    defaultValues: {
      project: '',
      issueType: 'task',
      summary: '',
      description: '',
      assignee: '',
      reporter: 'user1', // Usuario actual (hardcoded para el ejemplo)
      priority: 'medium',
      labels: [],
      dueDate: null,
      estimatedTime: '',
      files: []
    }
  });
  
  // Actualizar proyecto seleccionado para mostrar el prefijo del issue
  const handleProjectChange = (event: SelectChangeEvent) => {
    setSelectedProject(event.target.value as string);
  };
  
  // Manejar selección de archivos
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFileList([...fileList, ...newFiles]);
      setValue('files', [...fileList, ...newFiles]);
    }
  };
  
  // Eliminar un archivo
  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...fileList];
    updatedFiles.splice(index, 1);
    setFileList(updatedFiles);
    setValue('files', updatedFiles);
  };
  
  // Enviar formulario
  const onSubmit = (data: IssueFormData) => {
    console.log('Formulario enviado:', data);
    // Aquí iría la lógica para enviar los datos a la API de Jira
    
    // Mostrar mensaje de éxito
    setSuccessMessage(true);
    
    // Redireccionar después de un breve retraso
    setTimeout(() => {
      navigate('/my-tasks');
    }, 2000);
  };
  
  // Generar el prefijo del issue basado en el proyecto
  const getIssuePrefix = () => {
    const project = projectsData.find(p => p.id === selectedProject);
    return project ? `${project.key}-` : '';
  };
  
  return (
    <Box>
      <Typography variant="h4" fontWeight={600} mb={3}>
        Crear Tarea
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          {/* Columna principal del formulario */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
              {/* Campos de Proyecto y Tipo */}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="project"
                    control={control}
                    rules={{ required: 'El proyecto es obligatorio' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.project}>
                        <InputLabel id="project-label">Proyecto</InputLabel>
                        <Select
                          {...field}
                          labelId="project-label"
                          label="Proyecto"
                          onChange={(e) => {
                            field.onChange(e);
                            handleProjectChange(e);
                          }}
                        >
                          {projectsData.map((project) => (
                            <MenuItem key={project.id} value={project.id}>
                              {project.name}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.project && (
                          <FormHelperText>{errors.project.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    name="issueType"
                    control={control}
                    rules={{ required: 'El tipo de tarea es obligatorio' }}
                    render={({ field }) => (
                      <FormControl fullWidth error={!!errors.issueType}>
                        <InputLabel id="issue-type-label">Tipo</InputLabel>
                        <Select
                          {...field}
                          labelId="issue-type-label"
                          label="Tipo"
                        >
                          {issueTypesData.map((type) => (
                            <MenuItem key={type.id} value={type.id}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '8px' }}>{type.icon}</span>
                                {type.name}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.issueType && (
                          <FormHelperText>{errors.issueType.message}</FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
              
              {/* Título de la tarea */}
              <Controller
                name="summary"
                control={control}
                rules={{ 
                  required: 'El título es obligatorio',
                  minLength: { value: 5, message: 'El título debe tener al menos 5 caracteres' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Título"
                    variant="outlined"
                    placeholder="Resume brevemente la tarea"
                    margin="normal"
                    error={!!errors.summary}
                    helperText={errors.summary?.message}
                    InputProps={{
                      startAdornment: selectedProject ? (
                        <Typography 
                          variant="body1" 
                          sx={{ color: 'text.secondary', mr: 1 }}
                        >
                          {getIssuePrefix()}
                        </Typography>
                      ) : null,
                    }}
                  />
                )}
              />
              
              {/* Descripción */}
              <Box sx={{ mt: 3, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <DescriptionIcon fontSize="small" sx={{ mr: 1 }} />
                  Descripción
                </Typography>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={6}
                      placeholder="Describe detalladamente la tarea"
                      variant="outlined"
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />
              </Box>
              
              {/* Archivos adjuntos */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                  <AttachFileIcon fontSize="small" sx={{ mr: 1 }} />
                  Archivos adjuntos
                </Typography>
                
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<AttachFileIcon />}
                  sx={{ mb: 2 }}
                >
                  Seleccionar archivos
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileSelect}
                  />
                </Button>
                
                {fileList.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {fileList.map((file, index) => (
                        <Chip
                          key={index}
                          label={file.name}
                          onDelete={() => handleRemoveFile(index)}
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
          
          {/* Columna lateral - Detalles y Asignación */}
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <PeopleIcon fontSize="small" sx={{ mr: 1 }} />
                  Asignación
                </Typography>
                
                {/* Responsable */}
                <Box sx={{ mb: 3 }}>
                  <Controller
                    name="assignee"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="assignee-label">Responsable</InputLabel>
                        <Select
                          {...field}
                          labelId="assignee-label"
                          label="Responsable"
                        >
                          <MenuItem value="">Sin asignar</MenuItem>
                          {usersData.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  src={user.avatar} 
                                  alt={user.name} 
                                  sx={{ width: 24, height: 24, mr: 1 }} 
                                />
                                {user.name}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Box>
                
                {/* Creador */}
                <Box sx={{ mb: 3 }}>
                  <Controller
                    name="reporter"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="reporter-label">Creador</InputLabel>
                        <Select
                          {...field}
                          labelId="reporter-label"
                          label="Creador"
                        >
                          {usersData.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar 
                                  src={user.avatar} 
                                  alt={user.name} 
                                  sx={{ width: 24, height: 24, mr: 1 }} 
                                />
                                {user.name}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Box>
              </CardContent>
            </Card>
            
            <Card elevation={0} sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <FlagIcon fontSize="small" sx={{ mr: 1 }} />
                  Detalles
                </Typography>
                
                {/* Prioridad */}
                <Box sx={{ mb: 3 }}>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="priority-label">Prioridad</InputLabel>
                        <Select
                          {...field}
                          labelId="priority-label"
                          label="Prioridad"
                        >
                          {prioritiesData.map((priority) => (
                            <MenuItem key={priority.id} value={priority.id}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <FlagIcon 
                                  fontSize="small" 
                                  sx={{ color: priority.color, mr: 1 }} 
                                />
                                {priority.name}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Box>
                
                {/* Fecha límite */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    <TodayIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Fecha límite
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                    <Controller
                      name="dueDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value}
                          onChange={(date) => field.onChange(date)}
                          label="Fecha límite"
                          slotProps={{ textField: { fullWidth: true, variant: 'outlined' } }}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
                
                {/* Tiempo estimado */}
                <Box sx={{ mb: 3 }}>
                  <Controller
                    name="estimatedTime"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Tiempo estimado"
                        placeholder="Ej. 2h 30m"
                        variant="outlined"
                        helperText="Formato: 2h 30m, 4h, 90m..."
                      />
                    )}
                  />
                </Box>
                
                {/* Etiquetas */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    <LabelIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                    Etiquetas
                  </Typography>
                  <Controller
                    name="labels"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={labelsData}
                        value={field.value}
                        onChange={(_, newValue) => field.onChange(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Añadir etiquetas"
                            variant="outlined"
                            fullWidth
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip 
                              label={option} 
                              {...getTagProps({ index })} 
                              size="small" 
                              sx={{ 
                                backgroundColor: 'rgba(0, 82, 204, 0.1)',
                                color: '#0052CC'
                              }}
                            />
                          ))
                        }
                      />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Botones de acción */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained"
          >
            Crear Tarea
          </Button>
        </Box>
      </form>
      
      {/* Mensaje de éxito */}
      <Snackbar 
        open={successMessage} 
        autoHideDuration={6000} 
        onClose={() => setSuccessMessage(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSuccessMessage(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          ¡Tarea creada con éxito!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateIssue;