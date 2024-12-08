// Obtener el ID del tablero actual desde la URL
const params = new URLSearchParams(window.location.search);
const tableroId = params.get("tablero");

console.log(`Tablero ID desde la URL: ${tableroId}`); // Log para depuración

// Verificar si el tablero existe
const tableros = JSON.parse(localStorage.getItem("tableros")) || [];
const tableroActual = tableros.find((tablero) => tablero.id === tableroId);

// Declarar la variable globalmente
let tareas = [];

// Verificar si el tablero existe
if (!tableroActual) {
  console.error(`Tablero no encontrado: ${tableroId}`);
  alert("El tablero no existe.");
  volverAlDashboard();
} else {
  console.log(`Tablero encontrado:`, tableroActual);

  // Asignar las tareas del tablero actual
  tareas = tableroActual.tareas || [];

  // Cargar tareas iniciales
  cargarTareas();
}


// Función para guardar las tareas del tablero actual en localStorage
function guardarTareasEnLocalStorage() {
  const tableroIndex = tableros.findIndex((tablero) => tablero.id === tableroActual.id);

  if (tableroIndex !== -1) {
    tableros[tableroIndex].tareas = tareas; // Actualizar las tareas del tablero actual
    localStorage.setItem("tableros", JSON.stringify(tableros)); // Guardar todos los tableros
  } else {
    console.error("Error: Tablero actual no encontrado en localStorage");
  }
}

function volverAlDashboard() {
  window.location.href = "/app/public/index.html"; // Redirige al dashboard
}

// Funciones de Drag & Drop para tareas
function allowDrop(ev) {
  ev.preventDefault(); // Permitir que el elemento sea soltado
}

function highlightColumn(ev) {
  ev.preventDefault();
  const column = ev.target.closest(".seccion-tareas");
  if (column) {
    column.classList.add("hovered"); // Agregar clase de resaltado
  }
}

function removeHighlight(ev) {
  const column = ev.target.closest(".seccion-tareas");
  if (column) {
    column.classList.remove("hovered"); // Quitar clase de resaltado
  }
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id); // Almacenar el ID de la tarea arrastrada
  ev.target.classList.add("dragging");
}

function endDrag(ev) {
  ev.target.classList.remove("dragging"); // Eliminar clase de arrastre
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text"); // Obtener el ID de la tarea
  const task = document.getElementById(data); // Seleccionar la tarea por ID
  const dropTarget = ev.target.closest(".seccion-tareas"); // Identificar la columna donde se suelta

  if (dropTarget && task) {
    dropTarget.appendChild(task); // Añadir tarea a la columna
    dropTarget.classList.remove("hovered");

    // Actualizar estado de la tarea
    const nuevoEstado = dropTarget.id.replace("-column", ""); // Obtener el nuevo estado
    const tarea = tareas.find((t) => t.id === task.id);
    if (tarea) {
      tarea.estado = nuevoEstado; // Actualizar estado
      guardarTareasEnLocalStorage(); // Guardar cambios en localStorage
    }
  }
}

// Función para cargar tareas en las columnas correspondientes
function cargarTareas() {
  tareas.forEach((tarea) => {
    const columna = document.getElementById(`${tarea.estado}-column`);
    if (columna) {
      agregarTareaAColumna(tarea, columna);
    }
  });
}

// Crear nueva tarea y añadirla a la columna "To Do"
document.getElementById("formNuevaTarea")?.addEventListener("submit", function (event) {
  event.preventDefault();

  const tituloTarea = document.getElementById("tituloTarea").value;
  const descripcionTarea = document.getElementById("descripcionTarea").value;
  const fechaTarea = document.getElementById("fechaTarea").value;
  const horaTarea = document.getElementById("horaTarea").value;
  const responsableTarea = document.getElementById("responsableTarea").value;

  const nuevaTarea = {
    id: `tarea-${Date.now()}`,
    titulo: tituloTarea,
    descripcion: descripcionTarea,
    fecha: fechaTarea,
    hora: horaTarea,
    responsable: responsableTarea,
    estado: "to-do",
  };

  tareas.push(nuevaTarea); // Añadir tarea al array del tablero actual
  guardarTareasEnLocalStorage(); // Guardar en localStorage

  agregarTareaAColumna(nuevaTarea, document.getElementById("to-do-column"));

  document.getElementById("formNuevaTarea").reset();
  const modal = bootstrap.Modal.getInstance(document.getElementById("modalNuevaTarea"));
  modal.hide();
});

// Función para agregar una tarea a una columna específica
function agregarTareaAColumna(tarea, columna) {
  const tareaDiv = document.createElement("div");
  tareaDiv.classList.add("tarea");
  tareaDiv.setAttribute("id", tarea.id);
  tareaDiv.setAttribute("draggable", "true");
  tareaDiv.setAttribute("ondragstart", "drag(event)");
  tareaDiv.setAttribute("ondragend", "endDrag(event)");

  tareaDiv.innerHTML = `
    <p><strong>Título:</strong> ${tarea.titulo}</p>
    <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
    <p><strong>Fecha:</strong> ${tarea.fecha}</p>
    <p><strong>Hora:</strong> ${tarea.hora}</p>
    <p><strong>Responsable:</strong> ${tarea.responsable}</p>
    <button class="btn btn-danger btn-sm" onclick="abrirModalEliminar('${tarea.id}')">Eliminar</button>
    <button class="btn btn-warning btn-sm" onclick="abrirModalModificar('${tarea.id}')">Modificar</button>
  `;

  columna.appendChild(tareaDiv);
}

// Función para abrir el modal de confirmación de eliminación
function abrirModalEliminar(idTarea) {
  tareaParaEliminar = idTarea;
  const confirmarEliminarModal = new bootstrap.Modal(
    document.getElementById("modalConfirmarEliminar")
  );
  confirmarEliminarModal.show();
}

// Eliminar tarea
document
  .getElementById("botonConfirmarEliminar")
  ?.addEventListener("click", function () {
    if (tareaParaEliminar !== null) {
      document.getElementById(tareaParaEliminar).remove();
      tareas = tareas.filter((tarea) => tarea.id !== tareaParaEliminar);
      guardarTareasEnLocalStorage();
      const confirmarEliminarModal = bootstrap.Modal.getInstance(
        document.getElementById("modalConfirmarEliminar")
      );
      confirmarEliminarModal.hide();
    }
  });

  // Función para abrir el modal de modificar tarea
  function abrirModalModificar(idTarea) {
    tareaParaModificar = idTarea; // Guardar el ID de la tarea a modificar
    const tarea = tareas.find((t) => t.id === idTarea); // Buscar la tarea en el array global
  
    if (tarea) {
      // Rellenar el formulario del modal con los datos de la tarea
      document.getElementById("tituloModificarTarea").value = tarea.titulo;
      document.getElementById("descripcionModificarTarea").value =
        tarea.descripcion;
      document.getElementById("fechaModificarTarea").value = tarea.fecha;
      document.getElementById("horaModificarTarea").value = tarea.hora;
      document.getElementById("responsableModificarTarea").value =
        tarea.responsable;
  
      // Mostrar el modal
      const modal = new bootstrap.Modal(
        document.getElementById("modalModificarTarea")
      );
      modal.show();
    }
  }
  
  // Función para guardar los cambios de la tarea modificada
  document
    .getElementById("formModificarTarea")
    ?.addEventListener("submit", function (event) {
      event.preventDefault(); // Evitar el envío del formulario
  
      const nuevoTitulo = document.getElementById("tituloModificarTarea").value;
      const nuevaDescripcion = document.getElementById(
        "descripcionModificarTarea"
      ).value;
      const nuevaFecha = document.getElementById("fechaModificarTarea").value;
      const nuevaHora = document.getElementById("horaModificarTarea").value;
      const nuevoResponsable = document.getElementById(
        "responsableModificarTarea"
      ).value;
  
      // Buscar y actualizar la tarea en el array global
      const tarea = tareas.find((t) => t.id === tareaParaModificar);
      if (tarea) {
        tarea.titulo = nuevoTitulo;
        tarea.descripcion = nuevaDescripcion;
        tarea.fecha = nuevaFecha;
        tarea.hora = nuevaHora;
        tarea.responsable = nuevoResponsable;
  
        guardarTareasEnLocalStorage(); // Guardar los cambios en localStorage
  
        // Actualizar la tarea visualmente en el DOM
        const tareaDiv = document.getElementById(tarea.id);
        tareaDiv.innerHTML = `
          <p><strong>Título:</strong> ${tarea.titulo}</p>
          <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
          <p><strong>Fecha:</strong> ${tarea.fecha}</p>
          <p><strong>Hora:</strong> ${tarea.hora}</p>
          <p><strong>Responsable:</strong> ${tarea.responsable}</p>
          <button class="btn btn-danger btn-sm" onclick="abrirModalEliminar('${tarea.id}')">Eliminar</button>
          <button class="btn btn-warning btn-sm" onclick="abrirModalModificar('${tarea.id}')">Modificar</button>
        `;
      }
  
      // Cerrar el modal de modificación
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("modalModificarTarea")
      );
      modal.hide();
    });


    const query = `
    query {
        tasks {
            id
            titulo
            descripcion
            fecha
            hora
            responsable
            estado
        }
    }`
    const form = document.getElementById("formNuevaTarea");

    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar que la página se recargue
        
        const tituloTarea = document.getElementById("tituloTarea").value.trim();
        const descripcionTarea = document.getElementById("descripcionTarea").value.trim();
        const fechaTarea = document.getElementById("fechaTarea").value.trim();
        const horaTarea = document.getElementById("horaTarea").value.trim();
        const responsableTarea = document.getElementById("responsableTarea").value.trim();
        
        console.log('Valores capturados:', { tituloTarea, descripcionTarea, fechaTarea, horaTarea, responsableTarea });
    
        if (!tituloTarea || !descripcionTarea || !fechaTarea || !horaTarea || !responsableTarea) {
          alert('Por favor, completa todos los campos.');
          return;
        }
    
        const mutation = `
          mutation CreateTask($titulo: String!, $descripcion: String!, $fecha: String!, $hora: String!, $responsable: String!) {
            createTask(titulo: $titulo, descripcion: $descripcion, fecha: $fecha, hora: $hora, responsable: $responsable) {
              id
              titulo
              descripcion
              fecha
              hora
              responsable
            }
          }
        `;
    
        const variables = {
          titulo: tituloTarea,
          descripcion: descripcionTarea,
          fecha: fechaTarea,
          hora: horaTarea,
          responsable: responsableTarea
        };
    
        fetch('http://localhost:4000/graphql', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: mutation, variables })
        })
        .then(res => res.json())
        .then(data => {
          console.log('Respuesta:', data);
          form.reset();
        })
        .catch(error => console.error('Error en la solicitud:', error));
      });
    }
    
    const mutationUpdateTask = `
  mutation UpdateTask($id: ID!, $titulo: String, $descripcion: String, $fecha: String, $hora: String, $responsable: String) {
    updateTask(id: $id, titulo: $titulo, descripcion: $descripcion, fecha: $fecha, hora: $hora, responsable: $responsable) {
      id
      titulo
      descripcion
      fecha
      hora
      responsable
    }
  }
`;

const mutationDeleteTask = `
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id)
  }
`;

function modificarTarea(id, titulo, descripcion, fecha, hora, responsable) {
  const variables = { id, titulo, descripcion, fecha, hora, responsable };

  fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: mutationUpdateTask, variables })
  })
  .then(res => res.json())
  .then(data => console.log('Tarea modificada:', data))
  .catch(error => console.error('Error al modificar tarea:', error));
}

function eliminarTarea(id) {
  const variables = { id };

  fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: mutationDeleteTask, variables })
  })
  .then(res => res.json())
  .then(data => console.log('Tarea eliminada:', data))
  .catch(error => console.error('Error al eliminar tarea:', error));
}
