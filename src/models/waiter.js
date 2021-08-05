const { Schema, model } = require('mongoose');
const WaiterSchema = new Schema({
    name: { type: String, required: true },
});
module.exports = model("Waiter", WaiterSchema);