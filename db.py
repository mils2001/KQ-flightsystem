# db.py

import mysql.connector
from flask import g

def get_db_connection():
    if 'db' not in g:
        g.db = mysql.connector.connect(
            host="localhost",
            user="Awilo9701",
            password="Awilo9701@",
            database="kenya_airways"
        )
    return g.db

def close_db(e=None):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def create_tables():
    db = get_db_connection()
    cursor = db.cursor()

    cursor.execute("""CREATE TABLE IF NOT EXISTS users (...);""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS flights (...);""")
    cursor.execute("""CREATE TABLE IF NOT EXISTS bookings (...);""")
    
    db.commit()
    cursor.close()

