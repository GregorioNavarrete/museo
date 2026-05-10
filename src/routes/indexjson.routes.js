const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer');
const productController = require('../controllers/productController');

// ===============================================================
// Aclaración importante:
// Todo lo referente a persistencia (JSON / imágenes) se maneja
// dentro del productController y en el middleware multer.
// Este archivo NO requiere cambios de rutas para Render.
// ===============================================================

// Página inicial: muestra el “Toca para iniciar”
router.get('/', (req, res) => {
    res.render('products/index');
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

// Perfil de usuario
router.get('/userProfile', (req, res) => {
    res.render('admin/userProfile');
});

// Listado de motos Activas
router.get('/userProfile/listado', productController.getList);

// Listado de motos borradas
router.get('/userProfile/listadoBorradas', productController.getListMotoBorradas);

// Formulario de carga de motos
router.get('/userProfile/Carga', productController.cargaMoto);

// Crear una moto nueva
router.post('/guardar-moto', upload.single('portada'), productController.store);

// Soft delete
router.get('/borrar-moto/:id', productController.borrar);

// Formulario para editar moto
router.get('/formularioParaEditar-moto/:id', productController.formularioParaEditar);

// Procesa la edición
router.post('/editar-moto/:id', upload.single('img'), productController.edicion);

module.exports = router;
