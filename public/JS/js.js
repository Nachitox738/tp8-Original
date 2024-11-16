var botonIngresar = document.getElementById('botonIngresar');
var usuarioDropdown = document.querySelector('#salir');
var botonLogOut = document.getElementById('botonLogOut');

const botonIngre = () =>{
    botonIngresar.style.display = "none";
    usuarioDropdown.style.display = "block";
}
const logOut = () =>{
    botonIngresar.style.display = "block";
    usuarioDropdown.style.display = "none";
}