const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const cors = require('cors');

const indexRouter = require('./routes/index.routes');

const app = express();
const puerto = 3000;

app.listen(puerto, () => {
  console.log(`Servidor levantado en puerto ${puerto}`);
});

app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.use('/', indexRouter);

app.use((req,res,next)=>{
	res.status(404).render('admin/error404');
});

app.use((req,res,next)=>{
	res.status(500).render('admin/error');
});