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
      //let motos = await productServiceJson.findAll(); // Trae todos los productos
        let motos = await productServiceJson.findAll() || [];
        let codigos = await productServiceJson.findAllCodigos();
        //console.log(codigos);
        let motos6 = Array.isArray(motos) ? motos.slice(0, 6) : [];
      res.render('products/pagina_busqueda', { product: motos6, cod: codigos });
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
// normalizar entrada
const campoRaw = req.query.campo;
const campo = campoRaw ? String(campoRaw).trim() : '';        // '' significa "buscar por valor"
const valor = String(req.query.valorDispo || '').trim();      // valor para búsqueda por código
const terminoRaw = req.query.search ? String(req.query.search).trim() : '';
const termino = terminoRaw.toLowerCase();                    // para comparación case-insensitive

// traer todos los productos
const allProducts = await productServiceJson.findAll();

// filtro simple
const busqueda = (Array.isArray(allProducts) ? allProducts : []).filter(p => {
  if (!p) return false;

  // solo activos (soporta boolean o string "true")
  if (p.activo === false) return false;
  if (typeof p.activo === 'string' && p.activo.trim().toLowerCase() !== 'true') return false;

  // Si NO se envió campo -> buscamos por "valor" (valorDispo) comparando con el codigo
  if (!campo) {
    if (!valor) return false;                       // si tampoco mandaron valor, no hay búsqueda
    const codigo = String(p.codigo || '').trim();
    return codigo === valor;                       // comparación exacta (string)
  }

  // Si se envió campo -> buscar por campo usando 'termino' (case-insensitive)
  const val = p[campo];
  if (val === undefined || val === null) return false;

  const sval = String(val).trim();
  if (sval === '' || /^null$/i.test(sval)) return false;

  return sval.toLowerCase() === termino;          // comparación exacta insensible a mayúsculas
});
      // console.log(busqueda);
      let codigos = await productServiceJson.findAllCodigos();

      res.render('products/pagina_busqueda', { product: busqueda ,cod: codigos });
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