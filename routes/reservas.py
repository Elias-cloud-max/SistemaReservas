from flask import Blueprint, request
from database import conectar

reservas_bp = Blueprint('reservas', __name__)

# =========================
# CREATE
# =========================
@reservas_bp.route('/reservas', methods=['POST'])
def crear_reserva():

    try:
        data = request.json
        conexion = conectar()
        cursor = conexion.cursor()

        sql = """
        INSERT INTO reservas (id_cliente, id_mesa, fecha_reserva, hora_reserva, cantidad_personas)
        VALUES (%s, %s, %s, %s, %s)
        """

        valores = (
            data['id_cliente'],
            data['id_mesa'],
            data['fecha_reserva'],
            data['hora_reserva'],
            data['cantidad_personas']
        )

        cursor.execute(sql, valores)
        conexion.commit()
        conexion.close()

        return {"mensaje": "Reserva creada correctamente"}

    except Exception as e:
        return {"error": str(e)}


# =========================
# READ
# =========================
@reservas_bp.route('/reservas', methods=['GET'])
def obtener_reservas():

    try:
        conexion = conectar()
        cursor = conexion.cursor(dictionary=True)

        cursor.execute("""
            SELECT r.id_reserva, c.nombre AS cliente, m.numero_mesa,
                   r.fecha_reserva, r.hora_reserva, r.cantidad_personas, r.estado
            FROM reservas r
            JOIN clientes c ON r.id_cliente = c.id_cliente
            JOIN mesas m ON r.id_mesa = m.id_mesa
        """)

        reservas = cursor.fetchall()

        for reserva in reservas:
            for key, value in reserva.items():
                reserva[key] = str(value)

        conexion.close()

        return {"reservas": reservas}

    except Exception as e:
        return {"error": str(e)}


# =========================
# UPDATE
# =========================
@reservas_bp.route('/reservas/<int:id>', methods=['PUT'])
def actualizar_reserva(id):

    try:
        data = request.json
        conexion = conectar()
        cursor = conexion.cursor()

        sql = """
        UPDATE reservas
        SET id_cliente=%s,
            id_mesa=%s,
            fecha_reserva=%s,
            hora_reserva=%s,
            cantidad_personas=%s,
            estado=%s
        WHERE id_reserva=%s
        """

        valores = (
            data['id_cliente'],
            data['id_mesa'],
            data['fecha_reserva'],
            data['hora_reserva'],
            data['cantidad_personas'],
            data['estado'],
            id
        )

        cursor.execute(sql, valores)
        conexion.commit()
        conexion.close()

        return {"mensaje": "Reserva actualizada correctamente"}

    except Exception as e:
        return {"error": str(e)}


# =========================
# DELETE
# =========================
@reservas_bp.route('/reservas/<int:id>', methods=['DELETE'])
def eliminar_reserva(id):

    try:
        conexion = conectar()
        cursor = conexion.cursor()

        cursor.execute("DELETE FROM reservas WHERE id_reserva=%s", (id,))
        conexion.commit()
        conexion.close()

        return {"mensaje": "Reserva eliminada correctamente"}

    except Exception as e:
        return {"error": str(e)}