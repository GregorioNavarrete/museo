
const path = require('path');
//const path = require('../app');
const multer = require('multer'); //hay que instalarlo 


/*Los argumentos de los metodos STORAGE
    req = es el pedido que manda el cluente por el formulario   
    file= el archivo enviado
    cb= colback, para almacenar el archivo en el destino final
*/


const configPropiaStorage = multer.diskStorage({ 
    destination: function (req, file, cb) { 
        let folder = path.join(__dirname, '../../public/img/motos');//donde mandar el archivo
       cb(null, folder); 
    }, 
    filename: function (req, file, cb) { 
       cb(null, `${Date.now()}_img_${path.extname(file.originalname)}`);  } 
  })


//para decirle a multer que quiero usar la configuracion echa, como "Disco de almacenamiento de Archivos"

const upload = multer({storage : configPropiaStorage});

module.exports = upload;