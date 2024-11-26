const endpoint = './JSON/datos.json';  
let productos = '';
const contenedor = document.querySelector('#contenedor');

function mostrarMensaje(mensaje) {
  document.querySelector('#mensajeConfirmacion').innerHTML = mensaje;
}

// Obtener los productos del archivo JSON
const obtenerDatos = async () => {
  try {
    console.log("Cargando datos desde: " + endpoint); 
    const respuesta = await fetch(endpoint);
    const productosRecibidos = await respuesta.json();
    productos = '';
    productosRecibidos.forEach(prod => {
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
                <i class="bi bi-pencil"></i> Editar
              </button>
              <button class="btn btn-outline-danger" onClick="eliminar(${prod.id})">
                <i class="bi bi-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>`;
    });
    contenedor.innerHTML = productos;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    mostrarMensaje('Error al cargar productos');
  }
};

// Mostrar formulario de añadir
document.getElementById('añadir').addEventListener('click', function() {
  const formulario = document.getElementById('prodNuevo');
  formulario.style.display = (formulario.style.display === 'none' ? 'block' : 'none');
});

// Añadir un nuevo producto
document.getElementById('formAñadir').addEventListener('submit', function(event) {
  event.preventDefault();
  const nuevoProducto = {
    nombre: event.target.titulo.value,
    descripcion: event.target.descripcion.value,
    precio: parseFloat(event.target.precio.value), 
    imagen: event.target.imagen.value 
  };

  if (!nuevoProducto.nombre || !nuevoProducto.descripcion || !nuevoProducto.precio || !nuevoProducto.imagen) {
    document.querySelector('#mensaje').innerHTML = '*Por favor, complete todos los campos.';
    return;
  }
  document.querySelector('#mensaje').innerHTML = '';

  fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(nuevoProducto),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(response => response.json())
    .then(data => {
      mostrarMensaje('Producto añadido correctamente');
      obtenerDatos();
      document.getElementById('prodNuevo').style.display = 'none'; 
    })
    .catch(error => {
      mostrarMensaje('Error al añadir el producto');
      console.error(error);
    });
});

// Eliminar un producto
const eliminar = (id) => {
  if (confirm('¿Seguro que quieres eliminar este producto?')) {
    fetch(endpoint + '/' + id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(response => {
        mostrarMensaje(response.mensaje);
        obtenerDatos();  
      })
      .catch(err => mostrarMensaje('Error al eliminar el producto'));
    }
};


const editar = (id) => {
  fetch(endpoint + '/' + id)  
    .then(res => res.json())
    .then(producto => {
      const formularioEditar = document.getElementById('prodEditar');
      formularioEditar.style.display = 'block';  
      formularioEditar.querySelector('[name="titulo"]').value = producto.nombre;
      formularioEditar.querySelector('[name="descripcion"]').value = producto.descripcion;
      formularioEditar.querySelector('[name="precio"]').value = producto.precio;
      formularioEditar.querySelector('[name="idEditar"]').value = producto.id;
    })
    .catch(error => {
      mostrarMensaje('Error al cargar los datos del producto');
      console.error(error);
    });
};

// Editar un producto
document.getElementById('formEditar').addEventListener('submit', function(event) {
  event.preventDefault();
  const id = event.target.idEditar.value;
  const productoEditado = {
    nombre: event.target.titulo.value,
    descripcion: event.target.descripcion.value,
    precio: parseFloat(event.target.precio.value)
  };

  fetch(endpoint + '/' + id, {
    method: 'PUT',
    body: JSON.stringify(productoEditado),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(data => {
      mostrarMensaje('Producto editado correctamente');
      obtenerDatos();
      document.getElementById('prodEditar').style.display = 'none';  
    })
    .catch(err => {
      mostrarMensaje('Error al editar el producto');
      console.error(err);
    });
});

obtenerDatos();