from flask import Flask
from database import conectar
from routes.reservas import reservas_bp
from flask import render_template

app = Flask(__name__)

# registrar blueprint
app.register_blueprint(reservas_bp)

@app.route("/formulario")
def formulario():
    return render_template("reservas.html")

@app.route("/")
def inicio():
    return "API de Reservas funcionando correctamente"

if __name__ == "__main__":
    app.run(debug=True)

