const path = require('path');
const productService = require('../data/productService');
const fs = require('fs');

const productController = {
  // Vista inicial o página de búsqueda: trae todos los productos
  index: async (req, res) => {
    try {
      console.log("Estoy en vista principal / página de búsqueda");
      let motos = await productService.getAll(); // Trae todos los productos
      res.render('products/pagina_busqueda', { product: motos });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar los productos");
    }
  },

  // Búsqueda filtrada por término y campo
  productSearch: async (req, res) => {
    try {
      const termino = req.query.search ? req.query.search.toLowerCase() : '';
      const campo = req.query.campo || 'modelo'; // Por defecto filtra por modelo

      // Traer todos los productos
      let allProducts = await productService.getAll();

      // Filtrar productos según término y campo
      let busqueda = allProducts.filter(p => {
        if (!p.dataValues[campo]) return false; // Evita errores si no existe el campo
        return p.dataValues[campo].toLowerCase().includes(termino);
      });

      res.render('products/pagina_busqueda', { product: busqueda });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al realizar la búsqueda");
    }
  },

  // Obtener un solo producto y mostrarlo en modelo.ejs
  getOne: async (req, res) => {
    try {
      let id = req.params.id;
      console.log("ID recibido:", id);

      let moto = await productService.getOne(id);

      if (!moto) {
        return res.status(404).send("Moto no encontrada");
      }

      res.render('products/modelo', { moto });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener la moto");
    }
  }
};

module.exports = productController;