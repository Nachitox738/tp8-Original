const endpoint = './JSON/datos.json'
mostrarMensaje = (mensaje) => {
  document.querySelector('#divMensaje').innerHTML = mensaje;
}

let form=document.querySelector('#prodNuevo')
form.style.display= 'none';
let añadir=document.querySelector('#añadir')

  añadir.addEventListener('click', ()=>{
    
    form.style.display = "block";
  });
document.getElementById('añadir').addEventListener('click', function () {
  const formulario = document.getElementById('prodNuevo');
  formulario.classList.toggle('new');
});



fetch(endpoint)
  .then(respuesta => respuesta.json())
  .then(datos => obtenerDatos(datos))

let productos = ''
const contenedor = document.querySelector('#divProdNuevo')

const obtenerDatos = async () => {
  try {
    let productos = ''
    const contenedor = document.querySelector('#divProd')
    datos.forEach(datos => {
        productos += 
        `<div class="card border border-1 border-dark d-flex flex-column bg-dark text-light align-items-center"
                  style="width: 100%; max-width: 300px; margin:30px">
                  <img src="${datos.imagen}" class="card-img-top" alt="...">
                  <div class="card-body ">
                      <h4>${datos.titulo}</h4>
                      <p class="card-text ">${datos.descripcion}</p>
                  </div>
      <div class="d-flex justify-content-between align-items-center w-100 mb-2 px-2">
        <p class="card-text border border-secondary rounded p-2 mb-0">
          <strong>${datos.precio}</strong>
        </p>
        <div class="d-flex ms-auto">
          <a href="#prodEditar" class="btn btn-outline-warning me-2 edit" onClick="editar(${datos.id})">
            <i class="bi bi-pencil"></i>
          </a>
          
          <a class="btn btn-outline-danger" type="submit" id="eliminar" onClick="eliminar(${datos.id})">
            <i class="bi bi-trash" id="eliminar"></i>
          </a>
        </div>
      </div>
      
      
              </div>`

    })
    contenedor.innerHTML = productos
  } catch (error) {
    console.log(error)
    mostrarMensaje('error al cargar productos')
  }
}

