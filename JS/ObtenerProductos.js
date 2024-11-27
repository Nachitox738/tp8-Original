fetch('./JSON/datos.json')

    .then(respuesta => respuesta.json())
    // .then(datos=> console.log(datos))
    .then(datos => mostrarProductos(datos))

const mostrarProductos = (datos) => {
    let productos = ''
    const contenedor = document.querySelector('#divProd')
    datos.forEach(datos => {
        productos += 
        `<div class="card border border-1 border-dark d-flex flex-column align-items-center"
            style="width: 100%; max-width: 300px; margin:30px">
            <img src="${datos.imagen}" class="card-img-top" alt="...">
            <div class="card-body ">
                <h4>${datos.titulo}</h4>
                <p class="card-text ">${datos.descripcion}</p>

            </div>
                <p class="card-text border border-secondary rounded p-2"><strong>${datos.precio}</strong></p>
                <button class="btn btn-outline-success mt-auto mb-3" type="submit">Comprar</button>
        </div>
        `
    })
    contenedor.innerHTML = productos
}