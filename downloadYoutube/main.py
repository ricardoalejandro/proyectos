import os
import sys
import datetime
import re
import uuid
import yt_dlp
import subprocess
from pathlib import Path

def check_ffmpeg_installed():
    """
    Verifica si FFmpeg está instalado en el sistema.
    
    Returns:
        bool: True si FFmpeg está instalado, False en caso contrario.
    """
    try:
        # Intentar ejecutar ffmpeg para verificar si está instalado
        subprocess.run(['ffmpeg', '-version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except FileNotFoundError:
        return False

def extract_audio_from_video(video_path, output_dir=None, quality='192'):
    """
    Extrae el audio de un archivo de video existente usando FFmpeg.
    
    Args:
        video_path: Ruta al archivo de video
        output_dir: Directorio de salida, si es None se usa el mismo directorio del video
        quality: Calidad del audio MP3 (bitrate)
    
    Returns:
        str: Ruta al archivo de audio extraído o None si hay error
    """
    try:
        # Verificar que FFmpeg esté instalado
        if not check_ffmpeg_installed():
            print("ERROR: FFmpeg no está instalado. Por favor instálalo para extraer audio.")
            print("Puedes descargarlo desde: https://ffmpeg.org/download.html")
            return None
            
        # Determinar el directorio de salida
        if output_dir is None:
            output_dir = os.path.dirname(video_path)
            
        # Generar nombre de archivo para el audio
        video_filename = os.path.basename(video_path)
        base_name = os.path.splitext(video_filename)[0]
        audio_filename = f"{base_name}_audio.mp3"
        audio_path = os.path.join(output_dir, audio_filename)
        
        # Comando para extraer el audio
        cmd = [
            'ffmpeg',
            '-i', video_path,            # Archivo de entrada
            '-q:a', quality,             # Calidad del audio
            '-vn',                       # No incluir video
            '-f', 'mp3',                 # Formato de salida
            '-y',                        # Sobrescribir si existe
            audio_path                   # Archivo de salida
        ]
        
        print(f"Extrayendo audio del video: {video_path}")
        subprocess.run(cmd, check=True)
        
        print(f"¡Extracción de audio completada con éxito!")
        print(f"El audio se guardó en: {audio_path}")
        return audio_path
        
    except subprocess.CalledProcessError as e:
        print(f"Error al extraer el audio: {str(e)}")
        return None
    except Exception as e:
        print(f"Error inesperado: {str(e)}")
        return None

def download_youtube_video(url, extract_audio=False, download_folder=None):
    """
    Descarga un video de YouTube desde la URL proporcionada
    y lo guarda en la carpeta especificada con un nombre único.
    Opcionalmente extrae el audio en formato MP3.
    
    Args:
        url: URL del video de YouTube
        extract_audio: Si es True, también extrae el audio en formato MP3
        download_folder: Carpeta donde se guardarán las descargas. Si es None, se usará
                         la carpeta de descargas de Windows con una subcarpeta única
    
    Returns:
        Diccionario con las rutas de los archivos descargados (video y audio si corresponde)
    """
    try:
        # Crear un ID único para esta descarga
        download_id = datetime.datetime.now().strftime("%Y%m%d_%H%M%S") + "_" + uuid.uuid4().hex[:8]
        
        # Si no se especifica una carpeta, usar la carpeta de descargas de Windows con una subcarpeta única
        if download_folder is None:
            # Obtener la ruta de la carpeta de descargas de Windows
            downloads_folder = os.path.join(os.path.expanduser("~"), "Downloads")
            # Crear una subcarpeta única para esta descarga
            download_folder = os.path.join(downloads_folder, f"youtube_download_{download_id}")
        
        # Crear la carpeta de descargas si no existe
        if not os.path.exists(download_folder):
            os.makedirs(download_folder)
        
        # Intentar extraer el ID del video de la URL para un nombre de respaldo
        try:
            video_id = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', url)
            if video_id:
                backup_name = f"youtube_video_{video_id.group(1)}"
            else:
                backup_name = f"youtube_video_{uuid.uuid4().hex[:10]}"
        except Exception:
            backup_name = f"youtube_video_{uuid.uuid4().hex[:10]}"
            
        # Nombre de archivo base único que se usará si no se puede obtener el título
        base_filename = f"{download_id}_{backup_name}"
        full_output_path = os.path.join(os.path.abspath(download_folder), f"{base_filename}.%(ext)s")
        
        results = {"download_folder": download_folder}
        
        # Descargar el video primero
        video_opts = {
            'format': 'best',  # Mejor calidad disponible
            'outtmpl': full_output_path,  # Plantilla para el nombre de salida
            'noplaylist': True,  # Solo descargar el video, no la lista de reproducción
            'quiet': False,  # Mostrar información en la consola
            'no_warnings': False,  # Mostrar advertencias
        }
        
        print(f"Iniciando descarga desde: {url}")
        print(f"Los archivos se guardarán en: {os.path.abspath(download_folder)}")
        
        # Descargar el video usando yt-dlp
        with yt_dlp.YoutubeDL(video_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            
            # Mostrar información del video descargado
            if info:
                if 'title' in info:
                    print(f"Título: {info['title']}")
                    video_title = info['title']  # Guardar para usarlo más tarde
                else:
                    video_title = backup_name
                    
                if 'duration' in info:
                    print(f"Duración: {info['duration']} segundos")
                if 'format' in info:
                    print(f"Formato: {info['format']}")
                
                # Obtener la ruta del archivo descargado
                if '_filename' in info:
                    video_file = info['_filename']
                elif 'requested_downloads' in info and info['requested_downloads']:
                    video_file = info['requested_downloads'][0].get('filepath', '')
                else:
                    # Si no podemos obtener el nombre de archivo de la info, intentamos construirlo
                    if 'ext' in info:
                        ext = info['ext']
                    else:
                        ext = 'mp4'  # Extensión predeterminada
                    video_file = os.path.join(os.path.abspath(download_folder), f"{base_filename}.{ext}")
                
                results["video_file"] = video_file
                print(f"\n¡Descarga de video completada con éxito!")
                print(f"El video se guardó en: {video_file}")
                
                # Si se solicita extraer el audio, usar FFmpeg directamente
                if extract_audio:
                    print("\nExtrayendo audio usando FFmpeg...")
                    audio_file = extract_audio_from_video(video_file, download_folder)
                    if audio_file:
                        results["audio_file"] = audio_file
                
                return results
            else:
                print("No se pudo obtener información del video.")
                return None
        
    except Exception as e:
        print(f"Error al procesar el video: {str(e)}")
        return None

def extract_audio_only(video_path):
    """
    Función independiente para extraer el audio de un video ya descargado.
    
    Args:
        video_path: Ruta al archivo de video
    
    Returns:
        str: Ruta al archivo de audio extraído o None si hay error
    """
    if not os.path.exists(video_path):
        print(f"Error: El archivo {video_path} no existe")
        return None
        
    output_dir = os.path.dirname(video_path)
    return extract_audio_from_video(video_path, output_dir)

if __name__ == "__main__":
    # Verificar los argumentos
    if len(sys.argv) < 2:
        print("Uso: python main.py <URL_de_YouTube> [--extract-audio]")
        print("  o:  python main.py --extract-from <ruta_del_video>")
        sys.exit(1)
    
    # Verificar si se trata de extracción directa de un video
    if sys.argv[1] == "--extract-from" and len(sys.argv) >= 3:
        video_path = sys.argv[2]
        extract_audio_only(video_path)
    else:
        # Descargar video desde URL
        url = sys.argv[1]
        extract_audio = "--extract-audio" in sys.argv
        download_youtube_video(url, extract_audio=extract_audio)