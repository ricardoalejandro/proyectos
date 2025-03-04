import os
import json
import logging

class Config:
    def __init__(self):
        self.project_root = os.path.dirname(os.path.dirname(__file__))
        self.config_data = self._load_config()
        self._setup_paths()

    def _load_config(self):
        """Carga la configuración desde el archivo JSON"""
        config_path = os.path.join(self.project_root, 'config.json')
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config_data = json.load(f)
                # Establecer la ruta base del proyecto
                config_data['paths']['project_root'] = self.project_root
                return config_data
        except Exception as e:
            raise Exception(f"Error al cargar la configuración: {e}")

    def _setup_paths(self):
        """Configura las rutas absolutas basadas en el directorio base"""
        # Convertir rutas relativas a absolutas
        for key, path in self.config_data['paths'].items():
            if key != 'project_root':  # No procesar project_root
                self.config_data['paths'][key] = os.path.join(self.project_root, path)

    def __getattr__(self, name):
        """Permite acceder a la configuración como atributos"""
        if name in self.config_data:
            return self.config_data[name]
        
        for section in self.config_data.values():
            if isinstance(section, dict) and name in section:
                return section[name]
        raise AttributeError(f"'{type(self).__name__}' no tiene el atributo '{name}'")

# Crear una instancia global de la configuración
config = Config()