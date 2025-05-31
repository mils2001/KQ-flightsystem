def get_connection():
    import mysql.connector
    return mysql.connector.connect(
        host="localhost",
        user="Awilo9701",
        password="Awilo9701@",
        database="kenya_airways"
    )

