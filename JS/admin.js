// Definir la función obtenerDatos primero
const obtenerDatos = async (datos) => {
  try {
    // No es necesario volver a hacer fetch si ya pasamos los datos
    productos = '';  // Resetear la variable productos antes de agregar los nuevos productos
    datos.forEach(prod => {
      productos +=
        `<div class="card border border-1 border-dark d-flex flex-column align-items-center"
                  style="width: 100%; max-width: 300px; margin:30px">
                  <img src="${prod.imagen}" class="card-img-top" alt="...">
                  <div class="card-body ">
                      <h4>${prod.titulo}</h4>
                      <p class="card-text ">${prod.descripcion}</p>
                  </div>
      <div class="d-flex justify-content-between align-items-center w-100 mb-2 px-2">
        <p class="card-text border border-secondary rounded p-2 mb-0">
          <strong>${prod.precio}</strong>
        </p>
        <div class="d-flex ms-auto">
          <a href="#prodEditar" class="btn btn-outline-warning me-2 edit" onClick="editar(${prod.id})">
            <i class="bi bi-pencil"></i>
          </a>
          
          <a class="btn btn-outline-danger" type="submit" id="eliminar" onClick="eliminar(${prod.id})">
            <i class="bi bi-trash" id="eliminar"></i>
          </a>
        </div>
      </div>
      
      
              </div>`;
    });
    const contenedor = document.querySelector('#divProd');
    contenedor.innerHTML = productos;
  } catch (error) {
    mostrarMensaje('Error al cargar productos');
  }
}

const endpoint = './JSON/datos.json';

fetch(endpoint)
  .then(respuesta => respuesta.json())
  .then(datos => obtenerDatos(datos.productos)) 
  .catch(error => {
    mostrarMensaje('Error al cargar los datos');
  });
