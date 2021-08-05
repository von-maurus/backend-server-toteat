const { Schema, model } = require('mongoose');
const ZoneSchema = new Schema({
    name: { type: String, required: true },
});
module.exports = model("Zone", ZoneSchema);