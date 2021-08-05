const mongoose = require('mongoose');
const uri = "mongodb+srv://vonmaurus:kratos@clusterstarter.awlej.mongodb.net/ventas_toteat?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then((db) => console.log('DB connection sucess')).catch((error) => console.error(error));
