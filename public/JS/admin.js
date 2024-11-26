const endpoint = './JSON/datos.json';  
let productos = '';
const contenedor = document.querySelector('#contenedor');

function mostrarMensaje(mensaje) {
  document.querySelector('#mensajeConfirmacion').innerHTML = mensaje;
}

const obtenerDatos = async () => {
  try {
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
    mostrarMensaje('Error al cargar productos');
  }
};

document.getElementById('añadir').addEventListener('click', function() {
  const formulario = document.getElementById('prodNuevo');
  formulario.style.display = (formulario.style.display === 'none' ? 'block' : 'none');
});

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
      const formEditar = document.forms['formEditar'];
      formEditar.idEditar.value = producto.id;
      formEditar.titulo.value = producto.nombre;
      formEditar.descripcion.value = producto.descripcion;
      formEditar.precio.value = producto.precio;
      formEditar.imagen.value = producto.imagen;
      
      const modalEditar = new bootstrap.Modal(document.getElementById('modalEditar'));
      modalEditar.show();
    })
    .catch(error => {
      console.error("Error al obtener producto:", error);
      mostrarMensaje('Error al obtener datos del producto');
    });
};

document.forms['formEditar'].addEventListener('submit', (event) => {
  event.preventDefault();
  const formEditar = document.forms['formEditar'];
  const nuevosDatos = {
    id: formEditar.idEditar.value,
    nombre: formEditar.titulo.value,
    descripcion: formEditar.descripcion.value,
    precio: parseFloat(formEditar.precio.value),
    imagen: formEditar.imagen.value
  };

  if (!nuevosDatos.nombre || !nuevosDatos.descripcion || !nuevosDatos.precio || !nuevosDatos.imagen) {
    document.querySelector('#mensajeEditar').innerHTML = '*Complete todos los datos';
    return;
  }
  document.querySelector('#mensajeEditar').innerHTML = '';

  fetch(endpoint + '/' + nuevosDatos.id, {
    method: 'PUT',
    body: JSON.stringify(nuevosDatos),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(response => {
      mostrarMensaje(response.mensaje);
      obtenerDatos(); 
      document.getElementById('modalEditar').modal('hide');  
    })
    .catch(err => mostrarMensaje('Error al actualizar el producto'));
});

obtenerDatos();