const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Página inicial: muestra el “Toca para iniciar”
router.get('/', (req, res) => {
    res.render('products/index'); // index.ejs con la pantalla inicial
});

// Página de búsqueda: muestra el grid de motos
router.get('/pagina_busqueda', productController.index);

// Página de búsqueda filtrada
router.get('/product/search', productController.productSearch);

// Vista detalle de moto
router.get('/modelo/:id', productController.getOne);

// Página de historia
router.get('/pagina_historia', (req, res) => {
    res.render('products/pagina_historia'); 
});

module.exports = router;