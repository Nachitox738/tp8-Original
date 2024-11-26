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
    formulario.style.display = formulario.style.display === 'none' || formulario.style.display === '' ? 'block' : 'none';
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
      fetch(endpoint + `/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => res.json())
      .then(response => {
        mostrarMensaje(response.Mensaje);
        setTimeout(() => location.reload(), 1000);
      })
      .catch(err => mostrarMensaje('Error al eliminar el producto'));
    }
  };

  const editar = (id) => {
    fetch(endpoint)
      .then(res => res.json())
      .then(datos => {
        const producto = datos.productos.find(prod => prod.id === id);
        const formEditar = document.querySelector('#formEditar');
        
        formEditar.querySelector('[name="idEditar"]').value = producto.id;
        formEditar.querySelector('[name="nombre"]').value = producto.nombre;
        formEditar.querySelector('[name="descripcion"]').value = producto.descripcion;
        formEditar.querySelector('[name="precio"]').value = producto.precio;
        
        document.getElementById('contFormEditar').style.display = 'block';
      });
  };

  document.forms['formEditar'].addEventListener('submit', (event) => {
    event.preventDefault();
    const formEditar = document.forms['formEditar'];
    const nuevosDatos = {
      id: formEditar.idEditar.value,
      nombre: formEditar.nombre.value,
      descripcion: formEditar.descripcion.value,
      precio: formEditar.precio.value
    };

    if (!nuevosDatos.nombre || !nuevosDatos.descripcion || !nuevosDatos.precio) {
      document.querySelector('#mensajeEditar').innerHTML = '*Complete todos los datos';
      return;
    }
    document.querySelector('#mensajeEditar').innerHTML = '';

    fetch(endpoint + '/productos/' + nuevosDatos.id, {
      method: 'PUT',
      body: JSON.stringify(nuevosDatos),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(response => {
      mostrarMensaje(response.mensaje);
      setTimeout(() => location.reload(), 1000);
    })
    .catch(err => mostrarMensaje('Error al actualizar el producto'));
  });

  document.getElementById('formAñadir').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const form = event.target;
    const nuevoProducto = {
      nombre: form.nombre.value,
      descripcion: form.descripcion.value,
      precio: form.precio.value,
      imagen: 'https://picsum.photos/200/300?random=1' 
    };

    if (!nuevoProducto.nombre || !nuevoProducto.descripcion || !nuevoProducto.precio) {
      document.querySelector('#mensaje').textContent = 'Por favor, complete todos los campos.';
      return;
    }

    fetch(endpoint + '/productos', {
      method: 'POST',
      body: JSON.stringify(nuevoProducto),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(response => {
      mostrarMensaje('Producto añadido correctamente');
      obtenerDatos();
      form.reset();
      formulario.style.display = 'none';
    })
    .catch(err => {
      mostrarMensaje('Error al añadir el producto');
    });
  });

  obtenerDatos();
});
