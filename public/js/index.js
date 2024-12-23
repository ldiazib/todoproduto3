// Variables globales
let tableroParaEliminar = null;

// Función para cargar tableros desde la base de datos (GraphQL)
function cargarTableros() {
    const tablerosContainer = document.getElementById("tablerosContainer");

    const query = `
      query {
        panels {
          id
          titulo
          descripcion
          usuario
        }
      }
    `;

    fetch('/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
    .then(res => res.json())
    .then(data => {
      const tableros = data.data.panels;
      localStorage.setItem("tableros", tableros);

      tablerosContainer.innerHTML = "";

      tableros.forEach((tablero) => {
        const tableroCard = document.createElement("div");
        tableroCard.classList.add("col-md-4", "mb-4");
        tableroCard.innerHTML = `
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${tablero.titulo}</h5>
              <p class="card-text">${tablero.descripcion}</p>
              <p class="card-text"><small class="text-muted">Creado por: ${tablero.usuario}</small></p>
              <button class="btn btn-primary" onclick="abrirTablero('${tablero.id}')">Abrir Tablero</button>
              <button class="btn btn-danger" onclick="abrirModalEliminarTablero('${tablero.id}')">Eliminar</button>
            </div>
          </div>`;
        tablerosContainer.appendChild(tableroCard);
      });
    })
    .catch(error => console.error('Error cargando tableros:', error));
}

// Función para abrir tablero y redirigir a tareas.html
function abrirTablero(tableroId) {
    window.location.href = `tareas.html?tablero=${tableroId}`;
}

// Función para mostrar el modal de confirmación de eliminación de tablero
function abrirModalEliminarTablero(id) {
    tableroParaEliminar = id;
    const modalEliminarTablero = new bootstrap.Modal(document.getElementById("modalConfirmarEliminarTablero"));
    modalEliminarTablero.show();
}

// Función para eliminar tablero desde la base de datos
document.getElementById("botonConfirmarEliminarTablero")?.addEventListener("click", function () {
    if (tableroParaEliminar !== null) {
        const mutation = `
          mutation DeletePanel($id: ID!) {
            deletePanel(id: $id)
          }
        `;

        const variables = { id: tableroParaEliminar };

        fetch('/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: mutation, variables })
        })
        .then(res => res.json())
        .then(data => {
          if (data.errors) {
            console.error('Error al eliminar tablero:', data.errors);
          } else {
            console.log('Tablero eliminado:', data);
            cargarTableros();
            tableroParaEliminar = null;
            const modalEliminarTablero = bootstrap.Modal.getInstance(
              document.getElementById("modalConfirmarEliminarTablero")
            );
            modalEliminarTablero.hide();
          }
        })
        .catch(error => console.error('Error en la solicitud:', error));
    }
});

// Cargar tableros al cargar la página
document.addEventListener("DOMContentLoaded", cargarTableros);

const query = `
  query {
    panels {
      id
      titulo
      descripcion
      usuario
    }
  }
`;

// Mutación para crear un nuevo panel
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
  titulo: "Tablero de ejemplo",
  descripcion: "Descripción del tablero de ejemplo",
  usuario: "admin"
};

fetch('/graphql', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: mutation, variables })
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
