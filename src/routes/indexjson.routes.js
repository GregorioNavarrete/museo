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
router.get('/userProfile', (req, res) => {
    res.render('admin/userProfile'); 
});

// Listado de motos
router.get('/userProfile/listado', productController.getList);

// Formulario de carga de motos 
router.get('/userProfile/Carga', productController.cargaMoto);
// /*** crea una moto ***/ 
// router.post('/formCarga',upload.single('portada'),validationsCreate,adminController.store); 
router.post('/guardar-moto',upload.single('portada'),productController.store); 


// /*** softy delete***/ 
// router.post('/formCarga',upload.single('portada'),validationsCreate,adminController.store); 
router.get('/borrar-moto/:id',productController.borrar); 


// /*** softy delete***/ 
router.get('/formularioParaEditar-moto/:id',productController.formularioParaEditar); 
router.post('/editar-moto/:id',upload.single('portada'),productController.edicion);

module.exports = router;