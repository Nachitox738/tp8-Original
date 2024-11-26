const cargarProductos = () => {
  const productos = JSON.parse(localStorage.getItem('productos')) || { productos: [] };
  const contenedor = document.querySelector("#productos");
  contenedor.innerHTML = ''; 

  productos.productos.forEach(producto => {
      const productoHtml = `
          <div class="col-12 col-md-4 col-lg-3 mb-4">
              <div class="card" style="width: 18rem;">
                  <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                  <div class="card-body">
                      <h5 class="card-title">${producto.nombre}</h5>
                      <p class="card-text">${producto.descripcion}</p>
                      <p class="card-text">$${producto.precio}</p>
                      <button class="btn btn-warning" onclick="editarProducto(${producto.id})">Editar</button>
                      <button class="btn btn-danger" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                  </div>
              </div>
          </div>
      `;
      contenedor.innerHTML += productoHtml;
  });
};

const mostrarMensaje = (mensaje) => {
  const divMensaje = document.querySelector("#mensajeConfirmacion");
  divMensaje.innerHTML = mensaje;
  setTimeout(() => {
      divMensaje.innerHTML = '';
  }, 2000);
};

const añadirProducto = (producto) => {
  const productos = JSON.parse(localStorage.getItem('productos')) || { productos: [] };
  const idNuevo = productos.productos.length ? productos.productos[productos.productos.length - 1].id + 1 : 1;
  producto.id = idNuevo;
  productos.productos.push(producto);
  localStorage.setItem('productos', JSON.stringify(productos));
  mostrarMensaje('Producto añadido');
  cargarProductos();
};

const editarProducto = (id) => {
  const productos = JSON.parse(localStorage.getItem('productos')) || { productos: [] };
  const producto = productos.productos.find(p => p.id === id);
  
  if (producto) {
      const formEditar = document.forms['formAñadir'];
      formEditar.titulo.value = producto.nombre;
      formEditar.descripcion.value = producto.descripcion;
      formEditar.precio.value = producto.precio;

      document.querySelector('#prodNuevo').style.display = 'block';
      formEditar.onsubmit = (e) => {
          e.preventDefault();
          const productoEditado = {
              nombre: formEditar.titulo.value,
              descripcion: formEditar.descripcion.value,
              precio: parseFloat(formEditar.precio.value),
          };

          const index = productos.productos.findIndex(p => p.id === id);
          if (index !== -1) {
              productos.productos[index] = { ...productos.productos[index], ...productoEditado };
              localStorage.setItem('productos', JSON.stringify(productos));
              mostrarMensaje('Producto actualizado');
              cargarProductos();
          }
      };
  }
};

const eliminarProducto = (id) => {
  const productos = JSON.parse(localStorage.getItem('productos')) || { productos: [] };
  const productosFiltrados = productos.productos.filter(p => p.id !== id);
  localStorage.setItem('productos', JSON.stringify({ productos: productosFiltrados }));
  mostrarMensaje('Producto eliminado');
  cargarProductos();
};

document.getElementById('añadir').addEventListener('click', () => {
  document.querySelector('#prodNuevo').style.display = 'block';
  document.forms['formAñadir'].onsubmit = (e) => {
      e.preventDefault();
      const form = e.target;
      const nuevoProducto = {
          nombre: form.titulo.value,
          descripcion: form.descripcion.value,
          precio: parseFloat(form.precio.value),
          imagen: './imagenes/default.jpg',  
      };
      añadirProducto(nuevoProducto);
      form.reset();
  };
});

document.addEventListener('DOMContentLoaded', cargarProductos);