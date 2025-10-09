const db = require('../model/database/models')
const fs = require('fs');
const path = require('path');
const fileName = path.resolve(__dirname, "../../datajson/moto.json");
const fileName6 = path.resolve(__dirname, "../../datajson/6motos.json");


const productsServiceJson = {
    getData: async function () {
      try{
        
        return JSON.parse(fs.readFileSync(fileName, "utf-8"));
      }catch(e){
        return [];
      }
    
  },
      motos6: async function () {
      try{
        
        return JSON.parse(fs.readFileSync(fileName6, "utf-8"));
      }catch(e){
        return [];
      }
    
  },
    findAll: async function () {
      try{
        
         return this.getData();
      }catch(e){
        return [];
      }
  },
findAllCodigos: async function () {
  try {
    const data = await this.getData();   // espero un array de objetos
    const codigos = [];
    if (!Array.isArray(data)) return codigos;

    for (const item of data) {
      if (!item) continue;
      const c = item.codigo === undefined || item.codigo === null
        ? "" 
        : String(item.codigo).trim();
      if (c === "" || /^null$/i.test(c)) continue; // saltear vacíos/"null"
      codigos.push(c); // agrega tal cual (string). Mantiene duplicados si existen.
    }

    return codigos; // array de strings
  } catch (e) {
    console.error("findAllCodigos error:", e);
    return [];
  }
},


  //////
  
    getAll: async function (){
        try {
            let products = await db.Moto.findAll({});
            console.log("11111");
            return products;
        } catch (error) {
            return [];
        }    
    },
search: async function(req) {
  try {
    //es un filtro por modelo por defecto
    // si indica el campo a filtrar, son 5 campos diferentes
    //podria tener un error si no indica el campo
    let allMotos = await this.getAll();
    let searchText = req.query.search?.toLowerCase() || "";
    let campo = req.query.campo || "modelo";

    return allMotos.filter(moto => {
      let valorCampo = moto[campo]?.toString().toLowerCase();
      return valorCampo?.includes(searchText);
    });
  } catch (error) {
    console.log(error);
  }
},
    getOne: async function (id){
        try {
            let products = await this.findAll();
           
           product = products.find((elem)=>elem.idUnico == id);
console.log(products.id_articulo);
           if(!product){
                // si el no se encuantra el "id" en el arreglo, lo entrgamos bacio al obj
                
                product = {};
           }
            return product;
            
        } catch (error) {
            //para q al menos no se rompa la vista
            //mandar un mensaje de error
            console.log(error);
            return [];
        }    
    }
}
module.exports = productsServiceJson;

