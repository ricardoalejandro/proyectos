import os
import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext
from tkinter import ttk  # Importar ttk explícitamente
import pdfplumber
from googletrans import Translator
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from threading import Thread

class TraductorPDFApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Traductor de PDF")
        self.root.geometry("600x400")

        self.label = tk.Label(root, text="Seleccione un archivo PDF para traducir:")
        self.label.pack(pady=10)

        self.select_button = tk.Button(root, text="Seleccionar archivo", command=self.seleccionar_archivo)
        self.select_button.pack(pady=10)

        self.progress = tk.DoubleVar()
        self.progress_bar = ttk.Progressbar(root, variable=self.progress, maximum=100)  # Usar ttk.Progressbar
        self.progress_bar.pack(fill=tk.X, padx=20, pady=10)

        self.text_area = scrolledtext.ScrolledText(root, wrap=tk.WORD, height=10)
        self.text_area.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)

    def seleccionar_archivo(self):
        file_path = filedialog.askopenfilename(filetypes=[("PDF files", "*.pdf")])
        if file_path:
            self.traducir_pdf(file_path)

    def traducir_pdf(self, file_path):
        def run_translation():
            try:
                self.text_area.insert(tk.END, "Extrayendo texto del PDF...\n")
                texts = []
                # Usamos pdfplumber para una mejor extracción del texto
                with pdfplumber.open(file_path) as pdf:
                    total_pages = len(pdf.pages)
                    for page in pdf.pages:
                        page_text = page.extract_text() or ""
                        texts.append(page_text)
                self.text_area.insert(tk.END, f"Extraídos {total_pages} páginas.\n")
                self.progress.set(0)

                translator = Translator()
                translations = [None] * total_pages

                def translate_page(i, text):
                    # Traduce del inglés al español
                    translated = translator.translate(text, src='en', dest='es').text
                    return i, translated

                self.text_area.insert(tk.END, "Traduciendo páginas...\n")
                with ThreadPoolExecutor(max_workers=4) as executor:
                    # Enviar tareas para traducir cada página en paralelo
                    futures = [executor.submit(translate_page, i, texts[i]) for i in range(total_pages)]
                    for count, future in enumerate(futures, start=1):
                        i, result = future.result()
                        translations[i] = result
                        self.progress.set((count / total_pages) * 100)
                        self.text_area.insert(tk.END, f"Página {i + 1} traducida.\n")
                        self.root.update_idletasks()

                # Crear nuevo PDF con el contenido traducido
                downloads_path = os.path.join(os.path.expanduser("~"), "Downloads")
                file_name = os.path.basename(file_path)
                timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
                output_file_path = os.path.join(downloads_path, f"{os.path.splitext(file_name)[0]}_{timestamp}.pdf")
                
                c = canvas.Canvas(output_file_path, pagesize=letter)
                width, height = letter
                margin = 40
                for translated_text in translations:
                    text_object = c.beginText(margin, height - margin)
                    # Separa el texto en líneas respetando saltos de línea
                    for line in translated_text.splitlines():
                        text_object.textLine(line)
                    c.drawText(text_object)
                    c.showPage()
                c.save()

                self.text_area.insert(tk.END, f"El archivo se ha traducido y guardado en: {output_file_path}\n")
                messagebox.showinfo("Éxito", f"PDF traducido y guardado en:\n{output_file_path}")

                # Preguntar si se desea borrar el historial del área de texto
                if messagebox.askyesno("Limpiar historial", "¿Deseas borrar el historial de la traducción?"):
                    self.text_area.delete("1.0", tk.END)
            except Exception as e:
                messagebox.showerror("Error", f"Se produjo un error: {str(e)}")

        # Ejecutar la traducción en un hilo separado para no bloquear la interfaz
        Thread(target=run_translation).start()

if __name__ == "__main__":
    root = tk.Tk()
    app = TraductorPDFApp(root)
    root.mainloop()