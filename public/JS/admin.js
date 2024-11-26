document.addEventListener('DOMContentLoaded', () => {
  const endpoint = './JSON/datos.json'; 

  let productos = '';
  const contenedor = document.querySelector('#contenedor');
  const formulario = document.getElementById('prodNuevo');

  mostrarMensaje = (mensaje) => {
    document.querySelector('#mensajeConfirmacion').innerHTML = mensaje;
  };

  document.getElementById('añadir').addEventListener('click', function () {
    formulario.style.display = formulario.style.display === 'none' ? 'block' : 'none';
  });

  // Obtener productos
  const obtenerDatos = async () => {
    try {
      const respuesta = await fetch(endpoint);
      const datos = await respuesta.json();
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
                <button class="btn btn-outline-warning me-2 edit" onClick="editar(${prod.id})">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-outline-danger" onClick="eliminar(${prod.id})">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>`;
      });
      contenedor.innerHTML = productos;
    } catch (error) {
      console.error(error);
      mostrarMensaje('Error al cargar productos');
    }
  };

  document.getElementById('formAñadir').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nuevoProducto = new FormData(formulario);
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
      formulario.style.display = 'none';  
      obtenerDatos();  
    } catch (error) {
      console.error(error);
      mostrarMensaje('Error al agregar el producto');
    }
  });

  // Eliminar producto
  eliminar = async (id) => {
    try {
      const respuesta = await fetch(`${endpoint}/${id}`, {
        method: 'DELETE'
      });
      const data = await respuesta.json();
      mostrarMensaje(data.mensaje);
      obtenerDatos();
    } catch (error) {
      console.error(error);
      mostrarMensaje('Error al eliminar producto');
    }
  };

  // Editar producto
  editar = (id) => {
    alert('Función de edición no implementada aún');
  };

  obtenerDatos();
});
