// En caso de que el usuario se encuentre logeado en el localstorage
usuarioLogeado = JSON.parse(localStorage.getItem('usuario')) || {};
// Primero obtengo los datos del usuario y los guardo en una variable
const obtenerDatosInicioSesion = (event) => {
    event.preventDefault();
    const formulario = document.getElementById('loginForm');
    const usuario = formulario.username.value;
    const contrasena = formulario.password.value;

    console.log(usuario, contrasena);
    validarUsuarios(usuario, contrasena);
};

// Obtengo un elemento de html por su id y lo guardo en una variable para utilizarlo en un evento
const btnInicioSesion = document.getElementById('btnInicioSesion');
btnInicioSesion.addEventListener('click', obtenerDatosInicioSesion);

// En esta funcion utilizo los valores ingresados por el usuario y usando una promesa traigo los datos del json para compararlos
async function validarUsuarios(usuario, contrasena) {
    try {
        document.getElementById("loader").style.display = "block";
        await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await fetch('../json/usuarios.json');
        const data = await response.json();
        const usuariosObtenidos = data.usuarios;
        const usuarioEncontrado = usuariosObtenidos.find(user =>
            user.nombre_usuario === usuario && user.contrasena === contrasena
        );

        if (usuarioEncontrado && usuarioEncontrado.id === usuarioLogeado.id) {
            // Utilizando SweetAlert para mostrar un mensaje
            Swal.fire({
                title: 'El usuario ya está logeado',
                text: 'Serás redireccionado.',
                icon: 'info'
            }).then(() => {
                window.location.href = './pages/estadisticas.html';
            });
        } else {
            localStorage.removeItem('usuario');
            if (usuarioEncontrado) {
                // Utilizando SweetAlert para mostrar un mensaje
                Swal.fire({
                    title: 'Inicio de sesión exitoso',
                    text: '¡Bienvenido, ' + usuarioEncontrado.nombre_completo + '!',
                    icon: 'success'
                }).then(() => {
                    localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
                    window.location.href = './pages/estadisticas.html';
                });
            } else {
                // Utilizando SweetAlert para mostrar un mensaje
                Swal.fire({
                    title: 'Usuario o contraseña incorrectos',
                    icon: 'error'
                });
            }
        }
        document.getElementById("loader").style.display = "none";
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
    }
};

