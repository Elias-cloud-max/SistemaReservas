// ======================================
// VARIABLES GLOBALES
// ======================================

const formulario = document.getElementById("formReserva");
const mensaje = document.getElementById("mensaje");
const botonGuardar = document.getElementById("btnGuardar");
const buscador = document.getElementById("buscarReserva");

// Al cargar la página
window.onload = () => {

    cargarReservas();

};


// ======================================
// GUARDAR / ACTUALIZAR
// ======================================

formulario.addEventListener("submit", async function (e) {

    e.preventDefault();

    const idReserva = document.getElementById("id_reserva").value;

    const data = {

        id_cliente: document.getElementById("id_cliente").value,

        id_mesa: document.getElementById("id_mesa").value,

        fecha_reserva: document.getElementById("fecha_reserva").value,

        hora_reserva: document.getElementById("hora_reserva").value,

        cantidad_personas: document.getElementById("cantidad_personas").value,

        estado: "Activa"

    };

    let response;

    // -------------------------
    // ACTUALIZAR
    // -------------------------

    if (idReserva != "") {

        response = await fetch(`/reservas/${idReserva}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

    }

    // -------------------------
    // CREAR
    // -------------------------

    else {

        response = await fetch("/reservas", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(data)

        });

    }

    const resultado = await response.json();

    mostrarMensaje(resultado.mensaje || resultado.error);

    limpiarFormulario();

    cargarReservas();

});


// ======================================
// CARGAR RESERVAS
// ======================================

async function cargarReservas() {

    const response = await fetch("/reservas");

    const datos = await response.json();

    const tabla = document.querySelector("#tablaReservas tbody");

    tabla.innerHTML = "";

    actualizarEstadisticas(datos.reservas);

    datos.reservas.forEach(reserva => {

        tabla.innerHTML += `

        <tr>

            <td>${reserva.id_reserva}</td>

            <td>${reserva.cliente}</td>

            <td>${reserva.numero_mesa}</td>

            <td>${reserva.fecha_reserva}</td>

            <td>${reserva.hora_reserva}</td>

            <td>${reserva.cantidad_personas}</td>

            <td>

                <span class="estado ${reserva.estado.toLowerCase()}">

                    ${reserva.estado}

                </span>

            </td>

            <td>

                <button class="btnEditar"

                    onclick="editarReserva(${reserva.id_reserva})">

                    ✏️ Editar

                </button>

                <button class="btnEliminar"

                    onclick="eliminarReserva(${reserva.id_reserva})">

                    🗑 Eliminar

                </button>

            </td>

        </tr>

        `;

    });

}


// ======================================
// ESTADÍSTICAS
// ======================================

function actualizarEstadisticas(reservas) {

    document.getElementById("totalReservas").innerHTML = reservas.length;

    document.getElementById("reservasActivas").innerHTML =

        reservas.filter(r => r.estado == "Activa").length;

    document.getElementById("reservasCanceladas").innerHTML =

        reservas.filter(r => r.estado == "Cancelada").length;

}


// ======================================
// BUSCADOR
// ======================================

buscador.addEventListener("keyup", function () {

    const texto = this.value.toLowerCase();

    const filas = document.querySelectorAll("#tablaReservas tbody tr");

    filas.forEach(fila => {

        const cliente = fila.children[1].textContent.toLowerCase();

        fila.style.display = cliente.includes(texto)

            ? ""

            : "none";

    });

});

// ======================================
// EDITAR RESERVA
// ======================================

async function editarReserva(id){

    const response = await fetch(`/reservas/${id}`);

    const reserva = await response.json();

    document.getElementById("id_reserva").value = reserva.id_reserva;

    document.getElementById("id_cliente").value = reserva.id_cliente;

    document.getElementById("id_mesa").value = reserva.id_mesa;

    document.getElementById("fecha_reserva").value = reserva.fecha_reserva;

    document.getElementById("hora_reserva").value = reserva.hora_reserva;

    document.getElementById("cantidad_personas").value = reserva.cantidad_personas;

    botonGuardar.innerHTML = "Actualizar Reserva";

    document.getElementById("btnCancelar").style.display = "inline-block";

    mostrarMensaje("Modo edición activado.", "info");

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}



// ======================================
// ELIMINAR RESERVA
// ======================================

async function eliminarReserva(id){

    const confirmar = confirm("¿Deseas eliminar esta reserva?");

    if(!confirmar){

        return;

    }

    const response = await fetch(`/reservas/${id}`,{

        method:"DELETE"

    });

    const resultado = await response.json();

    mostrarMensaje(resultado.mensaje || resultado.error);

    cargarReservas();

}



// ======================================
// CANCELAR EDICIÓN
// ======================================

document.getElementById("btnCancelar").addEventListener("click",function(){

    limpiarFormulario();

    mostrarMensaje("Edición cancelada.","info");

});



// ======================================
// LIMPIAR FORMULARIO
// ======================================

function limpiarFormulario(){

    formulario.reset();

    document.getElementById("id_reserva").value="";

    botonGuardar.innerHTML="Guardar Reserva";

    document.getElementById("btnCancelar").style.display="none";

}



// ======================================
// MENSAJES
// ======================================

function mostrarMensaje(texto,tipo="success"){

    mensaje.innerHTML=texto;

    mensaje.className="";

    mensaje.classList.add(tipo);

    setTimeout(()=>{

        mensaje.innerHTML="";

        mensaje.className="";

    },3000);

}