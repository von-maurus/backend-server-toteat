const express = require('express');
const morgan = require('morgan');
import cors from 'cors';
const app = express();

//Settings - Enviroment variables -> para puertos
app.set('port', process.env.PORT || 4000);

// Middlewares
const corsOptions = {
    // Configurar direcciones permitidas si se desea
}
app.use(cors(corsOptions)); //es para habilitar el uso de cualquier app que utilice esta rest
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use(express.urlencoded({ extended: false }));

app.use('/api/ventas', require('./routes/ventas.routes'));
module.exports = app;