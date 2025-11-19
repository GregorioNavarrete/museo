const path = require('path');
const productService = require('../data/productService');
const productServiceJson = require('../data/productsServiceJson');
const fs = require('fs');

//Cuidado que el controller usa servicios del Json y de bbdd

const productController = {

  getAllJson: async (req, res) => {
    try {
      let motos = await productServiceJson.findAll();
      res.render('products/pagina_busqueda', { product: motos });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar los productos");
    }
  },

  indexJson: async (req, res) => {
    try {
      let codigos = await productServiceJson.findAllCodigosActivos();
      let motos6 = await productServiceJson.motos6();
      res.render('products/pagina_busqueda', { product: motos6, cod: codigos });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar los productos");
    }
  },

  getOneJson: async (req, res) => {
    try {
      let id = req.params.id;
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
      const campoRaw = req.query.campo;
      const campo = campoRaw && campoRaw.trim() !== '' ? campoRaw.trim() : 'codigo';

      const searchRaw = String(req.query.search || '').trim();
      const termino = searchRaw.toLowerCase();

      const valorRaw = req.query.valorDispo === undefined ? '' : String(req.query.valorDispo).trim();
      const valorLower = valorRaw.toLowerCase();

      const hasSearch = searchRaw !== '';
      const hasValor = valorRaw !== '' && valorLower !== 'null';
      const valorIsNullString = valorLower === 'null';

      const allProducts = await productServiceJson.findAll();
      const arr = Array.isArray(allProducts) ? allProducts : [];

      const busqueda = arr.filter(p => {
        if (!p) return false;

        if (p.activo === false) return false;
        if (typeof p.activo === 'string' && p.activo.trim().toLowerCase() !== 'true') return false;

        if (hasSearch) {
          const campoVal = String(p[campo] || '').trim().toLowerCase();
          return campoVal.includes(termino);  // ← supports partial match
        }

        if (hasValor) {
          const codigo = String(p.codigo || '').trim();
          return codigo === valorRaw;
        }

        if (valorIsNullString) {
          return false;
        }

        return false;
      });

      let codigos = await productServiceJson.findAllCodigosActivos();
      res.render('products/pagina_busqueda', { product: busqueda, cod: codigos });

    } catch (error) {
      console.error('Error en productSearchJson:', error);
      res.status(500).send("Error al realizar la búsqueda");
    }
  },

  getList: async (req, res) => {
    try {
      let moto = await productServiceJson.findAll();
      res.render('admin/Listado', { moto });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener la moto");
    }
  },
   getListMotoBorradas: async (req, res) => {
    try {
      let moto = await productServiceJson.findAll();
      res.render('admin/ListadoInactivas', { moto });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener la moto");
    }
  },

  cargaMoto: async (req, res) => {
    try {
      res.render('admin/FomularioCarga');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener la moto");
    }
  },

  store: async (req, res) => {
    try {
      await productServiceJson.create(req);
      res.render('admin/FomularioCarga');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al guardar la moto");
    }
  },

  borrar: async (req, res) => {
    try {
      await productServiceJson.borrar(req.params.id, req);  // ← FIX IMPORTANTE
      res.redirect('/userProfile/listado');
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al borrar la moto");
    }
  },

  formularioParaEditar: async (req, res) => {
    try {
      let moto = await productServiceJson.getOne(req.params.id);

      if (!moto) {
        return res.status(404).send("Moto no encontrada");
      }

      res.render('admin/FormularioEdit', { moto });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener la moto");
    }
  },

  edicion: async (req, res) => {
    try {
      await productServiceJson.Editar(req.params.id, req);
      let moto = await productServiceJson.getOne(req.params.id);

      if (!moto) {
        return res.status(404).send("Moto no encontrada");
      }

      res.render('products/modelo', { moto });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al editar la moto");
    }
  },

  /////////////////////////////////////////////// Métodos para BBDD

  index: async (req, res) => {
    try {
      let motos = await productService.getAll();
      res.render('products/pagina_busqueda', { product: motos });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al cargar los productos");
    }
  },

  productSearch: async (req, res) => {
    try {
      const termino = req.query.search ? req.query.search.toLowerCase() : '';
      const campo = req.query.campo || 'modelo';

      let allProducts = await productService.getAll();

      let busqueda = allProducts.filter(p => {
        if (!p.dataValues[campo]) return false;
        return p.dataValues[campo].toLowerCase().includes(termino);
      });

      res.render('products/pagina_busqueda', { product: busqueda });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al realizar la búsqueda");
    }
  },

  getOne: async (req, res) => {
    try {
      let id = req.params.id;
      let moto = await productService.getOne(id);

      if (!moto) {
        return res.status(404).send("Moto no encontrada");
      }

      res.render('admin/FormularioEdit', { moto });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener la moto");
    }
  }
};

module.exports = productController;
