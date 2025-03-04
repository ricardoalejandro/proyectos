"""
Módulo de Transformación (Transform)
Este módulo se encarga de procesar y limpiar los datos extraídos de los archivos Excel.
Aplica reglas de negocio específicas y prepara los datos para su consolidación.
"""

import os
import sys
import logging
from datetime import datetime

# Añadir el directorio src al path de Python de forma dinámica
current_dir = os.path.dirname(os.path.abspath(__file__))
src_dir = os.path.dirname(current_dir)
if src_dir not in sys.path:
    sys.path.append(src_dir)

from config_loader import config
import pandas as pd

class ExcelProcessor:
    """
    Clase principal para la transformación de datos.
    Aplica reglas de negocio y realiza la limpieza de datos.
    """

    def transform_dataframe(self, df, filial):
        """
        Transforma un DataFrame aplicando las reglas de negocio establecidas:
        - Filtra registros que no son "Pre-Inscrito"
        - Mapea las columnas según la configuración
        - Agrega la información de la filial a cada registro
        
        Args:
            df (DataFrame): DataFrame con los datos crudos
            filial (str): Nombre de la filial del archivo
            
        Returns:
            dict: Diccionario con la filial y los registros procesados
        """
        try:
            # Filtrar registros excluyendo "Pre-Inscrito"
            tipo_inscrito_col = config.excel['structure']['columns']['tipoinscrito']['expected_name']
            df_filtered = df[df[tipo_inscrito_col] != "Pre-Inscrito"]
            
            # Mapear columnas y crear registros procesados
            registros = []
            for _, row in df_filtered.iterrows():
                registro = {}
                for field, field_config in config.excel['structure']['columns'].items():
                    registro[field] = row[field_config['expected_name']]
                # Agregar identificador de filial
                registro['filial'] = filial
                registros.append(registro)
            
            return {
                'filial': filial,
                'registros': registros
            }
        except Exception as e:
            logging.error(f"Error en la transformación de datos: {e}")
            return None

    def process_files(self, extracted_data):
        """
        Procesa todos los archivos extraídos y genera un conjunto consolidado de datos.
        
        Args:
            extracted_data (list): Lista de diccionarios con los datos extraídos
            
        Returns:
            dict: Diccionario con las filiales procesadas y sus registros
        """
        if not extracted_data:
            logging.error("No hay datos para procesar")
            return {}
        
        # Estructura para almacenar datos transformados
        transformed_data = {
            'filiales': [],      # Lista de filiales únicas
            'registros': []      # Lista de todos los registros procesados
        }
        
        # Procesar cada conjunto de datos extraído
        for data in extracted_data:
            if not data or 'filial' not in data or 'dataframe' not in data:
                logging.error("Estructura de datos inválida")
                continue
            
            # Aplicar transformación
            result = self.transform_dataframe(data['dataframe'], data['filial'])
            if not result:
                continue
                
            # Agregar filial si es nueva
            if result['filial'] not in transformed_data['filiales']:
                transformed_data['filiales'].append(result['filial'])
            
            # Agregar registros procesados
            transformed_data['registros'].extend(result['registros'])
        
        logging.info(f"Transformación completada. {len(transformed_data['registros'])} registros procesados de {len(transformed_data['filiales'])} filiales")
        return transformed_data