document.addEventListener('DOMContentLoaded', () => {
  const endpoint = './JSON/datos.json';

  let productos = '';
  const contenedor = document.querySelector('#contenedor');
  const nombreContenedorElement = document.querySelector('#nombreContenedor');
  const formulario = document.getElementById('prodNuevo');
  
  mostrarMensaje = (mensaje) => {
    document.querySelector('#mensajeConfirmacion').innerHTML = mensaje;
  };

  document.getElementById('añadir').addEventListener('click', function() {
    if (formulario.style.display === 'none' || formulario.style.display === '') {
      formulario.style.display = 'block'; 
    } else {
      formulario.style.display = 'none'; 
    }
  });

  const obtenerDatos = async () => {
    try {
      const respuesta = await fetch(endpoint);
      const datos = await respuesta.json();
      
      const nombreContenedor = datos.nombreContenedor;
      nombreContenedorElement.textContent = nombreContenedor;

      productos = '';
      datos.productos.forEach(prod => {
        productos += `
          <div class="card border border-1 border-dark d-flex flex-column align-items-center" style="width: 100%; max-width: 300px; margin: 30px">
            <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
            <div class="card-body">
              <h4>${prod.nombre}</h4>
              <p class="card-text">${prod.descripcion}</p>
            </div>
            <div class="d-flex justify-content-between align-items-center w-100 mb-2 px-2">
              <p class="card-text border border-secondary rounded p-2 mb-0">
                <strong>$${prod.precio}</strong>
              </p>
              <div class="d-flex ms-auto">
                <a href="#prodEditar" class="btn btn-outline-warning me-2 edit" onClick="editar(${prod.id})">
                  <i class="bi bi-pencil"></i>
                </a>
                <a class="btn btn-outline-danger" type="submit" id="eliminar" onClick="eliminar(${prod.id})">
                  <i class="bi bi-trash"></i>
                </a>
              </div>
            </div>
          </div>`;
      });
      contenedor.innerHTML = productos;
    } catch (error) {
      mostrarMensaje('Error al cargar productos');
    }
  };

  const eliminar = (id) => {
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      fetch(endpoint, {
        method: 'DELETE',
        body: JSON.stringify({ id }),
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => res.json())
      .then(response => {
        mostrarMensaje(response.mensaje);
        setTimeout(() => {
          location.reload();
        }, 1000);
      })
      .catch(err => mostrarMensaje('Error al eliminar el producto'));
    }
  };

  const editar = (id) => {
    fetch(endpoint)
      .then(res => res.json())
      .then(datos => {
        const producto = datos.productos.find(prod => prod.id === id);
        const formEditar = document.forms['formEditar'];
        formEditar.idEditar.value = producto.id;
        formEditar.nombre.value = producto.nombre;
        formEditar.descripcion.value = producto.descripcion;
        formEditar.precio.value = producto.precio;
        document.getElementById('contFormEditar').style.display = 'block';
      });
  };

  // Aquí agregamos la verificación de que el formulario exista antes de agregar el evento
  const formularioAñadir = document.getElementById('formAñadir');
  if (formularioAñadir) {
    formularioAñadir.addEventListener('submit', async (event) => {
      event.preventDefault();
      const nuevoProducto = new FormData(formularioAñadir);
      const producto = {
        nombre: nuevoProducto.get('nombre'),
        descripcion: nuevoProducto.get('descripcion'),
        precio: nuevoProducto.get('precio')
      };

      try {
        const respuesta = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(producto)
        });

        const data = await respuesta.json();
        console.log(data);
        formularioAñadir.style.display = 'none';  // Ocultar formulario
        obtenerDatos();  // Recargar productos
      } catch (error) {
        console.error(error);
        mostrarMensaje('Error al agregar el producto');
      }
    });
  } else {
    console.error("Formulario no encontrado");
  }

  obtenerDatos();
});
