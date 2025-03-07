import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

// Componente de Layout principal
import Layout from './components/Layout';

// Páginas
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import BoardView from './pages/BoardView';
import TimeTracking from './pages/TimeTracking';
import CreateIssue from './pages/CreateIssue';
import NotFound from './pages/NotFound';

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#0052CC', // Color principal de Jira
      light: '#4C9AFF',
      dark: '#0747A6',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#6554C0', // Color morado para acentos
      light: '#8777D9',
      dark: '#5243AA',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F4F5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#172B4D',
      secondary: '#6B778C',
    },
    success: {
      main: '#36B37E', // Verde para estados completados
    },
    error: {
      main: '#FF5630', // Rojo para errores y prioridad alta
    },
    warning: {
      main: '#FFAB00', // Amarillo para advertencias
    },
    info: {
      main: '#4C9AFF', // Azul para información
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
        },
        contained: {
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(9,30,66,0.13)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px rgba(9,30,66,0.13)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <CssBaseline />
        <Router>
          <Layout open={open} onToggle={toggleDrawer}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/my-tasks" element={<MyTasks />} />
              <Route path="/board" element={<BoardView />} />
              <Route path="/time-tracking" element={<TimeTracking />} />
              <Route path="/create-issue" element={<CreateIssue />} />
              <Route path="/issues/:issueId" element={<div>Detalles de la tarea (por implementar)</div>} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate replace to="/404" />} />
            </Routes>
          </Layout>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;