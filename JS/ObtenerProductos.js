fetch('./data/datos.json')
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
                `<div class="card border border-1 border-dark d-flex flex-column align-items-center" style="width: 100%; max-width: 300px; margin:30px">
                    <img src="${prod.imagen}" class="card-img-top" alt="...">
                    <div class="card-body ">
                        <h4>${prod.titulo}</h4>
                        <p class="card-text ">${prod.descripcion}</p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center w-100 mb-2 px-2">
                        <p class="card-text border border-secondary rounded p-2 mb-0">
                          <strong>${prod.precio}</strong>
                        </p>
                    </div>      
                </div>`

        })
        contenedor.innerHTML = productos
    } catch (error) {
        mostrarMensaje('error al cargar productos')
    }
}
