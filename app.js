const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const cors = require('cors');

const indexRouter = require('./src/routes/index.routes');
const indexRouterJson = require('./src/routes/indexjson.routes');

const app = express();
const puerto = process.env.PORT || 3001;

app.listen(puerto, () => {
  console.log(`Servidor levantado en puerto ${puerto}`);
});

app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// === SERVIR IMÁGENES QUE ESTÁN EN EL DISCO PERMANENTE ===
app.use('/motos', express.static('/var/data/motos'));

// Ruta que usa JSON
app.use('/', indexRouterJson);

// Errores
app.use((req, res, next) => {
  res.status(404).render('admin/error404');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('admin/error');
});