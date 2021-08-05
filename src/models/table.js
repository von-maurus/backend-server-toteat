const { Schema, model } = require('mongoose');
const TableSchema = new Schema({
    number: { type: Number, required: true },
});
module.exports = model("Table", TableSchema);