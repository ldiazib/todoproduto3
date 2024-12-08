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

// Formulario para crear una nueva tarea con archivo adjunto
const form = document.getElementById("formNuevaTarea");

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar recarga de la página

    const tituloTarea = document.getElementById("tituloTarea").value.trim();
    const descripcionTarea = document.getElementById("descripcionTarea").value.trim();
    const fechaTarea = document.getElementById("fechaTarea").value.trim();
    const horaTarea = document.getElementById("horaTarea").value.trim();
    const responsableTarea = document.getElementById("responsableTarea").value.trim();
    const archivoTarea = document.getElementById("fileTarea").files[0]; // Archivo adjunto

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
    formData.append("file", archivoTarea); // Agregar el archivo al FormData

    try {
      const response = await fetch("http://localhost:4000/api/tasks", {
        method: "POST",
        body: formData, // Enviar FormData al servidor
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Tarea creada con éxito:", data);
        form.reset(); // Reiniciar el formulario
        // Lógica para actualizar la UI, como recargar las tareas
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

      // Lógica para mostrar tareas en el DOM
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
      document.getElementById(id)?.remove(); // Eliminar del DOM
    } else {
      console.error("Error al eliminar la tarea.");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}