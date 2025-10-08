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
 productSearchJson: async (req, res) => {
  try {
    // Normalizar entradas
    const campoRaw = req.query.campo;
    const campo = campoRaw && String(campoRaw).trim() !== '' ? String(campoRaw).trim() : 'codigo';

    const searchRaw = String(req.query.search || '').trim();      // término de búsqueda (puede estar vacío)
    const termino = searchRaw.toLowerCase();                      // usado para comparación case-insensitive

    const valorRaw = req.query.valorDispo === undefined ? '' : String(req.query.valorDispo).trim();
    const valorLower = valorRaw.toLowerCase();

    // Flags claros
    const hasSearch = searchRaw !== '';
    const hasValor = valorRaw !== '' && valorLower !== 'null';    // valor útil si no está vacío ni es "null"
    const valorIsNullString = valorLower === 'null';

    // Traer todos los productos
    const allProducts = await productServiceJson.findAll();
    const arr = Array.isArray(allProducts) ? allProducts : [];

    // Filtrar según reglas
    const busqueda = arr.filter(p => {
      if (!p) return false;

      // --- filtro de 'activo' robusto ---
      // Si el campo activo está definido y explicitamente NO es "true", lo excluye.
      if (p.activo === false) return false;
      if (typeof p.activo === 'string' && p.activo.trim().toLowerCase() !== 'true') return false;
      // si p.activo es undefined -> lo dejamos pasar (asumimos activo por defecto)

      // Si hay search -> PRIORIDAD: buscar por campo con includes (case-insensitive)
      if (hasSearch) {
        const campoVal = String(p[campo] || '').trim().toLowerCase();
        // includes para que "zanella" encuentre "Zanella T 50"
        return campoVal.includes(termino);
      }

      // Si NO hay search pero valorDispo es útil (y no es "null") -> buscar por codigo exacto
      if (hasValor) {
        const codigo = String(p.codigo || '').trim();
        return codigo === valorRaw;
      }

      // Si valorDispo es exactamente "null" y no hay search -> según lo pedido, buscar por search (pero no hay),
      // por lo tanto no hay coincidencias -> devolver false.
      if (valorIsNullString) {
        return false;
      }

      // Ningún criterio válido -> no incluir
      return false;
    });

    // Obtener lista de codigos para la vista (la función ya existente)
    let codigos = await productServiceJson.findAllCodigos();

    // Renderizar (mantengo 'cod' como variable en la vista, como tenías)
    res.render('products/pagina_busqueda', { product: busqueda, cod: codigos });
  } catch (error) {
    console.error('Error en productSearchJson:', error);
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