// Todas las variables a necesitar en el la aplicacion
const contenedorSaludo = document.getElementById('contendor-saludo'),
    btnInicio = document.getElementById('btn-inicio'),
    contenedorConfirmacion = document.getElementById('contenedor-confirmacion'),
    msgFamilia = document.getElementById('msg-familia'),
    formularioOpciones = document.getElementById('formulario-opciones'),
    formOpcionesBtn = document.getElementById('formulario-opciones_btn'),
    contenedorConfDecision = document.getElementById('contenedor-confirmacion_decision'),
    formularioDecision = document.getElementById('formulario_decision'),
    confirmacionFamiliar = document.getElementById('confirmacion_familiar'),
    confirmacionIndividual = document.getElementById('confirmacion_individual'),
    divMiembrosFamilia = document.getElementById('miembros_familia'),
    confirmacionBtn = document.getElementById('confirmacion_btn'),
    msgDespedida = document.getElementById('msg-despedida'),
    loader = document.getElementById('loader'),
    label = document.createElement('label'),
    checkbox = document.createElement('input'),
    invitadosConfirmados = [];


// Activando el Div Saludo
contenedorSaludo.classList.add('active');

// arrays donde guardamos a los invitados filtrados 
let invitadosFiltrados = [];

// Obteniendo el Codigo-Familia del url
let param = new URLSearchParams(window.location.search);
let codeFamilia = parseInt(param.get("codigo-familia"), 10);

// Oculto el saludo y activamos el div de confirmacion y proyecta saludo
// Obtener los datos de la BD y guardar los que el codigo_familia coincida con el codigo "Param", a un Array
const changeToConfirmDivAndGetDataDB = () => {
    contenedorSaludo.classList.remove('active');
    contenedorConfirmacion.classList.add('active');

    const peticion = new XMLHttpRequest();
    peticion.open('GET', 'php/leer-invitados.php');

    loader.classList.add('active');

    peticion.onload = () => {
        const datos = JSON.parse(peticion.responseText);

        if (datos.error) {
            console.log(datos.error);
        } else {
            datos.forEach((invitado) => {
                if (invitado.codigo_familia == codeFamilia) {
                    invitadosFiltrados.push(invitado);   
                }
            })
    
            if (invitadosFiltrados.length > 1) {
                msgFamilia.textContent = `Bienvenida familia: ${invitadosFiltrados[0].apellido}`;
            } else if (invitadosFiltrados.length == 1) {
                msgFamilia.textContent = `Bienvenido: ${invitadosFiltrados[0].nombre} ${invitadosFiltrados[0].apellido}`;
            }
        }
    }

    peticion.onreadystatechange = () => {
        if (peticion.readyState == 4 && peticion.status == 200) {
            loader.classList.remove('active');
        }
    }

    peticion.send();
}

// Activa o desactiva ConfFam y ConfIndiv
const familiaOrIndividual = (e) => {
    e.preventDefault();

    contenedorConfDecision.classList.add('active');

    if (formularioOpciones.familia_completa.checked) {
        confirmacionIndividual.classList.remove('active');
        confirmacionFamiliar.classList.add('active');
        divMiembrosFamilia.classList.remove('active');

        while (divMiembrosFamilia.firstChild) {
            divMiembrosFamilia.removeChild(divMiembrosFamilia.firstChild);
        }

        return formularioOpciones.familia_completa.value;
    } else if (formularioOpciones.individual.checked) {
        confirmacionFamiliar.classList.remove('active');
        confirmacionIndividual.classList.add('active');
        divMiembrosFamilia.classList.add('active');
        invitadosCheckbox();
        return formularioOpciones.individual.value;
    }
}

// Crea los los Labels y CheckBoxes de los invitados cuando se selecciona Indiv
const invitadosCheckbox = () => {    
    for (let i = 0; i < invitadosFiltrados.length; i++) {
        if (invitadosFiltrados[i].codigo_familia == codeFamilia) {
            if (invitadosFiltrados.length > 1) {
                const miembrosDiv = document.createElement('div');
                miembrosDiv.classList.add('miembros-Div');

                miembrosDiv.innerHTML += (
                    `<input type="checkbox" class="checkbox-individual" id="${invitadosFiltrados[i].nombre.replace(' ', '_')}">`
                );
                miembrosDiv.innerHTML += (
                    `<label class="${invitadosFiltrados[i].nombre}" for="${invitadosFiltrados[i].nombre.replace(' ', '_')}">
                        ${invitadosFiltrados[i].nombre}
                    </label>`
                );
                if (invitadosFiltrados[i].confirm_status == 'Confirmado') {
                    miembrosDiv.innerHTML += (`<p> - <b><i>${invitadosFiltrados[i].confirm_status}</i></b></p>`)
                } else {
                    miembrosDiv.innerHTML += (`<p> - <i>No Confirmado</i></p>`)
                }
                
                divMiembrosFamilia.append(miembrosDiv);

                if (invitadosFiltrados[i].confirm_status == 'Confirmado')  {
                    document.querySelector(`#${invitadosFiltrados[i].nombre.replace(' ', '_')}`).setAttribute("checked", "checked");
                }

            } else if (invitadosFiltrados.length == 1) {
                const miembrosDiv = document.createElement('div');
                miembrosDiv.classList.add('miembros-Div');
                miembrosDiv.innerHTML += (
                    `<input type="checkbox" class="checkbox-individual" id="${invitadosFiltrados[i].nombre.replace(' ', '_')}">`
                );
                miembrosDiv.innerHTML += (
                    `<label class="${invitadosFiltrados[i].nombre}" for="${invitadosFiltrados[i].nombre.replace(' ', '_')}">
                        ${invitadosFiltrados[i].nombre}
                    </label>`
                );
                if (invitadosFiltrados[i].confirm_status == 'Confirmado') {
                    miembrosDiv.innerHTML += (`<p> - <b><i>${invitadosFiltrados[i].confirm_status}</i></b></p>`)
                } else {
                    miembrosDiv.innerHTML += (`<p> - <i>No Confirmado</i></p>`)
                }
                
                divMiembrosFamilia.append(miembrosDiv);

                if (invitadosFiltrados[i].confirm_status == 'Confirmado')  {
                    document.querySelector(`#${invitadosFiltrados[i].nombre.replace(' ', '_')}`).setAttribute("checked", "checked");
                }
            }
        }
    }
    
}

// Confirma a toda la familia o a los invitados seleccionados individualmente
const confirmaFamiliaOrIndivSelected = (e) => {
    e.preventDefault();

    // Verifica si la opcion Familia fue seleccionada, cambia el estado a CONFIRMADO y agrega los Invitados actualizados a 'familiaConfirmada'
    if (familiaOrIndividual(e) == 'Familia completa') {
        invitadosFiltrados.forEach((invitado) => {
            invitado.confirm_status = 'Confirmado';
            // almacena los objetos con el status acttualizado
            invitadosConfirmados.push(invitado);
        })

    // Verifica si la opcion Invidualmente fue seleccionada, cambia el estado a CONFIRMADO y agrega Invitado actualizado a 'invitadosIndivConfirmados'
    } else if (familiaOrIndividual(e) == 'Individualmente') {
        let checkboxId;
        invitadosFiltrados.forEach((invitado) => {
            checkboxId = document.querySelector(`#${invitado.nombre.replace(' ', '_')}`);
            
            if (checkboxId.checked) {
                invitado.confirm_status = 'Confirmado';

                // almacena los objetos con el status acttualizado
                invitadosConfirmados.push(invitado);
            } else {
                invitado.confirm_status = 'NULL';

                // almacena los objetos con el status acttualizado
                invitadosConfirmados.push(invitado);
            }
        })
    }

    // Manda los datos de los invitados ya confirmados a PHP para actualizar la base de datos
    invitadosConfirmados.forEach((invitado) => {
        const peticion = new XMLHttpRequest();

        peticion.open('POST', 'php/confirmar-invitados.php');

        const parametro = `id=${invitado.id}&confirm_status=${invitado.confirm_status}`;
        console.log(`id=${invitado.id}&confirm_status=${invitado.confirm_status}`);
        
        peticion.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        loader.classList.add('active');

        peticion.onload = () => {
            changeToConfirmDivAndGetDataDB();
            contenedorConfirmacion.classList.remove('active');
        }

        peticion.onreadystatechange = () => {
            if (peticion.readyState == 4 && peticion.status == 200) {
                loader.classList.remove('active');
            }
        }

        peticion.send(parametro);
    })

    contenedorConfirmacion.classList.remove('active');
    msgDespedida.classList.add('active');
    mensajeDespedida();

    // Des pues de 5 segs pagina vuelve al inicio
    setTimeout(() => {
        location.reload()
    }, 5000)
}

// Mensaje de Despedida del Registro
const mensajeDespedida = () => {
    // Si es confirmacion Familiar o Individualmente pero mayor a 1
    if (invitadosFiltrados[0].confirm_status == 'Confirmado') {
        if (invitadosFiltrados.length > 1) {
            msgDespedida.innerHTML += ('<p>¡Muchas gracias Familia:</p>');
            msgDespedida.innerHTML += (`<h2 class="msgDespedida-h2">${invitadosFiltrados[0].apellido}</h2>`);
            msgDespedida.innerHTML += ('<p>Por confirmar tu asistencia a nuestra Boda!</p>');
            msgDespedida.innerHTML += ('<p>¡Te esperamos el dia 10 de Septiembre!</p>');
        } else if (invitadosFiltrados.length == 1) {
            // Si es confirmacion Individual
            msgDespedida.innerHTML += ('<p>¡Muchas gracias:</p>');
            msgDespedida.innerHTML += (`<h2 class="msgDespedida-h2">${invitadosFiltrados[0].nombre} ${invitadosFiltrados[0].apellido}</h2>`);
            msgDespedida.innerHTML += ('<p>Por confirmar su asistencia a nuestra Boda!</p>');
            msgDespedida.innerHTML += ('<p>¡Te esperamos el dia 10 de Septiembre!</p>');
        }
    } else {
        if (invitadosFiltrados.length > 1) {
            if (invitadosConfirmados.some(({ confirm_status }) => confirm_status == 'Confirmado')) {
                msgDespedida.innerHTML += ('<p>¡Muchas gracias Familia:</p>');
                msgDespedida.innerHTML += (`<h2 class="msgDespedida-h2">${invitadosFiltrados[0].apellido}</h2>`);
                msgDespedida.innerHTML += ('<p>Por confirmar tu asistencia a nuestra Boda!</p>');
                msgDespedida.innerHTML += ('<p>¡Te esperamos el dia 10 de Septiembre!</p>');
            } else {
                msgDespedida.innerHTML += ('<p>¡Lamentamos mucho Familia:</p>');
                msgDespedida.innerHTML += (`<h2 class="msgDespedida-h2">${invitadosFiltrados[0].apellido}</h2>`);
                msgDespedida.innerHTML += ('<p>Que no pueda acompañarnos a nuestra Boda!</p>');
            }

        } else if (invitadosFiltrados.length == 1) {
            // Si es desconfirmacion Individual
            msgDespedida.innerHTML += ('<p>¡Lamentamos mucho:</p>');
            msgDespedida.innerHTML += (`<h2 class="msgDespedida-h2">${invitadosFiltrados[0].nombre} ${invitadosFiltrados[0].apellido}</h2>`);
            msgDespedida.innerHTML += ('<p>Que no pueda acompañarnos a nuestra Boda!</p>');
        }
    }
}

// Boton de "Inicar Registro" activa el Div de Confirmacion y desactiva el Div de saludo
btnInicio.addEventListener('click', () => {
    changeToConfirmDivAndGetDataDB();
})

// Activa el Div para confirm Familia o Individual
formularioOpciones.formulario_opciones_btn.addEventListener('click', (e) => {
    familiaOrIndividual(e);
})

// Confirmara ya y activara despedidaDiv y desactivara confirmDiv
formularioDecision.confirmacion_btn.addEventListener('click', (e) => {
    confirmaFamiliaOrIndivSelected(e);
})