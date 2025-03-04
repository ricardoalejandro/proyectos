"""
Módulo de Carga (Load)
Este módulo se encarga de la consolidación final de los datos transformados
en un archivo Excel que contiene el resumen de todas las filiales.
"""

import os
import sys
import pandas as pd
import logging
from datetime import datetime

# Añadir el directorio src al path de Python de forma dinámica
current_dir = os.path.dirname(os.path.abspath(__file__))
src_dir = os.path.dirname(current_dir)
if src_dir not in sys.path:
    sys.path.append(src_dir)

from config_loader import config

class ExcelWriter:
    """
    Clase encargada de escribir los datos consolidados en un archivo Excel.
    Maneja la agregación de datos y la generación del archivo final.
    """
    
    def __init__(self, summary_dir):
        """
        Inicializa el escritor con el directorio donde se guardarán los archivos consolidados.
        Crea el directorio si no existe.
        """
        self.summary_dir = summary_dir
        if not os.path.exists(summary_dir):
            os.makedirs(summary_dir)
    
    def update_consolidated(self, data):
        """
        Actualiza el archivo consolidado con los nuevos datos.
        
        El proceso incluye:
        1. Validación de datos de entrada
        2. Creación de DataFrame con estructura específica
        3. Agregación de datos por filial, mes, día y grupo
        4. Generación de archivo Excel con timestamp único
        
        Args:
            data (dict): Diccionario con los datos transformados
            
        Returns:
            bool: True si el proceso fue exitoso, False en caso contrario
        """
        try:
            if not data or 'registros' not in data:
                logging.error("No hay datos para escribir")
                return False
            
            # Crear DataFrame base con los nuevos registros
            new_df = pd.DataFrame(data['registros'])
            
            # Asegurar que existe la columna de filial
            if 'filial' not in new_df.columns and data.get('filiales'):
                new_df['filial'] = data['filiales'][0]
            
            # Definir el orden de las columnas base del reporte
            base_columns = [
                'filial',      # Identificador de la filial
                'mes',         # Mes del registro
                'diaclase',    # Día de la clase
                'fechainicio', # Fecha de inicio
                'grupo',       # Grupo de clase
                'tipoinscrito' # Tipo de inscripción
            ]
            
            # Asegurar que existan todas las columnas base
            for col in base_columns:
                if col not in new_df.columns:
                    new_df[col] = None
            
            # Procesar columnas de semanas (sem1-sem4)
            sem_columns = []
            for sem in ['sem1', 'sem2', 'sem3', 'sem4']:
                if sem in new_df.columns:
                    sem_columns.append(sem)
                else:
                    # Crear columnas de semanas si no existen
                    new_df[sem] = None
                    sem_columns.append(sem)
            
            # Ordenar columnas según estructura requerida
            column_order = base_columns + sem_columns
            new_df = new_df[column_order]
            
            # Definir reglas de agregación para cada columna
            agg_dict = {
                'fechainicio': 'max',      # Última fecha de inicio
                'tipoinscrito': 'first'    # Primer tipo de inscrito
            }
            
            # Configurar agregación para columnas de semanas
            for sem in ['sem1', 'sem2', 'sem3', 'sem4']:
                # Contar asistencias ('P') por semana
                agg_dict[sem] = lambda x: (x == 'P').sum() if x.dtype == object else 0
            
            # Aplicar agregación por grupos clave
            aggregated_df = new_df.groupby(
                ['filial', 'mes', 'diaclase', 'grupo'], 
                as_index=False
            ).agg(agg_dict)
            
            # Ordenar columnas en el resultado final
            final_columns = base_columns + ['sem1', 'sem2', 'sem3', 'sem4']
            final_df = aggregated_df[final_columns]
            
            # Crear nombre único para el archivo con timestamp
            timestamp = datetime.now().strftime(config.formats['timestamp'])
            new_consolidated_filename = f'consolidated_{timestamp}.xlsx'
            new_consolidated_path = os.path.join(self.summary_dir, new_consolidated_filename)
            
            # Guardar resultado final
            final_df.to_excel(new_consolidated_path, index=False, sheet_name='Consolidado')
            
            logging.info(f"Nuevo archivo consolidado creado exitosamente: {new_consolidated_path}")
            return True
            
        except Exception as e:
            logging.error(f"Error al crear el archivo consolidado: {e}")
            return False