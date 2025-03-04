import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ReportViewer = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportInfo, setReportInfo] = useState(null);
  // Aumentamos la altura inicial a 95vh
  const [iframeHeight, setIframeHeight] = useState("95vh");
  
  // Función para transformar URLs de Looker Studio al formato de embed
  const transformLookerUrl = (url) => {
    // Removemos cualquier trailing slash
    url = url.replace(/\/$/, '');

    // Manejamos URLs cortas
    if (url.includes('/s/')) {
      const id = url.split('/s/')[1];
      return `https://lookerstudio.google.com/embed/s/${id}?embedded=true`;
    }

    // Manejamos URLs completas
    if (url.includes('/reporting/')) {
      const id = url.split('/reporting/')[1];
      return `https://lookerstudio.google.com/embed/reporting/${id}?embedded=true`;
    }

    // Si la URL ya tiene parámetros, agregamos embedded=true
    if (url.includes('?')) {
      return `${url}&embedded=true`;
    }

    return `${url}?embedded=true`;
  };
  
  // Aquí definimos la información de nuestros reportes de Looker Studio
  // IMPORTANTE: Reemplaza estas URLs con las de tus propios reportes de Looker Studio
  const reportCatalog = {
    'looker-general': {
      title: 'Reporte General',
      description: 'Visualización general de los principales indicadores de desempeño.',
      url: transformLookerUrl('https://lookerstudio.google.com/embed/reporting/e174ad99-d59e-4495-be03-448de13f09b4/page/p_trqal6aapd'),
      icon: 'chart-bar'
    },
    'looker-ventas': {
      title: 'Análisis de Ventas',
      description: 'Información detallada sobre ventas y proyecciones comerciales.',
      url: transformLookerUrl('https://lookerstudio.google.com/reporting/TU-ID-DE-INFORME-2/page/tuPagina'),
      icon: 'currency-dollar'
    },
    'looker-usuarios': {
      title: 'Datos de Usuarios',
      description: 'Análisis demográfico y de comportamiento de usuarios.',
      url: transformLookerUrl('https://lookerstudio.google.com/reporting/TU-ID-DE-INFORME-3/page/tuPagina'),
      icon: 'user-group'
    },
    'looker-actividad': {
      title: 'Actividad Reciente',
      description: 'Monitoreo de actividades recientes y eventos importantes en el sistema.',
      url: transformLookerUrl('https://lookerstudio.google.com/reporting/TU-ID-DE-INFORME-4/page/tuPagina'),
      icon: 'clock'
    },
    'looker-ejemplo': {
      title: 'Reporte Ejemplo',
      description: 'Ejemplo con URL corta de Looker Studio.',
      url: transformLookerUrl('https://lookerstudio.google.com/s/p3C951mk4xQ'),
      icon: 'chart-bar'
    }
  };
  
  useEffect(() => {
    // Simulamos la carga del reporte
    const loadReport = () => {
      // Comprobamos si el reporte existe en nuestro catálogo
      if (reportCatalog[reportId]) {
        setReportInfo(reportCatalog[reportId]);
        // Añadimos un tiempo de carga simulado para una mejor experiencia de usuario
        setTimeout(() => {
          setLoading(false);
        }, 800);
      } else {
        // Si el reporte no existe, redirigimos al dashboard
        navigate('/');
      }
    };
    
    loadReport();
    
    // Para dispositivos móviles, ajustamos la altura del iframe
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIframeHeight("85vh"); // Más alto en móviles que antes
      } else {
        setIframeHeight("95vh"); // Casi toda la altura de la ventana
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Configuración inicial
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [reportId, navigate]);
  
  // Función para renderizar el ícono apropiado
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'chart-bar':
        return (
          <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'currency-dollar':
        return (
          <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'user-group':
        return (
          <svg className="h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'clock':
        return (
          <svg className="h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3">Cargando reporte...</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-2">
      <div className="mb-4">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center text-primary hover:text-blue-700 transition-colors duration-200"
        >
          <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Volver al Dashboard
        </button>
      </div>
      
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-2 md:mb-0">
          {renderIcon(reportInfo.icon)}
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-800">{reportInfo.title}</h1>
            <p className="text-gray-600">{reportInfo.description}</p>
          </div>
        </div>
        
        <div>
          <button className="btn-primary flex items-center">
            <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar Reporte
          </button>
        </div>
      </div>
      
      {/* Contenedor principal del reporte - iFrame de Looker Studio */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-2">
          <h2 className="font-semibold text-gray-700">Vista del Reporte</h2>
        </div>
        
        <div className="p-0">
          <iframe 
            title={reportInfo.title}
            src={reportInfo.url}
            width="100%" 
            height={iframeHeight} 
            style={{border: "none"}}
            allowFullScreen
            className="rounded-b-lg"
            allow="fullscreen"
            seamless
            frameBorder="0"
          />
        </div>
      </div>
      
      {/* Nota informativa - reducida en tamaño para dar más espacio al reporte */}
      <div className="mt-3 bg-blue-50 p-2 rounded-lg text-sm">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-blue-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="ml-2">
            <h3 className="font-semibold text-blue-800">Nota sobre los reportes</h3>
            <p className="text-xs text-blue-700">
              Los reportes mostrados son interactivos. Puedes hacer clic en diferentes elementos para filtrar y explorar los datos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;