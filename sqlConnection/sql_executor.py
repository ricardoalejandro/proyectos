import os
import sys
import warnings
import time
from datetime import datetime

# Importaciones opcionales con manejo de errores
try:
    import pymysql
except ImportError:
    pymysql = None

try:
    import pyodbc
except ImportError:
    pyodbc = None

try:
    import psycopg2
except ImportError:
    psycopg2 = None

try:
    import sqlite3
except ImportError:
    sqlite3 = None

try:
    import pandas as pd
except ImportError:
    pd = None


class SQLExecutor:
    def __init__(self, db_type=None, server=None, database=None, username=None, password=None, port=None):
        """
        Initialize SQL connection manager
        :param db_type: Type of database (mysql, mssql, postgres, sqlite)
        :param server: Server address
        :param database: Database name
        :param username: Username for connection
        :param password: Password for connection
        :param port: Port number (optional)
        """
        self.db_type = db_type
        self.server = server
        self.database = database
        self.username = username
        self.password = password
        self.port = port
        self.connection = None
        self.cursor = None
    
    def connect(self):
        """Establish connection to the database"""
        try:
            print("Intentando conectar...", end="", flush=True)
            start_time = time.time()
            
            if self.db_type == 'mysql':
                if pymysql is None:
                    raise ImportError("'pymysql' module is not installed. Run 'pip install pymysql' to install it.")
                self.connection = pymysql.connect(
                    host=self.server,
                    user=self.username,
                    password=self.password,
                    database=self.database,
                    port=self.port or 3306
                )
            elif self.db_type == 'mssql':
                if pyodbc is None:
                    raise ImportError("'pyodbc' module is not installed. Run 'pip install pyodbc' to install it.")
                
                # Lista de posibles drivers ODBC para SQL Server
                drivers = [
                    '{ODBC Driver 18 for SQL Server}',
                    '{ODBC Driver 17 for SQL Server}',
                    '{ODBC Driver 13 for SQL Server}',
                    '{ODBC Driver 11 for SQL Server}',
                    '{SQL Server Native Client 11.0}',
                    '{SQL Server}'
                ]
                
                # Intentar encontrar un driver disponible
                available_drivers = [driver for driver in pyodbc.drivers() if driver.startswith('{') and 'SQL' in driver]
                if available_drivers:
                    print(f"\nDrivers SQL Server disponibles: {', '.join(available_drivers)}")
                    # Usar el primero de nuestra lista preferida que esté disponible
                    selected_driver = None
                    for driver in drivers:
                        if driver in available_drivers:
                            selected_driver = driver
                            break
                    
                    # Si ninguno de nuestros drivers preferidos está disponible, usar el primero disponible
                    if not selected_driver and available_drivers:
                        selected_driver = available_drivers[0]
                        
                    if not selected_driver:
                        raise Exception("No se encontró ningún driver ODBC para SQL Server")
                else:
                    # Si no hay drivers disponibles, intentar con el predeterminado
                    print("\nNo se encontraron drivers ODBC para SQL Server. Intentando con el predeterminado...")
                    selected_driver = '{ODBC Driver 17 for SQL Server}'
                
                # Intentar la conexión con el driver seleccionado    
                print(f"Usando driver: {selected_driver}")
                
                # Construir la cadena de conexión
                # Primero intentar con el formato de autenticación SQL Server
                conn_str = (
                    f"DRIVER={selected_driver};"
                    f"SERVER={self.server};"
                    f"DATABASE={self.database};"
                    f"UID={self.username};"
                    f"PWD={self.password};"
                )
                
                try:
                    self.connection = pyodbc.connect(conn_str, timeout=30)
                except pyodbc.Error as e:
                    # Si falla, intentar con el formato de autenticación de Azure
                    if 'tcp:' in self.server.lower() or 'azure' in self.server.lower():
                        print("Intentando formato de conexión Azure SQL...")
                        conn_str = (
                            f"DRIVER={selected_driver};"
                            f"SERVER={self.server};"
                            f"DATABASE={self.database};"
                            f"UID={self.username}@{self.server.split('.')[0].split(':')[-1]};"
                            f"PWD={self.password};"
                            f"Encrypt=yes;TrustServerCertificate=no;"
                        )
                        self.connection = pyodbc.connect(conn_str, timeout=30)
                    else:
                        # Si ninguno funciona, reintentamos con autenticación de Windows
                        print("Intentando autenticación de Windows...")
                        conn_str = (
                            f"DRIVER={selected_driver};"
                            f"SERVER={self.server};"
                            f"DATABASE={self.database};"
                            f"Trusted_Connection=yes;"
                        )
                        self.connection = pyodbc.connect(conn_str, timeout=30)
                
            elif self.db_type == 'postgres':
                if psycopg2 is None:
                    raise ImportError("'psycopg2' module is not installed. Run 'pip install psycopg2' to install it.")
                self.connection = psycopg2.connect(
                    host=self.server,
                    database=self.database,
                    user=self.username,
                    password=self.password,
                    port=self.port or 5432
                )
            elif self.db_type == 'sqlite':
                if sqlite3 is None:
                    raise ImportError("'sqlite3' module is not available in your Python installation.")
                self.connection = sqlite3.connect(self.database)
            else:
                raise ValueError("Unsupported database type. Choose from 'mysql', 'mssql', 'postgres', or 'sqlite'")
            
            self.cursor = self.connection.cursor()
            conn_time = time.time() - start_time
            print(f"\r✅ Conectado a {self.db_type} ({conn_time:.2f}s)")
            return True
        except ImportError as ie:
            print(f"\r❌ Error: {str(ie)}")
            return False
        except Exception as e:
            print(f"\r❌ Error de conexión: {str(e)}")
            return False
    
    def execute_query(self, query, params=None, fetch=True):
        """
        Execute a SQL query
        :param query: SQL query string
        :param params: Parameters for the query (optional)
        :param fetch: Whether to fetch results (default: True)
        :return: Query results if fetch=True, otherwise None
        """
        try:
            if not self.connection or not self.cursor:
                if not self.connect():
                    return None
            
            # Mostrar progreso para consultas largas
            start_time = time.time()
            progress_chars = ['|', '/', '-', '\\']
            progress_idx = 0
            
            def show_progress():
                nonlocal progress_idx
                elapsed = time.time() - start_time
                sys.stdout.write(f"\rEjecutando {progress_chars[progress_idx]} ({elapsed:.1f}s)")
                sys.stdout.flush()
                progress_idx = (progress_idx + 1) % len(progress_chars)
            
            # Iniciar progreso
            show_progress()
            
            # Configurar un temporizador para mostrar progreso
            progress_thread = None
            try:
                import threading
                def progress_updater():
                    while True:
                        time.sleep(0.5)
                        show_progress()
                
                progress_thread = threading.Thread(target=progress_updater)
                progress_thread.daemon = True
                progress_thread.start()
            except ImportError:
                # Si no se puede usar threading, mostrar al menos el inicio
                pass
            
            # Ejecutar la consulta
            if params:
                self.cursor.execute(query, params)
            else:
                self.cursor.execute(query)
            
            # Detener el hilo de progreso si existe
            if progress_thread:
                # No hay una forma limpia de detenerlo, pero al ser daemon se cerrará solo
                pass
            
            # Mostrar tiempo de ejecución
            elapsed = time.time() - start_time
            sys.stdout.write(f"\rConsulta ejecutada en {elapsed:.2f}s {'✅' if elapsed < 10 else '⚠️'}      \n")
            sys.stdout.flush()
            
            if fetch:
                result = self.cursor.fetchall()
                return result
            else:
                self.connection.commit()
                return self.cursor.rowcount
        except Exception as e:
            elapsed = time.time() - start_time
            sys.stdout.write(f"\rError después de {elapsed:.2f}s ❌                 \n")
            sys.stdout.flush()
            print(f"Error ejecutando consulta: {str(e)}")
            return None
    
    def execute_from_file(self, file_path, fetch=True):
        """
        Execute SQL from a file
        :param file_path: Path to SQL file
        :param fetch: Whether to fetch results (default: True)
        :return: Query results if fetch=True, otherwise None
        """
        try:
            print(f"Leyendo archivo SQL: {file_path}")
            with open(file_path, 'r') as f:
                sql = f.read()
            print(f"Archivo leído: {len(sql)} caracteres")
            return self.execute_query(sql, fetch=fetch)
        except Exception as e:
            print(f"Error leyendo/ejecutando SQL desde archivo: {str(e)}")
            return None
    
    def query_to_dataframe(self, query, params=None):
        """
        Execute a query and return results as a pandas DataFrame
        :param query: SQL query string
        :param params: Parameters for the query (optional)
        :return: pandas DataFrame with query results
        """
        try:
            if pd is None:
                raise ImportError("'pandas' module is not installed. Run 'pip install pandas' to install it.")
                
            if not self.connection:
                if not self.connect():
                    return None
            
            print("Ejecutando consulta a DataFrame...", end="", flush=True)
            start_time = time.time()
            df = pd.read_sql(query, self.connection, params=params)
            elapsed = time.time() - start_time
            print(f"\rDataFrame creado con {len(df)} filas en {elapsed:.2f}s")
            return df
        except ImportError as ie:
            print(f"Error: {str(ie)}")
            return None
        except Exception as e:
            print(f"Error ejecutando consulta a DataFrame: {str(e)}")
            return None
    
    def close(self):
        """Close database connection"""
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
            print("Conexión a la base de datos cerrada.")

def check_requirements():
    """Check if required modules are installed"""
    missing_modules = []
    
    if pymysql is None:
        missing_modules.append("pymysql")
    if pyodbc is None:
        missing_modules.append("pyodbc")
    if psycopg2 is None:
        missing_modules.append("psycopg2")
    if pd is None:
        missing_modules.append("pandas")
    
    if missing_modules:
        print("Advertencia: Los siguientes módulos requeridos no están instalados:")
        for module in missing_modules:
            print(f"  - {module}")
        print("\nPuede instalarlos usando pip:")
        print(f"  pip install {' '.join(missing_modules)}")
        print("\nSolo se requiere instalar los módulos para la base de datos que está usando:")
        print("  - Para MySQL: pymysql")
        print("  - Para SQL Server: pyodbc")
        print("  - Para PostgreSQL: psycopg2")
        print("  - Para análisis de datos: pandas")
        
        # Intentar instalar automáticamente los módulos faltantes
        try_install = input("\n¿Desea intentar instalar los módulos faltantes ahora? (s/n): ").lower()
        if try_install == 's':
            import subprocess
            for module in missing_modules:
                print(f"Instalando {module}...")
                subprocess.call([sys.executable, "-m", "pip", "install", module])
            print("Instalación completada. Reinicie el script para usar los módulos instalados.")
        
        return False
    
    return True

def main():
    """Main function to execute when script is run directly"""
    # Check for required modules
    check_requirements()
    
    # Example usage
    if len(sys.argv) < 2:
        print("Uso: python sql_executor.py <archivo_sql_o_consulta> [tipo_db] [servidor] [base_datos] [usuario] [contraseña]")
        sys.exit(1)
    
    # Get the SQL query or file path
    sql_input = sys.argv[1]
    
    # Get connection parameters
    db_type = sys.argv[2] if len(sys.argv) > 2 else input("Tipo de base de datos (mysql/mssql/postgres/sqlite): ")
    
    if db_type.lower() == 'sqlite':
        database = sys.argv[3] if len(sys.argv) > 3 else input("Ruta de archivo de base de datos SQLite: ")
        executor = SQLExecutor(db_type=db_type.lower(), database=database)
    else:
        server = sys.argv[3] if len(sys.argv) > 3 else input("Servidor: ")
        database = sys.argv[4] if len(sys.argv) > 4 else input("Base de datos: ")
        username = sys.argv[5] if len(sys.argv) > 5 else input("Usuario: ")
        password = sys.argv[6] if len(sys.argv) > 6 else input("Contraseña: ")
        
        executor = SQLExecutor(
            db_type=db_type.lower(),
            server=server,
            database=database,
            username=username,
            password=password
        )
    
    # Connect to the database
    if executor.connect():
        # Check if input is a file or a query
        if os.path.isfile(sql_input):
            result = executor.execute_from_file(sql_input)
        else:
            result = executor.execute_query(sql_input)
        
        # Print results
        if result:
            print(f"\nResultados ({len(result)} filas):")
            print("=" * 60)
            for row in result:
                print(row)
            print("=" * 60)
    
    # Close the connection
    executor.close()

if __name__ == "__main__":
    main()