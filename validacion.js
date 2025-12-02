
// --- 1. FUNCIÓN PARA LOGIN (INGRESO) ---
function IngresoUsuario() {
    let inputNombre = document.getElementById("nombreUsuario");
    let inputContrasenia = document.getElementById("contraseniauser");
    let divResultado = document.getElementById("resultado");

    let nombre = inputNombre.value.trim(); 
    let contrasenia = inputContrasenia.value;

    // Validación simple
    if (nombre === "") {
        alert("Por favor, escribe un nombre.");
        return;
    }
    if (contrasenia === "") {
        alert("Por favor, ingresa tu contraseña.");
        return;
    }

    // Enviar a Python
    fetch('/procesar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "nombreUsuario": nombre,
            "contraseniaUsuario": contrasenia
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Python respondió:", data);
        divResultado.innerText = data.mensaje;
        
        // Limpieza de los valores en pantalla
        inputNombre.value = "";
        inputContrasenia.value = ""; 
    })
    .catch(error => {
        console.error('Error:', error);
        divResultado.innerText = "Error de conexión.";
        divResultado.style.color = "red";
    });
}

// --- 2. FUNCIÓN PARA REGISTRO (ALTA) ---
// IMPORTANTE: Recibimos 'event' para detener la recarga
function RegistroUsuario(event) {
    
    // EVITAR RECARGA DE PÁGINA
    event.preventDefault();

    // Obtener elementos de la pagina en la que se encuentra, es decir dentro de registro.html
    let nombreEl = document.getElementById("nombreUsuario");
    let apellidoPEl = document.getElementById("apellidoPaterno");
    let apellidoMEl = document.getElementById("apellidoMaterno");
    let passEl = document.getElementById("contraseniaRegistro"); 
    let passConfirmEl = document.getElementById("contraseniaConfirmar");

    // Obtener valores limpios
    const nombreVal = nombreEl.value.trim();
    const apellidoPVal = apellidoPEl.value.trim();
    const apellidoMVal = apellidoMEl.value.trim();
    const passVal = passEl ? passEl.value : "";
    const passConfirmVal = passConfirmEl ? passConfirmEl.value : "";

    // Validaciones Nombre y Apellidos
    if (nombreVal.length > 20 || nombreVal.length < 3) {
        alert("El nombre debe tener entre 3 y 20 caracteres");
        return;
    }
    if (apellidoPVal.length > 20 || apellidoPVal.length < 3) {
        alert("El Apellido Paterno debe tener entre 3 y 20 caracteres");
        return;
    }
    if (apellidoMVal.length > 20 || apellidoMVal.length < 3) {
        alert("El Apellido Materno debe tener entre 3 y 20 caracteres");
        return;
    }

    // Validaciones de Contraseña
    if (!securityPass(passVal)) {
        alert("La contraseña debe tener 8 caracteres, mayúscula, minúscula y número.");
        return;
    }

    if (passVal !== passConfirmVal) {
        alert("Las contraseñas no coinciden.");
        return;
    }

   //Debug en devTools (Esto va a cambiar cuando este la base de datos)
    console.log("Datos válidos, enviando a backend...");
    
    fetch('/crear_usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "nombreUsuario": nombreVal,
            "apellidoPaterno": apellidoPVal,
            "apellidoMaterno": apellidoMVal,
            "password": passVal
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Servidor dice:", data);
        if(data.status === 'ok') {
            alert(data.mensaje);
        } else {
            alert("Error: " + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al registrar el usuario.');
    });
}

// --- 3. VALIDACIÓN VISUAL EN TIEMPO REAL se hace desde el DOM ---
document.addEventListener('DOMContentLoaded', function() {
    
    const inputPass = document.getElementById('contraseniaRegistro');
    
    // Si no existe el input, salimos
    if (!inputPass) return; 

    const requirements = {
        length: document.getElementById('req-length'), //Requerimientos de al menos un tamaño de la cadena
        uppercase: document.getElementById('req-uppercase'), //Al menos una letra mayúscula
        lowercase: document.getElementById('req-lowercase'), //Al menos una letra minúscula
        number: document.getElementById('req-number') //Ingrear al menos un número
    };

    const patterns = {
        length: /.{8,}/,
        uppercase: /[A-Z]/,
        lowercase: /[a-z]/,
        number: /[0-9]/
    };

    // Escuchar tipeo
    inputPass.addEventListener('input', function(e) {
        const value = e.target.value;

        validarRequerimientosContrasenia(value, patterns.length, requirements.length);
        validarRequerimientosContrasenia(value, patterns.uppercase, requirements.uppercase);
        validarRequerimientosContrasenia(value, patterns.lowercase, requirements.lowercase);
        validarRequerimientosContrasenia(value, patterns.number, requirements.number);
    });

    function validarRequerimientosContrasenia(value, regex, element) {
        if (regex.test(value)) {
            element.classList.remove('invalido');
            element.classList.add('valido');
            if (element.innerText.includes("•")) {
                element.innerText = "✓ " + element.innerText.substring(2);
            }
        } else {
            element.classList.remove('valido');
            element.classList.add('invalido');
            if (element.innerText.includes("✓")) {
                element.innerText = "• " + element.innerText.substring(2);
            }
        }
    }
});

// --- 4. FUNCIÓN HELPER DE REGEX ---
function securityPass(clave) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(clave);
}