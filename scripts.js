let form = document.querySelector("form");
let listAppointments = document.querySelector("#listarCita");
let search = document.querySelector("#btnBuscar");
let searching = document.querySelector("#busqueda");
let appointments = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getData();
});

//Traer info del formulario al enviar
const getData = () => {
  let nombre = document.querySelector("#nombre").value;
  let fecha = document.querySelector("#fecha").value;
  let hora = document.querySelector("#hora").value;
  let sintomas = document.querySelector("#sintomas").value;

  let register = {
    id: Math.round(Math.random() * (100 - 1) + 1),
    nombre,
    fecha,
    hora,
    sintomas,
  };

  const key = JSON.parse(localStorage.getItem("appointments"));
  if (key !== null) {
    key.unshift(register);
    localStorage.setItem("appointments", JSON.stringify(key));
    form.reset();
  } else {
    appointments.unshift(register);
    localStorage.setItem("appointments", JSON.stringify(appointments));
  }

  getAppointments();
};

//Listar las citas obtenidas en el LocalStorage
const getAppointments = () => {
  listAppointments.innerHTML = "";
  let appointmentsLocalStorage = JSON.parse(
    localStorage.getItem("appointments")
  );
  appointmentsLocalStorage?.map((appt) => {
    const { id, nombre, fecha, hora, sintomas } = appt;
    listAppointments.innerHTML += `
            <div class="card mt-1 text-center">
                <table class="table text-center">
                    <tr>
                        <td>${id}</td>
                        <td>${nombre}</td>
                        <td>${fecha}</td>
                        <td>${hora}</td>
                        <td>${sintomas}</td>
                        <td>
                            <button class="btn btn-primary" id=${id}>Editar</button>
                            <button class="btn btn-danger" id=${id}>Eliminar</button>
                        </td>
                    </tr>
                </table>
            </div>
        `;
  });
};
document.addEventListener("DOMContentLoaded", getAppointments);

//Eliminar citas
listAppointments.addEventListener("click", (e) => {
  const btnEliminar = e.target.classList.contains("btn-danger");
  const id = e.target.id;
  const local = JSON.parse(localStorage.getItem("appointments"));
  const buscado = local.find((data) => data.id === Number(id));
  if (btnEliminar) {
    local.forEach((data, index) => {
      if (data.id === buscado.id) {
        local.splice(index, 1);
        localStorage.setItem("appointments", JSON.stringify(local));
        getAppointments();
      }
    });
  }
});

//Editar citas
listAppointments.addEventListener("click", (e) => {
  const btnEditar = e.target.classList.contains("btn-primary");
  const id = e.target.id;
  const local = JSON.parse(localStorage.getItem("appointments"));
  const editado = local.find((data) => data.id === Number(id));
  if (btnEditar) {
    local.forEach((data, index) => {
      if (data.id === editado.id) {
        local.editAppointment(index, 1);
        localStorage.setItem("appointments", JSON.stringify(local));
        getAppointments();
      }
    });
  }
});

//Buscar citas
search.addEventListener("click", (e) => {
  e.preventDefault();
  let input = document.querySelector("#inputBuscar").value;
  let data = JSON.parse(localStorage.getItem("appointments"));
  let filtro = data.filter((appt) =>
    appt.nombre.toLowerCase().includes(input.toLowerCase())
  );
  searching.innerHTML = "";
  filtro.length === 0
    ? (searching.innerHTML += 
        `
            <div class="alert alert-danger" role="alert">
                No se encontraron resultados con el nombre: ${input}
            </div>
        `)
    : filtro.map((appt) => {
        const { nombre, fecha, hora, sintomas } = appt;
        searching.innerHTML += `
            <div class="alert alert-primary" role="alert">
                Nombre: ${nombre}, Fecha: ${fecha}, Hora: ${hora}, Sintomas: ${sintomas}
            </div>
        `;
      });
});
