let productos = '';
const contenedor = document.querySelector('#divProd');
const endpoint = './data/datos.json'; 

const obtenerDatos = async () => {
    try {
        const respuesta = await fetch(endpoint);
        
        if (!respuesta.ok) {
            throw new Error('Error al cargar los datos');
        }

        const productosRecibidos = await respuesta.json();
        
        if (!Array.isArray(productosRecibidos)) {
            throw new Error('Los datos recibidos no son un array');
        }

        productosRecibidos.forEach(prod => {
            productos += `
                <div class="card border border-1 border-dark d-flex flex-column align-items-center" style="width: 100%; max-width: 300px; margin:30px">
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
                </div>
            `;
        });
        
        contenedor.innerHTML = productos;

    } catch (error) {
        console.error(error);
        mostrarMensaje('Error al cargar productos');
    }
};

const mostrarMensaje = (mensaje) => {
    const contenedorMensaje = document.querySelector('#mensajeError');
    contenedorMensaje.textContent = mensaje;
    contenedorMensaje.style.display = 'block';
};

obtenerDatos();