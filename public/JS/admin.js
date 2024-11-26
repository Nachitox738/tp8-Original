const obtenerProductos = () => {
  const productosGuardados = localStorage.getItem('productos');
    if (!productosGuardados) {
    return [];
  }

  try {
    const productos = JSON.parse(productosGuardados);

    if (Array.isArray(productos)) {
      return productos;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al parsear los productos desde el localStorage", error);
    return [];
  }
};

const guardarProductos = (productos) => {
  localStorage.setItem('productos', JSON.stringify(productos));
};

const mostrarProductos = () => {
  const productos = obtenerProductos();

  if (!Array.isArray(productos)) {
    console.error("Los productos no son un arreglo válido");
    return;
  }

  let productosHTML = '';

  productos.forEach(prod => {
    productosHTML += `
      <div class="col-md-4 mb-3">
        <div class="card border border-1 border-dark">
          <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}">
          <div class="card-body">
            <h5 class="card-title">${prod.nombre}</h5>
            <p class="card-text">${prod.descripcion}</p>
            <p class="card-text"><strong>$${prod.precio}</strong></p>
          </div>
          <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-outline-warning" onClick="editar(${prod.id})">
              <i class="bi bi-pencil"></i> Editar
            </button>
            <button class="btn btn-outline-danger" onClick="eliminar(${prod.id})">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById('contenedor').innerHTML = productosHTML;
};
document.getElementById('formAñadir').addEventListener('submit', function (event) {
  event.preventDefault();

  const nuevoProducto = {
    id: Date.now(), 
    nombre: event.target.titulo.value,
    descripcion: event.target.descripcion.value,
    precio: parseFloat(event.target.precio.value),
    imagen: event.target.imagen.value
  };

  if (!nuevoProducto.nombre || !nuevoProducto.descripcion || !nuevoProducto.precio || !nuevoProducto.imagen) {
    alert("Por favor, complete todos los campos.");
    return;
  }

  const productos = obtenerProductos();

  productos.push(nuevoProducto);

  guardarProductos(productos);

  event.target.reset();
  document.getElementById('prodNuevo').style.display = 'none';

  mostrarProductos();
});

const eliminar = (id) => {
  const productos = obtenerProductos();
  const productosActualizados = productos.filter(prod => prod.id !== id);

  guardarProductos(productosActualizados);

  mostrarProductos();
};

const editar = (id) => {
  const productos = obtenerProductos();
  const producto = productos.find(prod => prod.id === id);

  if (producto) {
    document.querySelector('[name="titulo"]').value = producto.nombre;
    document.querySelector('[name="descripcion"]').value = producto.descripcion;
    document.querySelector('[name="precio"]').value = producto.precio;
    document.querySelector('[name="imagen"]').value = producto.imagen;

    document.getElementById('formAñadir').addEventListener('submit', function (event) {
      event.preventDefault();
      
      producto.nombre = event.target.titulo.value;
      producto.descripcion = event.target.descripcion.value;
      producto.precio = parseFloat(event.target.precio.value);
      producto.imagen = event.target.imagen.value;

      const productos = obtenerProductos();
      const index = productos.findIndex(prod => prod.id === id);
      productos[index] = producto;

      guardarProductos(productos);

      event.target.reset();
      document.getElementById('prodNuevo').style.display = 'none';

      mostrarProductos();
    });
  }
};

document.getElementById('añadir').addEventListener('click', function () {
  const formulario = document.getElementById('prodNuevo');
  formulario.style.display = formulario.style.display === 'none' || formulario.style.display === '' ? 'block' : 'none';
});

mostrarProductos();