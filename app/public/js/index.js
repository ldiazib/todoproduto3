// Variables globales
let tableroParaEliminar = null;

// Función para cargar tableros desde localStorage
function cargarTableros() {
    const tablerosContainer = document.getElementById("tablerosContainer");
    const tableros = JSON.parse(localStorage.getItem("tableros")) || [];
    tablerosContainer.innerHTML = "";
  
    tableros.forEach((tablero, index) => {
      const tableroCard = document.createElement("div");
      tableroCard.classList.add("col-md-4", "mb-4");
      tableroCard.innerHTML = `
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">${tablero.titulo}</h5>
            <p class="card-text">${tablero.descripcion}</p>
            <p class="card-text"><small class="text-muted">Creado por: ${tablero.usuario}</small></p>
            <button class="btn btn-primary" onclick="abrirTablero(${index})">Abrir Tablero</button>
            <button class="btn btn-danger" onclick="abrirModalEliminarTablero(${index})">Eliminar</button>
          </div>
        </div>`;
      tablerosContainer.appendChild(tableroCard);
    });
}

// Función para abrir tablero y redirigir a tareas.html
function abrirTablero(tableroId) {
    const tableros = JSON.parse(localStorage.getItem("tableros")) || [];
    const tablero = tableros[tableroId];
    if (tablero) {
        window.location.href = `/app/public/tareas.html?tablero=${tableroId}`;
    } else {
        console.error("Tablero no encontrado.");
    }
}

// Función para mostrar el modal de confirmación de eliminación de tablero
function abrirModalEliminarTablero(index) {
    tableroParaEliminar = index;
    const modalEliminarTablero = new bootstrap.Modal(document.getElementById("modalConfirmarEliminarTablero"));
    modalEliminarTablero.show();
}

// Función para eliminar tablero de localStorage y recargar la lista
document.getElementById("botonConfirmarEliminarTablero")?.addEventListener("click", function () {
    if (tableroParaEliminar !== null) {
        const tableros = JSON.parse(localStorage.getItem("tableros")) || [];
        tableros.splice(tableroParaEliminar, 1);
        localStorage.setItem("tableros", JSON.stringify(tableros));
        cargarTableros(); // Recargar lista de tableros después de eliminar
        tableroParaEliminar = null;
        const modalEliminarTablero = bootstrap.Modal.getInstance(
          document.getElementById("modalConfirmarEliminarTablero")
        );
        modalEliminarTablero.hide();
      }
    }
);

// Cargar tableros al cargar la página
document.addEventListener("DOMContentLoaded", cargarTableros);



const query = `
    query {
        panels {
            id
            titulo
            descripcion
        }
        tasks{
            id
            titulo
            descripcion
            fecha
            estado
            responsable
        }
    }
`;

const mutation = `
  mutation CreatePanel($titulo: String!, $descripcion: String!, $usuario: String!) {
    createPanel(titulo: $titulo, descripcion: $descripcion, usuario: $usuario) {
      id
      titulo
      descripcion
    }
  }
`;

const variables = {
  titulo: "asdf",
  descripcion: "asdf",
  usuario: "admin"
};

fetch('http://localhost:4000/graphql', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    query: mutation, 
    variables: variables 
  }),
})
  .then((res) => res.json().catch(() => ({ error: 'Respuesta no es JSON válida' })))
  .then((data) => {
    if (data.error) {
      console.error('Error en la respuesta:', data.error);
    } else if (data.errors) {
      console.error('Errores de GraphQL:', data.errors);
    } else {
      console.log('Datos del panel creado:', data);
    }
  })
  .catch((error) => {
    console.error('Error en la solicitud:', error);
  });
