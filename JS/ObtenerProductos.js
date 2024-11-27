fetch('./data/datos.json')
    .then(respuesta => {
        if (!respuesta.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        return respuesta.json();
    })
    .then(datos => {
        console.log(datos);
        mostrarProductos(datos.productos);
    })
    .catch(error => console.log('Error al cargar los productos:', error));

const mostrarProductos = (productos) => {
    if (!Array.isArray(productos)) {
        console.error('La variable "productos" no es un array:', productos);
        return;
    }
    
    let contenido = '';
    const contenedor = document.querySelector('#divProd');
    
    productos.forEach(producto => {
        contenido += 
        `<div class="card border border-1 border-dark d-flex flex-column align-items-center"
            style="width: 100%; max-width: 300px; margin:30px">
            <img src="${producto.imagen}" class="card-img-top" alt="...">
            <div class="card-body">
                <h4>${producto.titulo}</h4>
                <p class="card-text">${producto.descripcion}</p>
            </div>
            <p class="card-text border border-secondary rounded p-2"><strong>${producto.precio}</strong></p>
            <button class="btn btn-outline-success mt-auto mb-3" type="submit">Comprar</button>
        </div>`;
    });

    contenedor.innerHTML = contenido;
}