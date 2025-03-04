from sql_executor import SQLExecutor
import sys
import os
import time

def run_mssql_query(query, server, database, username, password, port=None):
    """
    Run a SQL query specifically on SQL Server and display results
    
    Args:
        query (str): SQL query to execute
        server (str): SQL Server address
        database (str): Database name
        username (str): SQL Server username
        password (str): SQL Server password
        port (int, optional): SQL Server port (default is 1433)
    """
    print("\n===================================================")
    print(f"Conectando a SQL Server en {server}...")
    print(f"Base de datos: {database}")
    print("===================================================")
    
    executor = SQLExecutor(
        db_type='mssql',
        server=server,
        database=database,
        username=username,
        password=password,
        port=port
    )
    
    if executor.connect():
        print(f"\n✅ Conexión exitosa a {database}")
        print(f"\nEjecutando consulta...")
        print("---------------------------------------------------")
        print(f"CONSULTA:\n{query}")
        print("---------------------------------------------------")
        
        # Mostrar un indicador de actividad
        print("\nEjecutando", end="", flush=True)
        start_time = time.time()
        
        try:
            result = executor.execute_query(query)
            execution_time = time.time() - start_time
            print(f"\r✅ Consulta ejecutada en {execution_time:.2f} segundos")
            
            if result:
                print(f"\n📊 RESULTADOS ({len(result)} filas):")
                print("=" * 80)
                row_count = 0
                for row in result:
                    print(row)
                    row_count += 1
                    # Para consultas con muchos resultados, mostrar un progreso
                    if row_count == 100:
                        remaining = len(result) - 100
                        if remaining > 0:
                            show_more = input(f"\n⚠️ Mostrando 100 de {len(result)} resultados. ¿Mostrar más? (s/n): ")
                            if show_more.lower() != 's':
                                print(f"Se omitieron {remaining} filas adicionales.")
                                break
                print("=" * 80)
                print(f"Total de filas: {len(result)}")
            else:
                print("\n⚠️ La consulta se ejecutó correctamente pero no devolvió resultados o fue una operación de actualización/inserción/eliminación.")
        except Exception as e:
            print(f"\n❌ Error al ejecutar la consulta: {str(e)}")
    else:
        print("\n❌ No se pudo conectar a la base de datos. Verifique sus credenciales e intente nuevamente.")
    
    executor.close()

def save_query_to_file(query, filename):
    """Save the query to a file for future reference"""
    if not os.path.exists('queries'):
        os.makedirs('queries')
        
    query_path = os.path.join('queries', filename)
    with open(query_path, 'w') as f:
        f.write(query)
    print(f"✅ Consulta guardada en {query_path}")

if __name__ == "__main__":
    print("\n=============================================")
    print("📊 SQL Server Query Executor 📊")
    print("=============================================")
    
    # Get connection details
    print("\n🔌 DATOS DE CONEXIÓN")
    print("---------------------------------------------")
    server = input("Servidor SQL Server: ")
    database = input("Nombre de la base de datos: ")
    username = input("Usuario: ")
    password = input("Contraseña: ")
    
    # Get SQL query
    print("\n📝 INGRESE SU CONSULTA SQL")
    print("---------------------------------------------")
    print("Escriba su consulta y termine con un punto y coma (;) en una línea nueva:")
    lines = []
    line_count = 1
    while True:
        line = input(f"{line_count}: ")
        if line == ";":
            break
        lines.append(line)
        line_count += 1
    
    query = "\n".join(lines)
    
    # Ask if user wants to save the query
    save_option = input("\n💾 ¿Desea guardar esta consulta para uso futuro? (s/n): ").lower()
    if save_option == 's':
        filename = input("Nombre del archivo (ej. mi_consulta.sql): ")
        if not filename.endswith('.sql'):
            filename += '.sql'
        save_query_to_file(query, filename)
    
    # Execute the query
    run_mssql_query(query, server, database, username, password)