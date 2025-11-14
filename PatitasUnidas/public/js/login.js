const barraSesion = document.getElementById("barraSesion");

let usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')) || null;

function actualizarBarraSesion() {
    if (!usuarioActual) {
        barraSesion.innerHTML = `<a href="/login">Iniciar sesión</a>`;
    } else {
        barraSesion.innerHTML = `
          <div class="perfil-mini">
            <a href="/perfil"><img src="../Fotos/huella.jpg" alt="Perfil" /></a>
            <span>${usuarioActual.nombre.split(" ")[0]}</span>
            <button onclick="cerrarSesion()">Cerrar sesión</button>
          </div>
        `;
    }
}

function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    usuarioActual = null;
    actualizarBarraSesion();
}

actualizarBarraSesion();

async function login(email, contraseña) {
    try {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({email, contraseña})
        });
        const data = await res.json();
        console.log(data);
        if(res.ok) {
            usuarioActual = data;
            localStorage.setItem('usuarioActual', JSON.stringify(data));
            actualizarBarraSesion();
            alert('Login exitoso!');
        } else {
            alert(data.error);
        }
    } catch(e) {
        alert('Error al conectar con el servidor');
    }
}

async function registrar(usuario) {
    try {
        const res = await fetch('http://localhost:3000/usuarios', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                email: usuario.email,
                contraseña: usuario.password,
                tipo_usuario: usuario.tipo,
                nombre_contacto: usuario.nombre,
                telefono: usuario.telefono
            })
        });
        const data = await res.json();
        console.log(data);
        if(res.ok) {
            alert('Usuario registrado correctamente!');
        } else {
            alert(data.error);
        }
    } catch(e) {
        alert('Error al conectar con el servidor');
    }
}

const formLogin = document.getElementById('form-login');
formLogin.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    login(email, password);
});

const formRegisterRescatista = document.getElementById('form-register-rescatista');
formRegisterRescatista.addEventListener('submit', e => {
    e.preventDefault();
    const usuario = {
        nombre: document.getElementById('resc-name').value,
        email: document.getElementById('resc-email').value,
        telefono: document.getElementById('resc-phone').value,
        tipo: 'rescatista',
        password: document.getElementById('resc-password').value
    };
    registrar(usuario);
});

const formRegisterFundacion = document.getElementById('form-register-fundacion');
formRegisterFundacion.addEventListener('submit', e => {
    e.preventDefault();
    const usuario = {
        nombre: document.getElementById('fund-name').value,
        email: document.getElementById('fund-email').value,
        telefono: document.getElementById('fund-phone').value,
        tipo: 'fundacion',
        password: document.getElementById('fund-password').value
    };
    registrar(usuario);
});
