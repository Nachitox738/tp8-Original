fetch ('./JSON/datos.json')
.then (respuesta=>respuesta.json())
//.then(datos=>console.log(datos))
.then(datos=>mostrarProductos(datos))
const mostrarProductos = (datos) => {
    let productos=''
    const contenedor = document.querySelector('#contenedor')
    datos.forEach(dato => {
        productos+=`
        <div class="card me-3 mt-3" style="width: 100%; max-width: 250px;">
              <img src="${dato.imagen}" class="card-img-top" style="height: 300px; width: 240px;" alt="...">
              <div class="card-body">
                <h5 class="card-title">${dato.nombre}</h5>
                <p class="card-text">${dato.descripcion}</p>
                <div style="margin-left:20px;">
                  <a href="#" class="btn btn-primary m-auto"style="width: 170px;">Comprar</a>
                </div>
                </div>
            </div>`
    });
    contenedor.innerHTML = productos
}