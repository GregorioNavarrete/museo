const path = require('path');
const productService = require('../data/productService');
const productServiceJson = require('../data/productsServiceJson');
const fs = require('fs');

//Cuidado que el controller usa servicios del Json y de bbdd

const productController = {

  getAllJson: async (req, res) => {
    try {
      
      let motos = await productServiceJson.findAll(); 

      // console.log(motos);
      for(let i = 0; i < 2; i++){
        console.log(motos[i]);
      }
      
      //res.render('products/pagina_busqueda', { product: motos });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar los productos");
    }
  },
  indexJson: async (req, res) => {
    try {
      let motos = await productServiceJson.findAll(); // Trae todos los productos
      res.render('products/pagina_busqueda', { product: motos });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar los productos");
    }
  },
    getOneJson: async (req, res) => {
    try {
      let id = req.params.id;
      console.log("ID recibido:", id);

      let moto = await productServiceJson.getOne(id);

      if (!moto) {
        return res.status(404).send("Moto no encontrada");
      }

      res.render('products/modelo', { moto });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener la moto");
    }
  },
   // Búsqueda filtrada por codigo
  productSearchJson: async (req, res) => {
    try {
      // const termino = req.query.search ? req.query.search.toLowerCase() : '';
      const campo = req.query.campo || 'codigo'; // Por defecto filtra por codigo

// normalizar término (asegurarse que es string)
const terminoRaw = req.query.search ? String(req.query.search).trim() : '';
const termino = terminoRaw.toLowerCase();

      // Traer todos los productos
      let allProducts = await productServiceJson.findAll();

      // // Filtrar productos según término y campo
      // let busqueda = allProducts.filter(p => {
      //   console.log(p);
      //   return p.campo.toLowerCase().includes(termino);
      // });
// filtro seguro y simple
let busqueda = allProducts.filter(p => {
  // if (!p || p.activo === false) return false;    // evitar objetos inválidos / inactivos

  const val = p[campo];                           // acceso dinámico correcto
  if (val === undefined || val === null) return false;

  const sval = String(val).trim();                // forzar a string y quitar espacios
  if (sval === '' || /^null$/i.test(sval)) return false; // ignorar cadena vacía o "null"

  return sval.toLowerCase().includes(termino);   // ahora es seguro llamar toLowerCase()
});
      console.log(busqueda);

      res.render('products/pagina_busqueda', { product: busqueda });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al realizar la búsqueda");
    }
  }
  
///////////////////////////////////////////////Debajo estan los metodos para bbd
  ,
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