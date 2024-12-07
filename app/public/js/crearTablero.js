function volverAlDashboard() {
    window.location.href = "/app/public/index.html";
  }
  
  const form = document.getElementById("formCrearTablero");
  
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
    
      const titulo = document.getElementById("titulo").value.trim();
      const descripcion = document.getElementById("descripcion").value.trim();
      const usuario = document.getElementById("usuario").value.trim();
    
      if (!titulo || !descripcion || !usuario) {
        alert("Por favor, completa todos los campos.");
        return;
      }
    
      const tableros = JSON.parse(localStorage.getItem("tableros")) || [];
      const nuevoTablero = { 
        id: tableros.length.toString(), // Genera un ID único basado en el índice
        titulo, 
        descripcion, 
        usuario, 
        tareas: [] 
      };
      tableros.push(nuevoTablero);
      localStorage.setItem("tableros", JSON.stringify(tableros));
    
      window.location.href = `/app/public/tareas.html?tablero=${nuevoTablero.id}`;
    });
    
  
    form.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        form.requestSubmit();
      }
    });
  } else {
    console.error("Formulario no encontrado.");
  }
  

  form.addEventListener("submit", function (event) {
    event.preventDefault();
  
    const titulo = document.getElementById("titulo").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
  
    if (!titulo || !descripcion || !usuario) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    const mutation = `
      mutation CreatePanel($titulo: String!, $descripcion: String!, $usuario: String!) {
        createPanel(titulo: $titulo, descripcion: $descripcion, usuario: $usuario) {
          id
          titulo
          descripcion
        }
      }
    `;
  
    const variables = { titulo, descripcion, usuario };
  
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: mutation, variables }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.errors) {
        console.error('Errores de GraphQL:', data.errors);
      } else {
        console.log('Panel creado:', data.data.createPanel);
        window.location.href = `/app/public/tareas.html?tablero=${data.data.createPanel.id}`;
      }
    })
    .catch(error => console.error('Error en la solicitud:', error));
  });
  