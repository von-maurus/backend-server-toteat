const { Schema, model } = require('mongoose');
const CashierSchema = new Schema({
    name: { type: String, required: true },
});
module.exports = model("Cashier", CashierSchema);
