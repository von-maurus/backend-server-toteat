const cashierCtrl = {};
const Cashier = require('../models/cashier');

cashierCtrl.getCashiers = async (req, res) => {
    console.log('Body Params', req.body);
    const cajeros = await Cashier.find();
    res.json(cajeros);
    res.send('Obtener Cajeros');
};