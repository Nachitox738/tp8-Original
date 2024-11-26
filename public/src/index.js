
import { navbar } from './navbar.js';
import { footer } from './footer.js';
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#contenedornav').innerHTML = navbar;
    document.querySelector('#contenedorfooter').innerHTML = footer;

    let botonIngresar = document.querySelector('#botonIngresar');
    let usuarioDropdown = document.querySelector('#salir');
    let botonLogOut = document.querySelector('#botonLogOut');

    botonIngresar.addEventListener('click', () => {
        botonIngresar.style.display = "none";
        usuarioDropdown.style.display = "block";
        botonLogOut.style.display = "block"; 
    });
    botonLogOut.addEventListener('click', () => {
        botonIngresar.style.display = "block";
        usuarioDropdown.style.display = "none";
        botonLogOut.style.display = "none";  
    });
});