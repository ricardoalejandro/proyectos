import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Definir los reportes disponibles
  const reports = [
    { 
      id: 'looker-general', 
      name: 'Reporte General', 
      description: 'Vista general de los indicadores clave de desempeño y métricas principales.',
      color: 'bg-blue-100 border-blue-500',
      icon: (
        <svg className="h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ) 
    },
    { 
      id: 'looker-ventas', 
      name: 'Análisis de Ventas', 
      description: 'Datos detallados sobre ventas, tendencias y proyecciones para la toma de decisiones.',
      color: 'bg-green-100 border-green-500',
      icon: (
        <svg className="h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'looker-usuarios', 
      name: 'Datos de Usuarios', 
      description: 'Información demográfica y de comportamiento de usuarios de la plataforma.',
      color: 'bg-purple-100 border-purple-500',
      icon: (
        <svg className="h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      id: 'looker-actividad', 
      name: 'Actividad Reciente', 
      description: 'Monitoreo de actividades recientes y eventos importantes en el sistema.',
      color: 'bg-amber-100 border-amber-500',
      icon: (
        <svg className="h-8 w-8 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard de Reportes</h1>
        <p className="text-gray-600 mb-8">Selecciona un reporte para visualizar información detallada</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reports.map((report) => (
            <Link
              key={report.id}
              to={`/report/${report.id}`}
              className={`card border-l-4 ${report.color} p-5 hover:translate-y-[-5px] transition-transform duration-300`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  {report.icon}
                  <h3 className="text-lg font-semibold text-gray-800 ml-3">{report.name}</h3>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">{report.description}</p>
                <div className="flex justify-end">
                  <span className="text-sm text-primary font-medium flex items-center">
                    Ver reporte
                    <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Sección de información adicional */}
      <div className="mt-10 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reportes Destacados</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-2/3 pr-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Analiza tus datos con nuestro visor de reportes</h3>
              <p className="text-gray-600 mb-4">
                Esta plataforma te permite visualizar e interactuar con tus reportes de Looker Studio de manera sencilla y eficiente.
                Disfruta de una interfaz moderna y responsiva que se adapta a cualquier dispositivo.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Looker Studio</span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Reportes Interactivos</span>
                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">Visualización de Datos</span>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center items-center mt-4 md:mt-0">
              <div className="p-4 bg-blue-50 rounded-full">
                <svg className="h-24 w-24 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;