fetch('./JSON/datos.json')
    .then(respuesta => respuesta.json())
    .then(datos => {
        mostrarProductos(datos);
    })
    .catch(error => console.log("Error al cargar el JSON: ", error)); 

const mostrarProductos = (datos) => {
    let productos = '';
    const contenedor = document.querySelector('#divProd');
    datos.forEach(producto => {
        productos += 
        `<div class="card border border-1 border-dark d-flex flex-column align-items-center"
            style="width: 100%; max-width: 300px; margin:30px">
            <img src="${producto.imagen}" class="card-img-top" alt="...">
            <div class="card-body">
                <h4>${producto.nombre}</h4> <!-- Cambié "titulo" por "nombre" como en el JSON -->
                <p class="card-text">${producto.descripcion}</p>
            </div>
            <p class="card-text border border-secondary rounded p-2"><strong>$${producto.precio || '0.00'}</strong></p>
            <button class="btn btn-outline-success mt-auto mb-3" type="submit">Comprar</button>
        </div>`;
    });
    contenedor.innerHTML = productos;
};