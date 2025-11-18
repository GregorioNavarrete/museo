const db = require('../model/database/models')
const fs = require('fs');
const path = require('path');
const fileName = path.resolve(__dirname, "../../datajson/moto.json");
const fileName6 = path.resolve(__dirname, "../../datajson/6motos.json");
const { v4: uuidv4 } = require("uuid");

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
    },
 create: async function (motoData) { // <-- CAMBIO 2: El parámetro es 'motoData' (es req.body)
    
    // CAMBIO 3: Usamos 'await' para esperar la promesa
    let allUsers = await this.findAll();

    // 2. Tu corrección para asegurar que sea un array (¡esto es correcto!)
    if (!Array.isArray(allUsers)) {
      allUsers = [];
    }

    // 3. Lógica mejorada para generar el 'idUnico' incremental
    //    (Tu código anterior usaba req.body.idUnico, que venía como "0")
    let maxId = 0;
    if (allUsers.length > 0) {
        maxId = allUsers.reduce((max, moto) => {
            const motoId = parseInt(moto.idUnico);
            return motoId > max ? motoId : max;
        }, 0);
    }
    const newIdUnico = (maxId + 1).toString();


    // 4. Creamos el objeto (accediendo a 'motoData' directamente)
    //    ¡Este bloque es el que arregla que "solo guardaba el id"!
    let newUser = {
      //id: uuidv4(), // ID interno de UUID

      // CAMBIO 4: Usamos 'motoData.propiedad' en lugar de 'req.body.propiedad'
      codigo: motoData.body.codigo,
      nombre: motoData.body.nombre,
      año: motoData.body.ano, // Cuidado: el log mostraba 'aÃ±o'
      origen: motoData.body.origen,
      cc: motoData.body.cc,
      HP: motoData.body.HP,
      Velocidades: motoData.body.Velocidades,
      arranque: motoData.body.arranque,
      marchas: motoData.body.marchas,
      rodado: motoData.body.rodado,
      motor: motoData.body.motor,
      carburador: motoData.body.carburador,
      color: motoData.body.color,
      frenos: motoData.body.frenos,
      embrague: motoData.body.embrague,
      datosAdjuntos: motoData.body.datosAdjuntos,
      observaciones: motoData.body.observaciones,
      
      idUnico: uuidv4(), // Asignamos el nuevo ID incremental
      
      activo: motoData.body.activo || "true", // Valor por defecto

      // Manejo de imágenes (asumiendo que el controlador las pasó)
      img: motoData.file.filename || (motoData.imagenes ? motoData.imagenes[0] : ''), 
      imagenes: motoData.body.imagenes || []
    };
    
    allUsers.push(newUser);
    
    // 5. Guardamos el array COMPLETO (viejos + nuevo)
    fs.writeFileSync(fileName, JSON.stringify(allUsers, null, " "));

    return newUser;
  },
 borrar: async function (idUnico, req) {
      try {
        // 1. Obtenemos TODAS las motos (sincrónicamente)
        let allMotos = await this.findAll();
    
        // 2. Buscamos el ÍNDICE de la moto que queremos borrar
        //    Usamos findIndex para saber la posición y modificarla
        let motoIndex = allMotos.findIndex(moto => moto.idUnico == idUnico);
    // console.log(allMotos[motoIndex]);
        // 3. Verificamos si la moto existe
        if (motoIndex === -1) {
          console.warn(`Intento de borrado fallido: No se encontró la moto con idUnico ${idUnico}`);
          return false; // Indicamos que no se pudo borrar
        }
    
        // 4. Realiza los cambios en los campos
        //    Modificamos el objeto directamente en el array
        allMotos[motoIndex].activo = "false"; //
        
        
        // 5. Sobrescribimos el JSON con el array completo y actualizado
        //    (La moto sigue en su posición original, pero con activo: "false")
        fs.writeFileSync(fileName, JSON.stringify(allMotos, null, " "));
    
        // 6. Devolvemos la moto modificada
        return allMotos[motoIndex];
    
      } catch (e) {
        console.error("Error en la función 'borrar':", e);
        return false; // Indicamos que hubo un error
      }
    },
    Editar: async function (idUnico,motoData) {
      try {
        // 1. Obtenemos TODAS las motos (sincrónicamente)
        let allMotos = await this.findAll();
    
        // 2. Buscamos el ÍNDICE de la moto que queremos borrar
        //    Usamos findIndex para saber la posición y modificarla
        let motoIndex = allMotos.findIndex(moto => moto.idUnico == idUnico);
    // console.log(allMotos[motoIndex]);
        // 3. Verificamos si la moto existe
        if (motoIndex === -1) {
          console.warn(`Intento de borrado fallido: No se encontró la moto con idUnico ${idUnico}`);
          return false; // Indicamos que no se pudo borrar
        }
    
        // 4. Realizamos el Soft Delete: Cambiamos 'activo' a "false"
        
        //allMotos[motoIndex].activo = "false";   podrai re activarlo
        
        console.log(motoData.body);
        allMotos[motoIndex].codigo=motoData.body.codigo;
        allMotos[motoIndex].nombre=motoData.body.nombre;
        allMotos[motoIndex].año=motoData.body.año;
        allMotos[motoIndex].origen=motoData.body.origen;
        allMotos[motoIndex].cc=motoData.body.cc;
        allMotos[motoIndex].HP=motoData.body.HP;
        allMotos[motoIndex].Velocidades=motoData.body.Velocidades;
        allMotos[motoIndex].arranque=motoData.body.arranque;
        allMotos[motoIndex].marchas=motoData.body.marchas;
        allMotos[motoIndex].rodado=motoData.body.rodado;
        allMotos[motoIndex].motor=motoData.body.motor;
        allMotos[motoIndex].carburador=motoData.body.carburador;
        allMotos[motoIndex].color=motoData.body.color;
        allMotos[motoIndex].frenos=motoData.body.frenos;
        allMotos[motoIndex].embrague=motoData.body.embrague;
        allMotos[motoIndex].datosAdjuntos=motoData.body.datosAdjuntos;
        allMotos[motoIndex].observaciones=motoData.body.observaciones;

        //allMotos[motoIndex].img=motoData.body.observaciones;  //no modifica imagenes aun 
 
  

        // 5. Sobrescribimos el JSON con el array completo y actualizado
        //    (La moto sigue en su posición original, pero con activo: "false")
        fs.writeFileSync(fileName, JSON.stringify(allMotos, null, " "));
    
        // 6. Devolvemos la moto modificada
        return allMotos[motoIndex];
    
      } catch (e) {
        console.error("Error en la función 'borrar':", e);
        return false; // Indicamos que hubo un error
      }
    }
}
module.exports = productsServiceJson;

