const db = require('../model/database/models')
const fs = require('fs');
const path = require('path');
const fileName = path.resolve(__dirname, "../../datajson/moto.json");


const productsServiceJson = {
    getData: async function () {
      try{
        console.log("11111");
        return JSON.parse(fs.readFileSync(fileName, "utf-8"));
      }catch(e){
        return [];
      }
    
  },
    findAll: async function () {
      try{
        console.log("22222");
         return this.getData();
      }catch(e){
        return [];
      }
  }




  //////
  ,
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

