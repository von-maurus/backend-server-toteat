const mongoose = require('mongoose');
import config from './config';
const uri = config.mongodbURL;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then((db) => {
    console.log('DB connection sucess')
}).catch((error) => {
    console.error(error)
});