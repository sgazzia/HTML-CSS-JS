function validarLogin(event) {
    event.preventDefault(); 

    const usuario = document.getElementById('login-usuario').value.trim();
    const contrasena = document.getElementById('login-contrasena').value.trim();
    
    const USUARIO_CORRECTO = "admin";
    const CONTRASENA_CORRECTA = "blabla3933";
    
    if (usuario === USUARIO_CORRECTO && contrasena === CONTRASENA_CORRECTA) {
        
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('contenido-principal').style.display = 'block';
        
        alert("¡Bienvenido, " + usuario + "! Acceso concedido.");

        return true; 
        
    } else {
        
        alert("Error de acceso: Usuario o Contraseña incorrectos.");
        
        document.getElementById('login-contrasena').value = '';
        
        return false;
    }
}