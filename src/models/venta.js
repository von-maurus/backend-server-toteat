const { Schema, model } = require('mongoose');

const ProductSchema = new Schema({
    category: { type: Number, required: true },
    price: { type: Number, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
});
const PaymentSchema = new Schema({
    amount: { type: Number, required: true },
    type: { type: String },
});

const VentaSchema = new Schema({
    date_closed: { type: Date, required: true },
    zone: { type: String, required: true },
    waiter: { type: String, required: true },
    cashier: { type: String, required: true },
    products: { type: [ProductSchema], required: true },
    diners: { type: Number, required: true },
    date_opened: { type: Date, required: true },
    table: { type: Number, required: true },
    total: { type: Number, required: true },
    id: { type: String, required: true },
    payments: { type: [PaymentSchema], required: true },
}, {
    timestamps: true,
    versionkey: false
});

module.exports = model("Venta", VentaSchema);

