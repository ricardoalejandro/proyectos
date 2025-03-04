import os
from docx import Document


def read_word_file(file_path):
    """Lee el contenido de un archivo Word y lo imprime."""
    if not os.path.exists(file_path):
        print(f"El archivo {file_path} no existe.")
        return

    try:
        doc = Document(file_path)
        for para in doc.paragraphs:
            print(para.text)
    except Exception as e:
        print(f"Error al leer el archivo {file_path}: {e}")


def main():
    base_folder = r"c:/Users/rrojacam/Desktop/proyectos/002.DOC.WORD"
    file_name = "OASIS_AF_Fiscal Integration Mauritius_v01r01_ES.docx"  # Cambia esto al nombre de tu archivo
    file_path = os.path.join(base_folder, file_name)
    read_word_file(file_path)


if __name__ == "__main__":
    main()
