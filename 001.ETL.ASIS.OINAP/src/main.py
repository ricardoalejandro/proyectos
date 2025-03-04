"""
Módulo principal del proceso ETL para la gestión de asistencias OINAP.
Este script coordina las tres fases principales del proceso ETL:
1. Extracción (Extract): Descarga archivos Excel de OneDrive
2. Transformación (Transform): Procesa y limpia los datos
3. Carga (Load): Consolida los datos en un archivo final
"""

import logging
import os
from datetime import datetime
from config_loader import config
from extract.extract import ExcelDownloader
from transform.transform import ExcelProcessor
from load.load import ExcelWriter

def setup_logging():
    """
    Configura el sistema de logging para el seguimiento de la ejecución.
    - Crea un archivo de log con timestamp único
    - Configura el formato y nivel de logging según config.json
    - Establece dos handlers: uno para archivo y otro para consola
    """
    timestamp = datetime.now().strftime(config.formats['timestamp'])
    if not os.path.exists(config.logs_dir):
        os.makedirs(config.logs_dir)
    
    log_file = os.path.join(config.logs_dir, f'execution_{timestamp}.log')
    logging.basicConfig(
        level=getattr(logging, config.logging['level']),
        format=config.logging['format'],
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger()

def main():
    """
    Función principal que ejecuta el proceso ETL completo.
    Coordina las tres fases del proceso y maneja los errores que puedan surgir.
    """
    # Inicialización del sistema de logs
    logger = setup_logging()
    logger.info("Iniciando proceso ETL")

    try:
        # FASE 1: EXTRACCIÓN
        # Descarga los archivos Excel desde las URLs configuradas
        # y los guarda en el directorio de descargas
        downloader = ExcelDownloader(config.data_dir)
        extracted_data = downloader.process_urls(config.excel_urls)
        logger.info(f"Archivos procesados: {len(extracted_data)}")
    
        # FASE 2: TRANSFORMACIÓN
        # Procesa los datos extraídos aplicando reglas de negocio
        # y preparándolos para la consolidación
        processor = ExcelProcessor()
        transformed_data = processor.process_files(extracted_data)
        logger.info("Transformación de datos completada")

        # FASE 3: CARGA
        # Consolida todos los datos transformados en un único archivo Excel
        # con el formato final requerido
        writer = ExcelWriter(config.summary_dir)
        success = writer.update_consolidated(transformed_data)
        
        if success:
            logger.info("Proceso ETL completado exitosamente")
        else:
            logger.error("Error durante la carga de datos")

    except Exception as e:
        logger.error(f"Error en el proceso ETL: {e}")

if __name__ == "__main__":
    main()