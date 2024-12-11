//----------------------------------------------------- Script proyecto carrito (Version 1) ------------------------------------------------------------

//Variables
//Nota: Normalmente los elementos que vayamos seleccionando sobre el DOM se asignan como constantes

//Seleccionar el div con el id de carrito
const carrito = document.querySelector('#carrito');

//Seleccionar el contenedor donde se iran colocando los cursos que vayamos agregando al carrito
const contenedorCarrito = document.querySelector('#lista-carrito tbody');


//Seleccionar el listado de cursos (div lista cursos)
const listaCursos = document.querySelector('#lista-cursos');

//Seleccionar boton que eliminara los productos del carrito
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');

//Declaramos el carrito en forma de arreglo y como una variable ya que ira cambiando
let articulosCarrito = []; //Por defecto se deja vacio

//Mandamos a llamar la funcion de cargarEventListeners()
cargarEventListeners();

//Crear funcion que va a cargar los distintos eventListeners del proyecto
function cargarEventListeners(){

    //Agregando evento de agregar curso al carrito
    listaCursos.addEventListener('click', agregarCurso); //Se trata de un evento de tipo clic

    //Eliminar un curso del carrito
    carrito.addEventListener('click', eliminarCurso);

    //Muestra los cursos disponibles en el storage una vez que cargue la pagina
    document.addEventListener('DOMContentLoaded', ()=>{
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    })

    //Vaciar carrito
    vaciarCarritoBtn.addEventListener('click', e=> {
        e.preventDefault();
        articulosCarrito = [];
        limpiarHtml();
    });


}

//Funciones del proyecto

//Funcion de agregar el curso al carrito
function agregarCurso(e){//Lo que hace esta funcion es extraer el card div que contiene los datos del curso que se haya seleccionado
    e.preventDefault(); //Evitamos que al presionar el boton no nos mande al link que esta declarado en el href y que se quede fijo
    if(e.target.classList.contains('agregar-carrito')){ //Con este if evaluamos si le estamos dando clic especificamente al boton de agregar curso al carrito (evitando event bubbling con delegation)
       const cursoSeleccionado = e.target.parentElement.parentElement; //Seleccionamos el elemento abuelo (padre del padre) del boton que seleccionamos anteriormente
       leerDatosCurso(cursoSeleccionado); //Llamamos la funcion que leera los datos del div correspondiente al curso seleccionado
    }
   
}

//Elimina un curso del carrito
function eliminarCurso(e){
    e.preventDefault();
    if(e.target.classList.contains('borrar-curso')){
        const cursoId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        carritoHTML(); //Iterar sobre el objeto carrito y mostrarlo en el HTML.
    }
}

//Funcion que lee el contenido del HTML al que le dimos clic y extrae la informacion del curso

function leerDatosCurso(curso) {
    //Creamos un objeto con la informacion del curso
    const infoCurso = {
        imagen: curso.querySelector('img').src, //Extraemos la imagen
        nombre: curso.querySelector('h4').textContent, //Extraemos el nombre del curso
        precio: curso.querySelector('.precio span').textContent, //Extraemos el precio del curso
        id: curso.querySelector('a').getAttribute('data-id'), //Obtenemos el id del curso extrayendo el atributo data-id del elemento a (enlace)
        cantidad: 1 //Asignamos la cantidad por defecto a 1
        
    }

    //Revisamos si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id ); //Verificamos si ya existe un curso con el mismo id que el id del curso que se desea agregar
    if(existe){
        //Actualizamos la cantidad
        const cursos = articulosCarrito.map(curso =>{
            if(curso.id === infoCurso.id){
                curso.cantidad++;
                return curso; //retorna el objeto actualizado
            }else{
                return curso; //retorna los objetos que no son los duplicados
            }
        });
        articulosCarrito = [...cursos]; //Se agrega la copia de arreglo con la cantidad actualizada
    }else{
        //Agregamos elementos al arreglo carrito
        articulosCarrito = [...articulosCarrito, infoCurso]; //Usamos el spread operator para copiar lo que teniamos inicialmente al carrito y luego agregarle el articulo recientemente seleccionado
    }
    
    console.log(articulosCarrito);
    carritoHTML(); //Mandamos llamar la funcion que agregara y mostrara en el carrito el/los productos seleccionado dentro del HTML
}

//Muestra el carrito de compras en el HTML
function carritoHTML(){

    //Antes de recorrer los elementos del carrito y de crear los tr
    limpiarHtml(); //Limpia el contenido anterior del carrito para mostrar solamente el carrito actualizado

    articulosCarrito.forEach(curso =>{ //Vamos iterando cada curso contenido en el arreglo carrito por medio del metodo .forEach
        const row = document.createElement('tr'); //Por cada curso que se va iterando se va creando una fila en donde se colocara la info de dicho curso
        //Hacemos destructuring de las variables del objeto curso
        const {nombre, precio, cantidad, id} = curso;

        //En cada fila hacemos uso del metodo innerHTML para estructurar de manera mas facil el contenido que se mostrara en el carrito
        row.innerHTML = `

            <td>
                <img src="${curso.imagen}" width="100">
            </td>

            <td>${nombre}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> X </a>
            </td>
        
        `;

        //Agrega HTML al carrito dentro del tbody (de forma visual dentro de la pagina)
        contenedorCarrito.appendChild(row);

    });

    //Agregar el carrito de compras al storage
    sincronizarStorage();
}

function sincronizarStorage(){
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

//Elimina los cursos del tbody para que no se dupliquen
function limpiarHtml(){
    
    while(contenedorCarrito.firstChild){//Este while va comprobando si el contenedor padre (el carrito) sigue teniendo hijos 
        contenedorCarrito.removeChild(contenedorCarrito.firstChild); //Mientras siga teniendo hijos los ira eliminando del carrito
    } 
}



