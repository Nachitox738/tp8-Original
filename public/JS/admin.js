const endpoint = './datos.json';

let productos = '';
const contenedor = document.querySelector('#contenedor');

mostrarMensaje = (mensaje) => {
  document.querySelector('#mensajeConfirmacion').innerHTML = mensaje;
}

document.getElementById('añadir').addEventListener('click', function () {
  const formulario = document.getElementById('prodNuevo');
  formulario.classList.toggle('new');
});

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

obtenerDatos();

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
    .then(productosRecibidos => {
      const producto = productosRecibidos.find(prod => prod.id === id);
      const formEditar = document.forms['formEditar'];
      formEditar.idEditar.value = producto.id;
      formEditar.titulo.value = producto.nombre;
      formEditar.descripcion.value = producto.descripcion;
      formEditar.precio.value = producto.precio;
      document.getElementById('contFormEditar').style.display = 'block';
    });
};

document.forms['formEditar'].addEventListener('submit', (event) => {
  event.preventDefault();
  const formEditar = document.forms['formEditar'];
  const nuevosDatos = {
    id: formEditar.idEditar.value,
    titulo: formEditar.titulo.value,
    descripcion: formEditar.descripcion.value,
    precio: formEditar.precio.value
  };

  if (!nuevosDatos.titulo || !nuevosDatos.descripcion || !nuevosDatos.precio) {
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
    setTimeout(() => {
      location.reload();
    }, 1000);
  })
  .catch(err => mostrarMensaje('Error al actualizar el producto'));
});