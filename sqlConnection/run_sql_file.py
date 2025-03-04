from sql_executor import SQLExecutor
import sys
import os
import argparse

def run_sql_file(file_path, db_type, server=None, database=None, username=None, password=None, port=None):
    """
    Run a SQL query from a file and display results
    
    Args:
        file_path (str): Path to the SQL file
        db_type (str): Type of database (mysql, mssql, postgres, sqlite)
        server (str): Server address (not needed for sqlite)
        database (str): Database name or file path for sqlite
        username (str): Username (not needed for sqlite)
        password (str): Password (not needed for sqlite)
        port (int): Connection port (optional)
    """
    if not os.path.exists(file_path):
        print(f"Error: File {file_path} not found!")
        return

    executor = SQLExecutor(
        db_type=db_type,
        server=server,
        database=database,
        username=username,
        password=password,
        port=port
    )
    
    if executor.connect():
        print(f"Executing SQL from file: {file_path}")
        result = executor.execute_from_file(file_path)
        
        if result:
            print("\nResults:")
            print("=" * 80)
            for row in result:
                print(row)
            print("=" * 80)
            print(f"Total rows: {len(result)}")
        else:
            print("Query executed successfully but returned no results or was an update/insert/delete operation.")
    
    executor.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Execute SQL from a file')
    parser.add_argument('file', help='Path to the SQL file')
    parser.add_argument('--type', '-t', help='Database type (mysql, mssql, postgres, sqlite)', default='mssql')
    parser.add_argument('--server', '-s', help='Server address')
    parser.add_argument('--database', '-d', help='Database name')
    parser.add_argument('--user', '-u', help='Username')
    parser.add_argument('--password', '-p', help='Password')
    parser.add_argument('--port', help='Port number')
    
    args = parser.parse_args()
    
    if args.file:
        if args.type == 'sqlite':
            if not args.database:
                args.database = input("Enter SQLite database file path: ")
            run_sql_file(args.file, args.type, database=args.database)
        else:
            if not args.server:
                args.server = input(f"Enter {args.type} server address: ")
            if not args.database:
                args.database = input("Enter database name: ")
            if not args.user:
                args.user = input("Enter username: ")
            if not args.password:
                args.password = input("Enter password: ")
            
            run_sql_file(
                args.file, 
                args.type, 
                args.server, 
                args.database, 
                args.user, 
                args.password, 
                args.port
            )
    else:
        print("Error: SQL file path is required!")
        parser.print_help()