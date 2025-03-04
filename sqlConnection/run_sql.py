from sql_executor import SQLExecutor

def run_sql(query, db_type, server=None, database=None, username=None, password=None, port=None):
    """
    Run a SQL query and display results
    
    Args:
        query (str): SQL query to execute
        db_type (str): Type of database (mysql, mssql, postgres, sqlite)
        server (str): Server address (not needed for sqlite)
        database (str): Database name or file path for sqlite
        username (str): Username (not needed for sqlite)
        password (str): Password (not needed for sqlite)
        port (int): Connection port (optional)
    """
    executor = SQLExecutor(
        db_type=db_type,
        server=server,
        database=database,
        username=username,
        password=password,
        port=port
    )
    
    if executor.connect():
        result = executor.execute_query(query)
        
        if result:
            print("\nResults:")
            print("=" * 80)
            for row in result:
                print(row)
            print("=" * 80)
            print(f"Total rows: {len(result)}")
        else:
            print("Query executed successfully but returned no results.")
    
    executor.close()

if __name__ == "__main__":
    print("SQL Query Executor")
    print("=" * 50)
    
    # Get database type
    print("Select database type:")
    print("1. MySQL")
    print("2. Microsoft SQL Server")
    print("3. PostgreSQL")
    print("4. SQLite")
    choice = input("Enter choice (1-4): ")
    
    db_types = {
        "1": "mysql",
        "2": "mssql",
        "3": "postgres",
        "4": "sqlite"
    }
    
    db_type = db_types.get(choice)
    if not db_type:
        print("Invalid choice. Exiting.")
        exit(1)
    
    # Get connection details
    if db_type == "sqlite":
        database = input("Enter SQLite database file path: ")
        server = None
        username = None
        password = None
    else:
        server = input(f"Enter {db_type} server address: ")
        database = input("Enter database name: ")
        username = input("Enter username: ")
        password = input("Enter password: ")
    
    # Get SQL query
    print("\nEnter your SQL query (end with semicolon on a new line):")
    lines = []
    while True:
        line = input()
        if line == ";":
            break
        lines.append(line)
    
    query = "\n".join(lines)
    
    # Execute the query
    run_sql(query, db_type, server, database, username, password)