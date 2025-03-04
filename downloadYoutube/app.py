import os
import tkinter as tk
from tkinter import messagebox, StringVar, BooleanVar, Label, Entry, Button, Checkbutton, filedialog
from main import download_youtube_video, extract_audio_only, check_ffmpeg_installed

class YoutubeDownloaderApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Descargador de Videos de YouTube")
        self.root.geometry("550x400")  # Aumentado el tamaño para acomodar nuevas opciones
        self.root.resizable(False, False)
        
        # Inicializar variables que se usarán en múltiples métodos
        self.status_var = StringVar()
        self.status_var.set("Esperando acción del usuario...")
        self.url_var = StringVar()
        self.extract_audio_var = BooleanVar(value=False)
        self.video_file_var = StringVar()
        
        # Configuración de la interfaz
        self.setup_ui()
        
        # Verificar si FFmpeg está instalado
        if not check_ffmpeg_installed():
            messagebox.showwarning(
                "FFmpeg no encontrado", 
                "FFmpeg no está instalado o no se encuentra en el PATH del sistema.\n\n"
                "La extracción de audio no funcionará sin FFmpeg.\n\n"
                "Por favor, descarga e instala FFmpeg desde:\n"
                "https://ffmpeg.org/download.html"
            )
        
    def setup_ui(self):
        # Título
        Label(self.root, text="Descargador de Videos de YouTube", 
              font=("Arial", 14, "bold")).pack(pady=10)
        
        # Marco para pestañas
        tab_frame = tk.Frame(self.root)
        tab_frame.pack(fill="both", expand=True, padx=10, pady=5)
        
        # Botones para "pestañas"
        button_frame = tk.Frame(tab_frame)
        button_frame.pack(fill="x")
        
        self.download_button = Button(button_frame, text="Descargar Video", 
                               command=lambda: self.show_frame(self.download_frame),
                               width=15)
        self.download_button.pack(side=tk.LEFT, padx=5)
        
        self.extract_button = Button(button_frame, text="Extraer Audio", 
                             command=lambda: self.show_frame(self.extract_frame),
                             width=15)
        self.extract_button.pack(side=tk.LEFT, padx=5)
        
        # Separador
        tk.Frame(tab_frame, height=2, bg="gray").pack(fill="x", pady=5)
        
        # Contenedor para los marcos de "pestañas"
        self.container = tk.Frame(tab_frame)
        self.container.pack(fill="both", expand=True, pady=5)
        
        # Marco para descargar videos
        self.download_frame = tk.Frame(self.container)
        self.setup_download_frame(self.download_frame)
        
        # Marco para extraer audio
        self.extract_frame = tk.Frame(self.container)
        self.setup_extract_frame(self.extract_frame)
        
        # Información de estado (común para ambas pestañas)
        Label(self.root, textvariable=self.status_var, 
              font=("Arial", 10), fg="blue").pack(pady=10)
        
        # Mostrar el marco de descarga por defecto
        self.show_frame(self.download_frame)
    
    def show_frame(self, frame):
        # Ocultar todos los frames
        for widget in self.container.winfo_children():
            widget.pack_forget()
        
        # Mostrar el frame seleccionado
        frame.pack(fill="both", expand=True)
        
        # Actualizar apariencia de botones
        if frame == self.download_frame:
            self.download_button.config(relief=tk.SUNKEN, bg="#e0e0e0")
            self.extract_button.config(relief=tk.RAISED, bg="SystemButtonFace")
            self.status_var.set("Esperando URL de video...")
        else:
            self.download_button.config(relief=tk.RAISED, bg="SystemButtonFace")
            self.extract_button.config(relief=tk.SUNKEN, bg="#e0e0e0")
            self.status_var.set("Selecciona un archivo de video...")
    
    def setup_download_frame(self, parent):
        # Campo para la URL
        url_frame = tk.Frame(parent)
        url_frame.pack(pady=10)
        
        Label(url_frame, text="URL del video:").pack(side=tk.LEFT)
        Entry(url_frame, textvariable=self.url_var, width=40).pack(side=tk.LEFT, padx=5)
        
        # Checkbox para extraer audio
        options_frame = tk.Frame(parent)
        options_frame.pack(pady=5)
        
        Checkbutton(options_frame, text="Extraer audio (MP3)", variable=self.extract_audio_var).pack()
        
        # Botón de descarga
        Button(parent, text="Descargar", command=self.download_video,
               bg="#4CAF50", fg="white", font=("Arial", 10, "bold")).pack(pady=10)
    
    def setup_extract_frame(self, parent):
        # Campo para seleccionar un archivo existente
        file_frame = tk.Frame(parent)
        file_frame.pack(pady=10, fill="x")
        
        Entry(file_frame, textvariable=self.video_file_var, width=40).pack(side=tk.LEFT, padx=5, fill="x", expand=True)
        Button(file_frame, text="Examinar...", command=self.browse_video).pack(side=tk.LEFT)
        
        # Botón para extraer audio
        Button(parent, text="Extraer Audio", command=self.extract_audio,
               bg="#2196F3", fg="white", font=("Arial", 10, "bold")).pack(pady=10)
    
    def browse_video(self):
        filetypes = (
            ('Archivos de video', '*.mp4 *.webm *.avi *.mov *.mkv'),
            ('Todos los archivos', '*.*')
        )
        
        file_path = filedialog.askopenfilename(
            title='Seleccionar video',
            filetypes=filetypes,
            initialdir=os.path.join(os.path.expanduser("~"), "Downloads")
        )
        
        if file_path:
            self.video_file_var.set(file_path)
    
    def download_video(self):
        url = self.url_var.get().strip()
        extract_audio = self.extract_audio_var.get()
        
        if not url:
            messagebox.showerror("Error", "Por favor ingresa una URL válida")
            return
        
        self.status_var.set("Descargando... Por favor espera")
        self.root.update()
        
        try:
            # Verificar si se necesita FFmpeg y si está disponible
            if extract_audio and not check_ffmpeg_installed():
                messagebox.showerror(
                    "Error", 
                    "FFmpeg no está instalado. No se podrá extraer el audio.\n"
                    "Por favor, descarga e instala FFmpeg desde:\n"
                    "https://ffmpeg.org/download.html"
                )
                self.status_var.set("Error: FFmpeg no encontrado")
                return
                
            # Llamada a la función de descarga del main.py
            result = download_youtube_video(url, extract_audio=extract_audio, download_folder=None)
            
            if result:
                download_folder = result.get("download_folder", "")
                video_file = result.get("video_file", "")
                audio_file = result.get("audio_file", "")
                
                # Construir mensaje de éxito
                success_msg = "¡Descarga completada!\n\n"
                success_msg += f"Carpeta: {download_folder}\n"
                if video_file:
                    success_msg += f"Video: {os.path.basename(video_file)}\n"
                if audio_file:
                    success_msg += f"Audio: {os.path.basename(audio_file)}\n"
                
                self.status_var.set(success_msg)
                messagebox.showinfo("Éxito", "¡Descarga completada con éxito!")
            else:
                self.status_var.set("Error en la descarga. Verifica la URL e intenta nuevamente.")
        except Exception as e:
            self.status_var.set(f"Error: {str(e)}")
            messagebox.showerror("Error", f"Ocurrió un error: {str(e)}")
    
    def extract_audio(self):
        video_path = self.video_file_var.get().strip()
        
        if not video_path:
            messagebox.showerror("Error", "Por favor selecciona un archivo de video")
            return
            
        if not os.path.exists(video_path):
            messagebox.showerror("Error", f"El archivo no existe: {video_path}")
            return
        
        # Verificar si FFmpeg está instalado
        if not check_ffmpeg_installed():
            messagebox.showerror(
                "Error", 
                "FFmpeg no está instalado. No se podrá extraer el audio.\n"
                "Por favor, descarga e instala FFmpeg desde:\n"
                "https://ffmpeg.org/download.html"
            )
            self.status_var.set("Error: FFmpeg no encontrado")
            return
        
        self.status_var.set("Extrayendo audio... Por favor espera")
        self.root.update()
        
        try:
            # Llamada a la función para extraer audio
            audio_file = extract_audio_only(video_path)
            
            if audio_file:
                self.status_var.set(f"¡Audio extraído con éxito!\n{audio_file}")
                messagebox.showinfo("Éxito", "¡Audio extraído con éxito!")
            else:
                self.status_var.set("Error al extraer audio.")
        except Exception as e:
            self.status_var.set(f"Error: {str(e)}")
            messagebox.showerror("Error", f"Ocurrió un error: {str(e)}")

if __name__ == "__main__":
    root = tk.Tk()
    app = YoutubeDownloaderApp(root)
    root.mainloop()