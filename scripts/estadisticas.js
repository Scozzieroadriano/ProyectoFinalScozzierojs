actualizarDatos();
async function datosTabla() {
    let urlJSON = '../json/tablaPosiciones.json';
    try {
        const response = await fetch(urlJSON)
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        mostrarEquipos(data)
    } catch (error) {
        Swal.fire({
            title: 'Error de comunicación',
            text: 'No se pudieron obtener los datos',
            icon: 'error'
        });
    };
};
const mostrarEquipos = (dato) => {
    
    const equiposCopia = dato.tabla_posiciones.slice();
    equiposOrdenados = equiposCopia.sort((a, b) => b.puntos - a.puntos);
    let cuerpoTabla = '';
    for (let i = 0; i < equiposOrdenados.length; i++) {
        cuerpoTabla += `
            <tr>
                <td>${[i + 1]}</td>
                <td>${equiposOrdenados[i].nombre_corto}</td>
                <td>${equiposOrdenados[i].puntos}</td>        
                <td>${equiposOrdenados[i].partidos_jugados}</td>        
                <td>${equiposOrdenados[i].partidos_ganados}</td>        
                <td>${equiposOrdenados[i].partidos_empatados}</td>        
                <td>${equiposOrdenados[i].partidos_perdidos}</td>        
                <td>${equiposOrdenados[i].goles_favor}</td>        
                <td>${equiposOrdenados[i].goles_contra}</td>        
                <td>${equiposOrdenados[i].diferencia_goles}</td>        
            </tr>`;
    }
    posicion = document.getElementById('dataTable')
    posicion.innerHTML = cuerpoTabla;
};
datosTabla();
const btnfechaAnt = document.getElementById('fechaAnt');
const btnfechaSig = document.getElementById('fechaSig');

btnfechaAnt.addEventListener('click', restarFecha);
btnfechaSig.addEventListener('click', sumarFecha);

let fecha = 1;
function restarFecha() {
    if (fecha > 1) {
        fecha--;
        actualizarDatos();
    }
}

function sumarFecha() {
    fecha++;
    actualizarDatos();
}

async function actualizarDatos() {
    let urlFechas = ('../json/fechas.json')
    try {
        const response = await fetch(urlFechas);
        const data = await response.json();
        const cantidadFechas = Object.keys(data.partidos_simulados).length;

        if (fecha <= cantidadFechas) {
            let fechaPartidos = data.partidos_simulados[`fecha_${fecha}`];

            if (fechaPartidos) {
                const tituloTabla = document.querySelector(".tituloPartidos");
                tituloTabla.textContent = `PARTIDOS FECHA ${fecha}`;
                mostrarFechas(fechaPartidos);
            } else {
                
                Swal.fire({
                    title: `La fecha ${fecha} no existe en el JSON.`,
                    icon: 'error'
                }).then(() => {
                    fecha = cantidadFechas;
                });
            }
        } else {
            
            Swal.fire({
                title: `La fecha ${fecha} no existe en el JSON.`,
                icon: 'error'
            }).then(() => {
                fecha = cantidadFechas;
            });
        }
    } catch (error) {
       
        console.error('Error al obtener los datos:', error);
        Swal.fire({
            title: 'Error al obtener los datos',
            text: 'Ha ocurrido un error al cargar los datos',
            icon: 'error'
        });
        throw error;
    }
}
function mostrarFechas(numFecha) {
    let cuerpoTabla = '';
    for (let i = 0; i < numFecha.length; i++) {
        cuerpoTabla += `
        <tr>
            <td>FINAL</td>
            <td>${numFecha[i].equipo_local}</td>
            <td>${numFecha[i].goles_local}</td>        
            <td>${numFecha[i].goles_visitante}</td>        
            <td>${numFecha[i].equipo_visitante}</td>    
        </tr>`;
    }
    posicion = document.getElementById('dataTablePartidos')
    posicion.innerHTML = cuerpoTabla;
}








