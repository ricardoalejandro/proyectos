import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '150px',
            fontWeight: 700,
            color: 'primary.light',
            mb: 2,
            lineHeight: 1,
          }}
        >
          404
        </Typography>
        <Typography variant="h4" color="text.primary" gutterBottom>
          Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
          Por favor, verifica la URL o regresa a la página de inicio.
        </Typography>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          size="large"
          onClick={() => navigate('/')}
          sx={{ mt: 3 }}
        >
          Volver al inicio
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;