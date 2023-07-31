usuarioLogeado = JSON.parse(localStorage.getItem('usuario')) || {};
let usuariosCopia = null;
let usuariosOrdenados = null
obtenerUsuarios();

async function obtenerUsuarios() {
    urlUsuarios = '../json/usuarios.json'
    try {
        const response = await fetch(urlUsuarios)

        if (!response.ok) {
            
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        mostrarUsuarios(data)
    } catch (error) {        
        Swal.fire({
            title: 'Error de comunicación',
            text: 'No se pudieron obtener los datos',
            icon: 'error'
        });
    }
};
const mostrarUsuarios = (usuarios) => {
    usuariosCopia = usuarios.usuarios.slice()
    usuariosOrdenados = usuariosCopia.sort((a, b) => b.puntos - a.puntos);

    const container = document.querySelector("#tabla");

    container.innerHTML = "";
    usuariosOrdenados.forEach((usuario, index) => {
        const div = document.createElement('div');

        div.innerHTML = `
        <div class="tarjeta puntaje">
        <span>${index + 1}</span>
        <span>${usuario.nombre_completo}</span>
        <span class="ptsUser">${usuario.puntos} Pts.</span>        
        </div>     
        `;
        container.appendChild(div);
        const primerPuesto = div.querySelector('.tarjeta.puntaje');
        if (index === 0) {
            primerPuesto.style.backgroundColor = "gold";
        } else if (index === 1) {
            primerPuesto.style.backgroundColor = "greenyellow";
        } else if (index === 2) {
            primerPuesto.style.backgroundColor = "green";
        }
    });
}
obtenerPronosticos();

async function obtenerPronosticos() {
    urlPronosticos = '../json/prode.json'
    try {
        const response = await fetch(urlPronosticos)

        if (!response.ok) {
            
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        mostrarProde(data)
    } catch (error) {
       
        Swal.fire({
            title: 'Error de comunicación',
            text: 'No se pudieron obtener los datos',
            icon: 'error'
        });
    }
};


const mostrarProde = (data) => {
    const prodeCopia = data.fecha_prode.slice()
    const container = document.querySelector("#container");

    prodeCopia.forEach(partido => {
        const div = document.createElement('div');
        div.innerHTML = `
      <div class='tarjeta'>
        <span class='fechaPartido'> ${partido.fechaPartido}</span>
        <span class='pts'></span>
        <div class='equipo Local'>
          <figure class='datosEquipo'>
            <img class='imgEquipo' alt="">
            <figcaption>${partido.equipoLocal}</figcaption>
          </figure>
        </div>
        <div class='pronostico'>
          <div class='marcador Local'>
            <button class='button'>+</button>
            <span class='marcLocal'>${partido.pronosticoLocal}</span>
            <button class='button'>-</button>
          </div>
          <div class='marcador Visitante'>
            <button class='button'>+</button>
            <span class='marcVisitante'>${partido.pronosticoVisitante}</span>
            <button class='button'>-</button>
          </div>
        </div>
        <div class='resultado'> 
          <div>
            <div>Resultado:</div>
            <span class='resLocal'>${partido.marcadorLocal}</span>
            <span>-</span>
            <span class='resVisit'>${partido.marcadorVisitante}</span>
          </div>          
          <div>
            <div>Tu Pronostico:</div>
            <span class='pronosticoLocal'></span>
            <span>-</span>
            <span class='pronosticoVisitante'></span>
          </div>          
        </div>
        <div class='equipo Visitante'>
          <figure class='datosEquipo'>
            <img class='imgEquipo' alt="">
            <figcaption>${partido.equipoVisitante}</figcaption>
          </figure>
        </div>
        <span class='description'>Resultado Final ${partido.marcadorLocal} - ${partido.marcadorVisitante}</span>
      </div>
    `;
        container.appendChild(div);
        const incrementarMarcador = div.querySelectorAll('.marcador .button:first-child');
        const disminuirMarcador = div.querySelectorAll('.marcador .button:last-child');

        incrementarMarcador.forEach(button => {
            button.addEventListener('click', () => {
                const span = button.nextElementSibling;
                let valor = parseInt(span.textContent);
                if (span.textContent === '-') {
                    valor = 0;
                } else {
                    valor++;
                }
                span.textContent = valor;
            });
        });

        disminuirMarcador.forEach(button => {
            button.addEventListener('click', () => {
                const span = button.previousElementSibling;
                let valor = parseInt(span.textContent);
                if (valor >= 0) {
                    valor--;
                    if (valor === -1) {
                        span.textContent = '-';
                    } else {
                        span.textContent = valor;
                    }
                }
            });
        });
    });
    const btnGuardar = document.querySelector("#guardarPronostico");

    btnGuardar.addEventListener('click', () => {
        prodeCopia.forEach((partido, index) => {
            const tarjeta = container.children[index];
            const marcadorLocal = parseInt(tarjeta.querySelector('.marcLocal').textContent);
            const marcadorVisitante = parseInt(tarjeta.querySelector('.marcVisitante').textContent);
            const pronosticoLocalSpan = tarjeta.querySelector('.pronosticoLocal');
            const pronosticoVisitanteSpan = tarjeta.querySelector('.pronosticoVisitante');

            
            partido.pronosticoLocal = marcadorLocal;
            partido.pronosticoVisitante = marcadorVisitante;
            
            pronosticoLocalSpan.textContent = isNaN(marcadorLocal) ? '' : marcadorLocal;
            pronosticoVisitanteSpan.textContent = isNaN(marcadorVisitante) ? '' : marcadorVisitante;
        });
        usuarioLogeado.puntos = 0 //TEMPORAL PARA QUE NO ACUMULE AL MOMENTO DE PROBAR, DESPUES IRA SUMANDO HASTA EL FINAL DEL TORNEO
        let puntos = 0;

        prodeCopia.forEach((partido, index) => {
            const tarjeta = container.children[index];
            const spanPts = tarjeta.querySelector('.pts');
            const pronosticoLocal = partido.pronosticoLocal;
            const pronosticoVisitante = partido.pronosticoVisitante;
            const resultado = tarjeta.querySelector('.resultado');
            const pronostico = tarjeta.querySelector('.pronostico');
            resultado.style.visibility = 'visible';
            pronostico.style.visibility = 'hidden'

            // Verificar si los pronósticos son numéricos
            if (!isNaN(pronosticoLocal) && !isNaN(pronosticoVisitante)) {
                // Convierto los pronósticos a números
                const pronosticoLocalNum = parseInt(pronosticoLocal);
                const pronosticoVisitanteNum = parseInt(pronosticoVisitante);

                if (
                    pronosticoLocalNum === partido.marcadorLocal &&
                    pronosticoVisitanteNum === partido.marcadorVisitante
                ) {
                    spanPts.textContent = '3Pts';
                    puntos += 3;
                } else if (
                    (pronosticoLocalNum > pronosticoVisitanteNum &&
                        partido.marcadorLocal > partido.marcadorVisitante) ||
                    (pronosticoLocalNum < pronosticoVisitanteNum &&
                        partido.marcadorLocal < partido.marcadorVisitante) ||
                    (pronosticoLocalNum === pronosticoVisitanteNum &&
                        partido.marcadorLocal === partido.marcadorVisitante)
                ) {
                    spanPts.textContent = '1Pt';
                    puntos += 1;
                } else {
                    spanPts.textContent = '0Pts';
                    puntos += 0;
                }
            } else {
                // Pronóstico no numérico
                spanPts.textContent = '0Pts';
                puntos += 0;
            }
        });
        usuarioLogeado.puntos += puntos;
        const usuarioIndex = usuariosCopia.findIndex(user => user.id === usuarioLogeado.id);
        if (usuarioIndex !== -1) {
            usuariosCopia[usuarioIndex].puntos += puntos;
        }
        mostrarUsuariosEnTabla(usuariosCopia);
    });
    function mostrarUsuariosEnTabla(usuariosCopia) {
        const container = document.querySelector("#tabla");
        container.innerHTML = "";
        usuariosOrdenados = usuariosCopia.sort((a, b) => b.puntos - a.puntos)
        usuariosOrdenados.forEach((usuario, index) => {
            const div = document.createElement("div");

            div.innerHTML = `
            <div class="tarjeta puntaje">
                <span>${index + 1}</span>
                <span>${usuario.nombre_completo}</span>
                <span class="ptsUser">${usuario.puntos} Pts.</span>
            </div>
        `;

            container.appendChild(div);

            const primerPuesto = div.querySelector(".tarjeta.puntaje");
            if (index === 0) {
                primerPuesto.style.backgroundColor = "gold";
            } else if (index === 1) {
                primerPuesto.style.backgroundColor = "greenyellow";
            } else if (index === 2) {
                primerPuesto.style.backgroundColor = "green";
            }
        });
    }
    const btnHabilitarPronostico = document.getElementById('btnHabilitarPronostico');

    btnHabilitarPronostico.addEventListener('click', () => {
        prodeCopia.forEach((partido, index) => {
            const tarjeta = container.children[index];
            const resultado = tarjeta.querySelector('.resultado');
            const pronostico = tarjeta.querySelector('.pronostico');
            resultado.style.visibility = 'hidden';
            pronostico.style.visibility = 'visible';
        });
    });

}



