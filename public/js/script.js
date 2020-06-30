//Clases
class Anuncio {
    constructor(id, titulo, transaccion, descripcion, precio) {
        this.id = id;
        this.titulo = titulo;
        this.transaccion = transaccion;
        this.descripcion = descripcion;
        this.precio = precio;
    }
}
class Anuncio_Auto extends Anuncio {
    constructor(id, titulo, transaccion, descripcion, precio, numeroPuertas, numeroKms, potencia) {
        super(id, titulo, transaccion, descripcion, precio);
        this.num_puertas = numeroPuertas;
        this.num_kms = numeroKms;
        this.potencia = potencia;
    }
    ;
}
/**
 * Variables globales
 */
let anuncios;
let indiceRow;
//"getElementById"
let table = document.getElementById('table');
let boxButtons = document.getElementById('box-buttons');
let contentCheckbox = document.getElementById('contentCheckbox');
let filtroTransaccion = document.getElementById('idFiltrarTransaccion');
//"addEventListener"
contentCheckbox.addEventListener("click", (event) => modifyCheckBok(event), false);
filtroTransaccion.addEventListener("click", (event) => modifyfiltroTransaccion(event), false);
//"Others" 
// let plantilla = document.getElementsByTagName('template');
// let fragmento = document.createDocumentFragment();
let gif = document.getElementById('gif');
let arrayData = [
    { name: 'Id', class: 'idThTd', otherName: 'id' },
    { name: 'Título', class: 'tituloThTd', otherName: 'titulo' },
    { name: 'Transacción', class: 'transaccionThTd', otherName: 'transaccion' },
    { name: 'Descripción', class: 'descripcionThTd', otherName: 'descripcion' },
    { name: 'Precio', class: 'precioThTd', otherName: 'precio' },
    { name: 'Numero Puertas', class: 'num_puertasThTd', otherName: 'num_puertas' },
    { name: 'Numero Kms', class: 'num_kmsThTd', otherName: 'num_kms' },
    { name: 'Potencia', class: 'potenciaThTd', otherName: 'potencia' }
];
/**
 * Ajax Traer
 */
const traerAjax = async () => {
    let xhr = new XMLHttpRequest();
    gif.style.visibility = 'visible';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            gif.style.visibility = 'hidden';
            if (xhr.status === 200) {
                let auxAnuncios = JSON.parse(xhr.responseText).data;
                console.dir(auxAnuncios);
                anuncios = auxAnuncios.map(item => new Anuncio_Auto(item.id, item.titulo, item.transaccion, item.descripcion, item.precio, item.num_puertas, item.num_kms, item.potencia));
                agregarRowTableTh(arrayData);
                agregarRowTableTd(anuncios, null);
            }
            else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
    };
    xhr.open('GET', 'http://localhost:3000/traer', true);
    xhr.send();
};
/***
 * Ajax Alta
 */
const altaAjax = async (item) => {
    let xhr = new XMLHttpRequest();
    gif.style.visibility = 'visible';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            gif.style.visibility = 'hidden';
            if (xhr.status === 200) {
                console.log(JSON.parse(xhr.responseText));
            }
            else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
    };
    xhr.open('POST', 'http://localhost:3000/alta');
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(item));
};
/***
 * Ajax modificar
 */
const modificarAjax = async (item) => {
    let xhr = new XMLHttpRequest();
    gif.style.visibility = 'visible';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            gif.style.visibility = 'hidden';
            if (xhr.status === 200) {
                console.log(JSON.parse(xhr.responseText));
            }
            else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
    };
    xhr.open('POST', 'http://localhost:3000/modificar');
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(item));
    console.dir(JSON.stringify(item));
};
/***
 * Ajax baja
 */
const bajaAjax = async (id) => {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(JSON.parse(xhr.responseText));
            }
            else {
                console.log(xhr.status + " " + xhr.statusText);
            }
        }
    };
    xhr.open('POST', 'http://localhost:3000/baja');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(`id=${id}`);
};
//----Local Storage-----
const taerLocal = () => {
    anuncios = JSON.parse(localStorage.getItem('listaAnuncios'));
    console.dir(anuncios);
    if (anuncios) {
        agregarRowTableTh(arrayData);
        agregarRowTableTd(anuncios, null);
    }
    else {
        console.log('No hay Lista anuncios en LocalStorage');
    }
};
const altaLocal = (item) => {
    if (anuncios) {
        anuncios.push(item);
    }
    else {
        anuncios = [item];
    }
    let auxRe = localStorage.setItem('listaAnuncios', JSON.stringify(anuncios));
    console.dir(auxRe);
    location.reload();
};
const bajaLocal = (id) => {
    let auxAnuncio = anuncios.filter(item => item.id !== (id).toString());
    console.dir(auxAnuncio);
    localStorage.setItem('listaAnuncios', JSON.stringify(auxAnuncio));
    //location.reload()
    table.deleteRow(indiceRow);
};
const modificarLocal = (item) => {
    anuncios[indiceRow - 1] = item;
    localStorage.setItem('listaAnuncios', JSON.stringify(anuncios));
    location.reload();
};
//-----Filtros Columnas--------//
/**
 * Capturo el evento del checkbok seleccionado
 *  * @param {*} event
 */
const modifyCheckBok = (event) => {
    let checkboxAux, newArrayData, checkboxAuxName, targetValue = event.target.value;
    if (targetValue) {
        checkboxAux = document.getElementById(targetValue);
        switch (targetValue) {
            case 'idCheck':
                checkboxAuxName = { name: 'Id', position: 0, otherName: 'id' };
                break;
            case 'tituloCheck':
                checkboxAuxName = { name: 'Título', position: 1, otherName: 'titulo' };
                break;
            case 'transaccionCheck':
                checkboxAuxName = { name: 'Transacción', position: 2, otherName: 'transaccion' };
                break;
            case 'descripcionCheck':
                checkboxAuxName = { name: 'Descripción', position: 3, otherName: 'descripcion' };
                break;
            case 'precioCheck':
                checkboxAuxName = { name: 'Precio', position: 4, otherName: 'precio' };
                break;
            case 'numeroPuertasCheck':
                checkboxAuxName = { name: 'Numero Puertas', position: 5, otherName: 'num_puertas' };
                break;
            case 'numeroKmsCheck':
                checkboxAuxName = { name: 'Numero Kms', position: 6, otherName: 'num_kms' };
                break;
            case 'potenciaCheck':
                checkboxAuxName = { name: 'Potencia', position: 7, otherName: 'potencia' };
                break;
            default:
                break;
        }
        ;
        //saco columnas
        if (checkboxAux.checked) {
            newArrayData = arrayData.filter(item => item.name !== checkboxAuxName.name);
            arrayData = newArrayData;
        }
        else {
            //agrego columnas
            arrayData.splice(checkboxAuxName.position, 0, checkboxAuxName);
        }
        table.innerHTML = '';
        agregarRowTableTh(arrayData);
        agregarRowTableTd(anuncios, arrayData);
    }
};
/**
 * Filtro Transaccion
 */
const modifyfiltroTransaccion = (event) => {
    let cantidadAux = 0, precioAux = 0;
    table.innerHTML = '';
    agregarRowTableTh(arrayData);
    Object.values(anuncios).forEach(anuncio => {
        if (anuncio.transaccion === event.target.value) {
            let tr = document.createElement("tr");
            tr.setAttribute('onclick', "setIndex(this)");
            precioAux += parseInt(anuncio.precio);
            cantidadAux++;
            Object.values(anuncio).forEach(item => {
                let td = document.createElement('td');
                td.innerHTML = item;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        }
    });
    document.getElementById('promedio').value = (precioAux / cantidadAux);
};
/**
 * agrega un renglon de la tabla (th),
 *  al primer template
 * @param {renglon} element
 */
const agregarRowTableTh = (element) => {
    let tr = document.createElement("tr");
    element.forEach((item) => {
        let th = document.createElement('th');
        th.innerHTML = item.name;
        tr.appendChild(th);
    });
    table.appendChild(tr);
};
/**
 * agrega un renglon a la tabla (td),
 * al segundo template.
 * @param {renglon} element
 */
const agregarRowTableTd = (anuncios, arrayData) => {
    if (arrayData) {
        anuncios.forEach(anuncio => {
            let tr = document.createElement("tr");
            tr.setAttribute('onclick', "setIndex(this)");
            arrayData.forEach(any => {
                let td = document.createElement('td');
                td.innerHTML = anuncio[any.otherName];
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
    }
    else {
        anuncios.forEach(anuncio => {
            let tr = document.createElement("tr");
            tr.setAttribute('onclick', "setIndex(this)");
            Object.values(anuncio).forEach(item => {
                let td = document.createElement('td');
                td.innerHTML = item;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
    }
};
traerAjax();
//taerLocal()
/**
 * Setea el indice "indiceRow" y
 * da visibilidad a los botones editar, eliminar y cancelar
 * @param {evento que proviene del onclick(this)} e
 */
const setIndex = (e) => {
    boxButtons.style.visibility = 'visible';
    indiceRow = e.rowIndex;
};
/**
 * Guardar en Base de datos
 * @param {*} event
 */
const guardar = async (event) => {
    event.preventDefault();
    let titulo, transaccion, auxTransaccion, descripcion, precio, num_puertas, num_kms, potencia, id;
    titulo = document.getElementById("titulo").value;
    auxTransaccion = document.getElementById("transaccion");
    transaccion = auxTransaccion.options[auxTransaccion.selectedIndex].value;
    descripcion = document.getElementById("descripcion").value;
    precio = document.getElementById("precio").value;
    num_puertas = parseInt(document.getElementById("puertas").value);
    num_kms = parseInt(document.getElementById("kms").value);
    potencia = parseInt(document.getElementById("potencia").value);
    if (indiceRow) {
        id = (anuncios[indiceRow - 1].id).toString();
        console.log('entra al modificar?');
        await modificarAjax({ id, titulo, transaccion, descripcion, precio, num_puertas, num_kms, potencia });
        //modificarLocal({ id, titulo, transaccion, descripcion, precio, num_puertas, num_kms, potencia })
    }
    else {
        await altaAjax({ id: null, titulo, transaccion, descripcion, precio, num_puertas, num_kms, potencia });
        //id = (anuncios ? (anuncios.length + 1) : 1).toString();
        //altaLocal({ id, titulo, transaccion, descripcion, precio, num_puertas, num_kms, potencia })
    }
    ;
};
const borrar = async () => {
    boxButtons.style.visibility = 'hidden';
    //await bajaAjax(anuncios[indiceRow-1].id);
    bajaLocal(anuncios[indiceRow - 1].id);
};
const cancelar = () => {
    boxButtons.style.visibility = 'hidden';
    indiceRow = '';
    document.getElementById('form').reset();
};
const editar = () => {
    let auxIndice = indiceRow - 1;
    document.getElementById("titulo").value = anuncios[auxIndice].titulo;
    document.getElementById("transaccion").value = anuncios[auxIndice].transaccion;
    document.getElementById("descripcion").value = anuncios[auxIndice].descripcion;
    document.getElementById("precio").value = anuncios[auxIndice].precio;
    document.getElementById("puertas").value = anuncios[auxIndice].num_puertas;
    document.getElementById("kms").value = anuncios[auxIndice].num_kms;
    document.getElementById("potencia").value = anuncios[auxIndice].potencia;
    window.scroll(0, 0);
};
