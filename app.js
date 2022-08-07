//variables
const carrito = document.querySelector("#carrito"); //generalmente cuando son divs o elementos que no cambian va con const
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
let articulosCarrito = []; //vacio porque siempre que entramos a una pagina al principio esta vacio el carrito

cargarEventListeners();

function cargarEventListeners() {
  //en esta function se registran todos los event listeners, por lo general el lo hace asi
  listaCursos.addEventListener("click", agregarCurso);
  //cuando agregas un curso presionando agregar al carrito, agregarCurso es una funcion que aca la llamamos
  //pero la escribimos afuera para que cargarEventListeners no sea una super función choclo que no se entienda
  carrito.addEventListener("click", eliminarCurso);
  //Aca llamamos a la función eliminarCurso cuando hacemos click en la x
  //Vaciar el carrito:
  vaciarCarritoBtn.addEventListener("click", () => {
    articulosCarrito = []; //reseteamos el arreglo
    limpiarHTML(); //limpiamos el HTML
  });
}

//Funciones

//1 agregar curso
function agregarCurso(e) {
  e.preventDefault(); //esto se pone para que cuando hago click no se vaya para arriba la página
  //porque en el href tenemos un #
  if (e.target.classList.contains("agregar-carrito")) {
    const cursoSeleccionado = e.target.parentElement.parentElement;
    //.parentElement dos veces para poder acceder a toda la info de la card
    leerDatosCurso(cursoSeleccionado);
  }
}

//2 Eliminar curso del carrito
function eliminarCurso(e) {
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");
    //Elimina del arreglo de ArticulosCarrito por el data-id
    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);

    carritoHtml(); //iterar sobre el carrito y mostrar su HTML
  }
}

// 1.a Funcion que lee el contenido del html al que le dimos click y extrae la info del curso
function leerDatosCurso(curso) {
  //paso 1: Crear un objeto con el contenido del curso actual
  const infoCurso = {
    imagen: curso.querySelector("img").src, //poner curso. es como cuando ponemos document.
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent, //span porque estamos eligiendo el precio con dto
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  //Paso 2: Revisa si un elemento ya existe en el carrito y aumentar la cantidad o agregar los elementos al carrito
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);
  if (existe) {
    //Actualizamos la cantidad
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        return curso; //retorna el objeto con la cantidad actualizadda
      } else {
        return curso; //retorna los objetos que no son duplicados
      }
    });
    articulosCarrito = [...cursos];
  } else {
    //Agrega elementos al arreglo de carrito
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  carritoHtml();
}

//1.a.1 Muestra el carrito en el html
function carritoHtml() {
  //Limpiar el HTML para que si agrego un elemento c no me muestre a, b, a , b , c sino a, b, c
  limpiarHTML();
  //Recorre el carrito y genera el HTML
  articulosCarrito.forEach((curso) => {
    //console.log(curso) -> con esto podemos ir viendo toda la info que tiene ese objeto, sirve para ir probando
    //mientras vamos armando
    //es recomendable usar destructuring para que el código sea más limpio:
    const { imagen, titulo, precio, cantidad, id } = curso;
    const row = document.createElement("tr"); //tr es table row
    row.innerHTML = `<td><img src="${imagen}" width=100></td>
    <td>${titulo}</td>
    <td>${precio}</td>
    <td>${cantidad}</td>
    <td>
      <a href="#" class="borrar-curso" data-id="${id}">
        X
      </a>
    </td>`;
    //Agrega el html del carrito en el tbody
    contenedorCarrito.appendChild(row);
  });
}

//1.a.1.a Elimina los cursos del tbody
function limpiarHTML() {
  //forma lenta:
  //contenedorCarrito.innerHTML = "";
  //forma con mejor performance
  while (contenedorCarrito.firstChild) {
    //si contenedor carrito tiene al menos un elemento adentro se sigue ejecutando
    //es decir, mientras tenga hijos los va a ir borrando uno a uno hasta que no tenga más
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
