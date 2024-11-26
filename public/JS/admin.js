const obtenerProductos = () => {
  const productosGuardados = localStorage.getItem('productos');
  return productosGuardados ? JSON.parse(productosGuardados) : [];
};

const guardarProductos = (productos) => {
  localStorage.setItem('productos', JSON.stringify(productos));
};

const agregarProducto = (nuevoProducto) => {
  const productos = obtenerProductos();
  nuevoProducto.id = productos.length + 1;  
  productos.push(nuevoProducto);
  guardarProductos(productos);
};

const eliminarProducto = (id) => {
  let productos = obtenerProductos();
  productos = productos.filter(producto => producto.id !== id);  
  guardarProductos(productos);
};

const editarProducto = (id, nuevosDatos) => {
  let productos = obtenerProductos();
  productos = productos.map(producto => 
    producto.id === id ? { ...producto, ...nuevosDatos } : producto
  );
  guardarProductos(productos);
};

const mostrarProductos = () => {
  const productos = obtenerProductos();
  let productosHTML = '';

  productos.forEach(prod => {
    productosHTML += `
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
            <button class="btn btn-outline-warning me-2" onClick="editar(${prod.id})">
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

  contenedor.innerHTML = productosHTML;
};

const eliminar = (id) => {
  if (confirm('¿Seguro que quieres eliminar este producto?')) {
    eliminarProducto(id);
    mostrarProductos();  
  }
};

const editar = (id) => {
  const productos = obtenerProductos();
  const producto = productos.find(prod => prod.id === id);

  document.querySelector('#idEditar').value = producto.id;
  document.querySelector('#tituloEditar').value = producto.nombre;
  document.querySelector('#descripcionEditar').value = producto.descripcion;
  document.querySelector('#precioEditar').value = producto.precio;
  document.querySelector('#imagenEditar').value = producto.imagen;
  document.querySelector('#formEditar').style.display = 'block';
};

document.querySelector('#formEditar').addEventListener('submit', (event) => {
  event.preventDefault();

  const id = parseInt(document.querySelector('#idEditar').value);
  const nuevosDatos = {
    nombre: document.querySelector('#tituloEditar').value,
    descripcion: document.querySelector('#descripcionEditar').value,
    precio: parseFloat(document.querySelector('#precioEditar').value),
    imagen: document.querySelector('#imagenEditar').value
  };

  if (!nuevosDatos.nombre || !nuevosDatos.descripcion || !nuevosDatos.precio || !nuevosDatos.imagen) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  editarProducto(id, nuevosDatos);
  mostrarProductos();  
  document.querySelector('#formEditar').style.display = 'none';  
});

document.querySelector('#formAñadir').addEventListener('submit', (event) => {
  event.preventDefault();

  const nuevoProducto = {
    nombre: document.querySelector('#titulo').value,
    descripcion: document.querySelector('#descripcion').value,
    precio: parseFloat(document.querySelector('#precio').value),
    imagen: document.querySelector('#imagen').value
  };

  if (!nuevoProducto.nombre || !nuevoProducto.descripcion || !nuevoProducto.precio || !nuevoProducto.imagen) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  agregarProducto(nuevoProducto);
  mostrarProductos(); 
  document.querySelector('#formAñadir').reset();  
});

mostrarProductos();