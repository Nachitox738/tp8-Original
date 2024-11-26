const endpoint = './index.js'

mostrarMensaje = (mensaje) => {
  document.querySelector('#divMensaje').innerHTML = mensaje;
}

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
    const respuesta = await fetch(endpoint)
    productosRecibidos = await respuesta.json()
    productosRecibidos.forEach(prod => {
      productos +=
        `<div class="card border border-1 border-dark d-flex flex-column align-items-center"
                  style="width: 100%; max-width: 300px; margin:30px">
                  <img src="fotos/${prod.imagen}" class="card-img-top" alt="...">
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
      
      
              </div>`

    })
    contenedor.innerHTML = productos
  } catch (error) {
    mostrarMensaje('error al cargar productos')
  }
}

const formulario = document.forms['formAñadir']
console.log(formulario)
formulario.addEventListener('submit', (event) => {
  event.preventDefault();
  let titulo = formulario.titulo.value
  let descripcion = formulario.descripcion.value
  let precio = formulario.precio.value
  let imagen = formulario.titulo.value + ".jpg";

  let newDatos = { titulo: titulo, descripcion: descripcion, precio: precio, imagen: imagen }


  if (!newDatos.titulo || !newDatos.descripcion || !newDatos.precio) {
    document.querySelector('#mensaje').innerHTML = '*Complete todos los datos'
    return
  }
  document.querySelector('#mensaje').innerHTML = ''



  let nuevosDatosJson = JSON.stringify(newDatos)
  console.log(nuevosDatosJson)
  const enviarNewProducto = async () => {
    try {
      const enviarDatos = await fetch(endpoint, {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: nuevosDatosJson
      })

      const respuesta = await enviarDatos.json()
      console.log(respuesta)
      let mensaje = document.querySelector('#divMensaje');
      mensaje.className += 'bg-warning';
      mensaje.innerHTML = respuesta.mensaje;

      document.querySelector('#formAñadir').style.display = 'none';

      mostrarMensaje(respuesta.mensaje)

      setTimeout(() => {
        location.reload();
      }, 1000);

    }
    catch (error) {
      console.log(error)
    }
  }
  enviarNewProducto()
})

const eliminar = (id) => {
  if (confirm('posta queres eliminar?')) {
    const eliminarProd = async () => {
      try {
        const res = await fetch(endpoint + '/' + id, {
          method: 'delete'
        })
        const respuesta = await res.json()
        console.log(respuesta)
        mostrarMensaje(respuesta.mensaje)
      } catch (error) {
        mostrarMensaje('error al borrar')
      }
      setTimeout(()=>{location.reload();}, 1000)
    }
    eliminarProd();
  }
}


const formEditar = document.forms['formEditar']

const editar = (id) => {

  console.log(id)


  let prodEditar = {}


  productosRecibidos.filter(prod => { 
    if (prod.id == id) {
      prodEditar = prod
    }


  })


  formEditar.idEditar.value = prodEditar.id;
  formEditar.titulo.value = prodEditar.titulo;
  formEditar.descripcion.value = prodEditar.descripcion;
  formEditar.precio.value = prodEditar.precio;
}

formEditar.addEventListener('submit', (event) => {

  event.preventDefault();

  const nuevosDatos = {
    id: formEditar.idEditar.value,
    titulo: formEditar.titulo.value,
    descripcion: formEditar.descripcion.value,
    precio: formEditar.precio.value
  }

  if (!nuevosDatos.titulo || !nuevosDatos.descripcion || !nuevosDatos.precio) {
    document.querySelector('#mensajeEditar').innerHTML = '*Complete todos los datos'
    return
  }
  document.querySelector('#mensaje').innerHTML = ''


  let nuevosDatosJson = JSON.stringify(nuevosDatos)
  const enviarNewDatos = async()=>{
    try{
      const enviarDatos = await fetch(endpoint+'/'+nuevosDatos.id, {
        method: 'put',
        headers: {
          'content-type': 'application/json'
        },
        body: nuevosDatosJson
      })
      const respuesta= await enviarDatos.json()
      console.log(respuesta)
      mostrarMensaje(respuesta.mensaje)
    }catch(error){
      mostrarMensaje('error al verificar datos')
    }
    setTimeout(()=>{location.reload();}, 1000)
  }
  enviarNewDatos()
})