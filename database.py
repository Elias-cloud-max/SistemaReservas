# ==========================================
# Conexión a la Base de Datos
# ==========================================

import mysql.connector
from config import Config


def conectar():

    conexion = mysql.connector.connect(
        host=Config.HOST,
        user=Config.USER,
        password=Config.PASSWORD,
        database=Config.DATABASE,
        port=Config.PORT
    )

    return conexion