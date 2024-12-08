// Obtener el ID del tablero actual desde la URL
const params = new URLSearchParams(window.location.search);
const tableroId = params.get("tablero");

console.log(`Tablero ID desde la URL: ${tableroId}`); 

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
    tableros[tableroIndex].tareas = tareas; 
    localStorage.setItem("tableros", JSON.stringify(tableros)); 
  } else {
    console.error("Error: Tablero actual no encontrado en localStorage");
  }
}

function volverAlDashboard() {
  window.location.href = "/app/public/index.html"; 
}

// Funciones de Drag & Drop para tareas
function allowDrop(ev) {
  ev.preventDefault(); 
}

function highlightColumn(ev) {
  ev.preventDefault();
  const column = ev.target.closest(".seccion-tareas");
  if (column) {
    column.classList.add("hovered"); 
  }
}

function removeHighlight(ev) {
  const column = ev.target.closest(".seccion-tareas");
  if (column) {
    column.classList.remove("hovered"); 
  }
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id); 
  ev.target.classList.add("dragging");
}

function endDrag(ev) {
  ev.target.classList.remove("dragging"); 
}

function drop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text"); 
  const task = document.getElementById(data); 
  const dropTarget = ev.target.closest(".seccion-tareas"); 

  if (dropTarget && task) {
    dropTarget.appendChild(task);
    dropTarget.classList.remove("hovered");

    // Actualizar estado de la tarea
    const nuevoEstado = dropTarget.id.replace("-column", "");
    const tarea = tareas.find((t) => t.id === task.id);
    if (tarea) {
      tarea.estado = nuevoEstado; 
      guardarTareasEnLocalStorage();
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

  tareas.push(nuevaTarea); 
  guardarTareasEnLocalStorage(); 

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
    tareaParaModificar = idTarea; 
    const tarea = tareas.find((t) => t.id === idTarea); 
  
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
      event.preventDefault(); 
  
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
  
        guardarTareasEnLocalStorage(); 
  
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

// Formulario para crear una nueva tarea con archivo adjunto
const form = document.getElementById("formNuevaTarea");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const tituloTarea = document.getElementById("tituloTarea").value.trim();
    const descripcionTarea = document.getElementById("descripcionTarea").value.trim();
    const fechaTarea = document.getElementById("fechaTarea").value.trim();
    const horaTarea = document.getElementById("horaTarea").value.trim();
    const responsableTarea = document.getElementById("responsableTarea").value.trim();
    const archivoTarea = document.getElementById("fileTarea").files[0]; 

    if (!tituloTarea || !descripcionTarea || !fechaTarea || !horaTarea || !responsableTarea) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Crear un objeto FormData para incluir el archivo
    const formData = new FormData();
    formData.append("titulo", tituloTarea);
    formData.append("descripcion", descripcionTarea);
    formData.append("fecha", fechaTarea);
    formData.append("hora", horaTarea);
    formData.append("responsable", responsableTarea);
    formData.append("file", archivoTarea); 

    try {
      const response = await fetch("http://localhost:4000/api/tasks", {
        method: "POST",
        body: formData, 
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Tarea creada con éxito:", data);
        form.reset(); 
        cargarTareas();
      } else {
        console.error("Error al crear la tarea:", data.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  });
}

// Función para cargar tareas desde el servidor
async function cargarTareas() {
  try {
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query }),
    });

    const data = await response.json();

    if (response.ok) {
      const tareas = data.data.tasks;
      console.log("Tareas cargadas:", tareas);

      
      tareas.forEach((tarea) => {
        const columna = document.getElementById(`${tarea.estado}-column`);
        if (columna) {
          agregarTareaAColumna(tarea, columna);
        }
      });
    } else {
      console.error("Error al cargar tareas:", data.errors);
    }
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  }
}

// Función para agregar tarea al DOM
function agregarTareaAColumna(tarea, columna) {
  const tareaDiv = document.createElement("div");
  tareaDiv.classList.add("tarea");
  tareaDiv.setAttribute("id", tarea.id);

  tareaDiv.innerHTML = `
    <p><strong>Título:</strong> ${tarea.titulo}</p>
    <p><strong>Descripción:</strong> ${tarea.descripcion}</p>
    <p><strong>Fecha:</strong> ${tarea.fecha}</p>
    <p><strong>Hora:</strong> ${tarea.hora}</p>
    <p><strong>Responsable:</strong> ${tarea.responsable}</p>
    ${tarea.filePath ? `<p><a href="${tarea.filePath}" target="_blank">Archivo Adjunto</a></p>` : ""}
    <button class="btn btn-danger btn-sm" onclick="eliminarTarea('${tarea.id}')">Eliminar</button>
    <button class="btn btn-warning btn-sm" onclick="abrirModalModificar('${tarea.id}')">Modificar</button>
  `;

  columna.appendChild(tareaDiv);
}

// Función para eliminar tarea
async function eliminarTarea(id) {
  try {
    const response = await fetch("http://localhost:4000/api/tasks/" + id, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("Tarea eliminada con éxito.");
      document.getElementById(id)?.remove(); 
    } else {
      console.error("Error al eliminar la tarea.");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

const socket = io('http://localhost:4000');

socket.on('newTask', (task) => {
  agregarTareaAColumna(task, document.getElementById("to-do-column"));
});

socket.on('updateTask', (task) => {
  const tareaDiv = document.getElementById(task.id);
  if (tareaDiv) {
    tareaDiv.innerHTML = `
      <p><strong>Título:</strong> ${task.titulo}</p>
      <p><strong>Descripción:</strong> ${task.descripcion}</p>
      <p><strong>Fecha:</strong> ${task.fecha}</p>
      <p><strong>Hora:</strong> ${task.hora}</p>
      <p><strong>Responsable:</strong> ${task.responsable}</p>
      ${task.filePath ? `<p><a href="${task.filePath}" target="_blank">Archivo Adjunto</a></p>` : ""}
    `;
  }
});

socket.on('deleteTask', (id) => {
  document.getElementById(id)?.remove();
});
