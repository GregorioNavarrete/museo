const express = require('express');
const router = express.Router();
const upload= require('../middlewares/multer');
const productController = require('../controllers/productController');

// Página inicial: muestra el “Toca para iniciar”
router.get('/', (req, res) => {
    res.render('products/index'); // index.ejs con la pantalla inicial
});

// Página de búsqueda: muestra el grid de motos
router.get('/pagina_busqueda', productController.indexJson);

// Página de búsqueda filtrada
router.get('/product/search', productController.productSearchJson);

// Vista detalle de moto
router.get('/modelo/:id', productController.getOneJson);

// Página de historia
router.get('/pagina_historia', (req, res) => {
    res.render('products/pagina_historia'); 
});

/*
                    userProfile 
    1-hay que validar con las vista de contraseña 
    2- listados de motos y estadisticas rapidas 
    3- fomulario de carga de motos
    4- valdiar los fomularios 
*/
router.get('/userProfile', (req, res) => {res.render('admin/userProfile');});
/*
1-falta validar ruta
2-boton para regresar atras

*/



// Listado de motos
router.get('/userProfile/listado', productController.getList);
/*
    1-validar la ruta
    2-Puede tener lista de activos y inactivos (botones)
    -se puede hacer de 2 formas  
    3-un boton para regresar atras
    4-hacer funcional a la barra de busqueda (quizas con un filtro para ser mas rapido)
    5-con la lista de borrados se puede activar la moto

*/


// Formulario de carga de motos 
router.get('/userProfile/Carga', productController.cargaMoto);
/*
    1-quitar los datos por defecto del html (es confuso)
    2-analizar como subir varias imagenes
    -implica que en la vista "modelo" este el caricel de fotos
    -implica modificar el Json y modificar el controlador "todo el ABM"
    3-Poner mas ejemplos de uso en el fomulario 
    -validar solo numeros "codigo" y "años"
    4-quitar cosas que no puede ingresar como el "IdUnico", "estado "
    5-
*/




// /*** crea una moto ***/

router.post('/guardar-moto',upload.single('portada'),productController.store); 
/*
    1-si carga una moto sin foto, salta error (cotrolar)
    2-hacer una vista para ver la moto creara o seguir agregado 
    3-ver como manejar el multer para multiples imagenes
    4-Agrega una arreglo de fotos, medio raro


    6- hacer una intefaz especializada para agregar varias fotos, manejarlas y luego mostrarlas

*/


// /*** softy delete***/ 

router.get('/borrar-moto/:id',productController.borrar); 
/*
    1-solo modifica el atributo "activo"
    2-
    3-
    4-
*/

// /*** Edicion***/ 
router.get('/formularioParaEditar-moto/:id',productController.formularioParaEditar); 
/*
    1- quizas pueda ver la parte de a
    2-puede modificarse el estado de la moto "activo o inactivo"
    3-validar campos como "codigo y años"
    4-dar ejemplos para mostrar mejor 

    5-tener cuidado como redefines los atributos del obj

    6- hacer una intefaz especializada para agregar varias fotos, manejarlas y luego mostrarlas

*/

router.post('/editar-moto/:id',upload.single('portada'),productController.edicion);

module.exports = router;