from sql_executor import SQLExecutor
import sys
import os
import time
import argparse

# Parámetros de conexión predeterminados (puedes modificar estos valores)
DEFAULT_SERVER = "tcp:totsql01ttotal.database.windows.net,1433"  # Cambia esto a tu servidor SQL Server
DEFAULT_DATABASE = "PROD_TOTALOASIS_TESTING_REPLICA"   # Cambia esto a tu base de datos predeterminada
DEFAULT_USERNAME = "totalsqladmin"       # Cambia esto a tu nombre de usuario
DEFAULT_PASSWORD = "t0t4lAdm1nSQL" # Cambia esto a tu contraseña

def ejecutar_consulta(query, server, database, username, password, verbose=True):
    """
    Ejecuta una consulta SQL y muestra los resultados
    
    Args:
        query (str): Consulta SQL a ejecutar
        server (str): Dirección del servidor SQL Server
        database (str): Nombre de la base de datos
        username (str): Nombre de usuario
        password (str): Contraseña
        verbose (bool): Si es True, muestra mensajes detallados
    """
    if verbose:
        print(f"\n{'='*60}")
        print(f"Conectando a {server}, base de datos {database}...")
        print(f"{'='*60}")
    
    executor = SQLExecutor(
        db_type='mssql',
        server=server,
        database=database,
        username=username,
        password=password
    )
    
    if executor.connect():
        if verbose:
            print(f"\n✅ Conexión establecida")
            print(f"\nEjecutando consulta...")
            if len(query) < 500:  # Solo mostrar la consulta completa si no es muy larga
                print(f"\n{query}\n")
        
        # Indicador de actividad para consultas largas
        if verbose:
            print("Ejecutando", end="", flush=True)
        start_time = time.time()
        
        try:
            result = executor.execute_query(query)
            execution_time = time.time() - start_time
            
            if verbose:
                print(f"\r✅ Consulta ejecutada en {execution_time:.2f} segundos")
            
            if result:
                if verbose:
                    print(f"\n📊 RESULTADOS ({len(result)} filas):")
                    print("-" * 60)
                
                row_count = 0
                for row in result:
                    print(row)
                    row_count += 1
                    # Para consultas con muchos resultados, mostrar un progreso
                    if row_count == 100 and verbose:
                        remaining = len(result) - 100
                        if remaining > 0:
                            show_more = input(f"\n⚠️ Mostrando 100 de {len(result)} resultados. ¿Mostrar más? (s/n): ")
                            if show_more.lower() != 's':
                                print(f"Se omitieron {remaining} filas adicionales.")
                                break
                
                if verbose:
                    print("-" * 60)
                    print(f"Total de filas: {len(result)}")
            else:
                if verbose:
                    print("\n⚠️ La consulta se ejecutó correctamente pero no devolvió resultados")
        except Exception as e:
            print(f"\n❌ Error al ejecutar la consulta: {str(e)}")
    else:
        print("\n❌ No se pudo conectar a la base de datos. Verifique sus credenciales.")
    
    executor.close()

def main():
    parser = argparse.ArgumentParser(description='Ejecutar consulta SQL en SQL Server')
    parser.add_argument('--query', '-q', help='Consulta SQL a ejecutar')
    parser.add_argument('--file', '-f', help='Archivo SQL a ejecutar')
    parser.add_argument('--server', '-s', help=f'Servidor SQL (predeterminado: {DEFAULT_SERVER})', default=DEFAULT_SERVER)
    parser.add_argument('--database', '-d', help=f'Base de datos (predeterminado: {DEFAULT_DATABASE})', default=DEFAULT_DATABASE)
    parser.add_argument('--user', '-u', help=f'Usuario (predeterminado: {DEFAULT_USERNAME})', default=DEFAULT_USERNAME)
    parser.add_argument('--password', '-p', help=f'Contraseña (predeterminado: {DEFAULT_PASSWORD})', default=DEFAULT_PASSWORD)
    parser.add_argument('--silent', help='Modo silencioso, solo muestra resultados', action='store_true')
    
    args = parser.parse_args()
    
    # Verificar que se proporcionó una consulta o archivo
    if not args.query and not args.file:
        query = input("\n📝 Ingrese su consulta SQL (termine con punto y coma en una línea nueva):\n")
        lines = [query]
        while not query.endswith(';'):
            more = input()
            if more == ';':
                break
            lines.append(more)
            query = '\n'.join(lines)
    elif args.file:
        try:
            with open(args.file, 'r') as f:
                query = f.read()
                if not args.silent:
                    print(f"📄 Leyendo consulta desde archivo: {args.file}")
        except Exception as e:
            print(f"❌ Error al leer el archivo: {str(e)}")
            return
    else:
        query = args.query
    
    # Ejecutar la consulta
    ejecutar_consulta(
        query, 
        args.server, 
        args.database, 
        args.user, 
        args.password,
        not args.silent
    )

if __name__ == "__main__":
    main()