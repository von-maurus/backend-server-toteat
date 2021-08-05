const ventaCtrl = {};
const Venta = require('../models/venta');
/**
 * Obtener todas las ventas en un rango de fechas.
 * */
ventaCtrl.getVentasByDate = async (req, res) => {
    // Se le agrega una Z al final de la fecha debido a que el servidor la transforma a UTC +3hrs
    console.log('Body Params', req.body);
    var inicio = req.body['inicio'];
    var fin = req.body['fin'];
    const ventas = await Venta.find({ date_opened: { $gte: new Date(inicio + 'Z'), $lte: new Date(fin + 'Z') } });
    // const zones = await Venta.distinct("table");
    // res.json(zones);
    res.json(ventas);
}
/**
 * Obtener el total de ingresos en un rango de fechas.
 * */
ventaCtrl.getTotalVentasByDate = async (req, res) => {
    var inicio = req.body['inicio'];
    var fin = req.body['fin'];
    const montoTotalVentas = await Venta.aggregate(
        [
            {
                $match: {
                    $and: [
                        {
                            date_opened: {
                                $gte: new Date(inicio + 'Z'),
                                $lte: new Date(fin + 'Z')
                            }
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: "$total"
                    }
                }
            }
        ],
    );
    res.json(montoTotalVentas);
    // res.send('Obtener el total de ganancias en un rango de fecha');
    // var ventas = await Venta.find({ date_opened: { $gte: new Date(inicio + 'Z'), $lte: new Date(fin + 'Z') } });
    // ventasObj = JSON.parse(ventas);
}
/**
 * Obtener las ventas atendidas por un mesero en un rango de fechas.
 * */
ventaCtrl.getWaiterVentasByDate = async (req, res) => {
    var inicio = req.body['inicio'];
    var fin = req.body['fin'];
    var name = req.body['name'];
    const waiterVentas = await Venta.aggregate(
        [
            {
                $match: {
                    $and: [
                        {
                            date_opened: {
                                $gte: new Date(inicio + 'Z'),
                                $lte: new Date(fin + 'Z')
                            }
                        },
                        {
                            waiter: name
                        }
                    ]
                }
            },
        ]
    );
    res.json(waiterVentas);
}
/**
 * Obtener las ventas registradas por un cajero en un rango de fechas.
 * */
ventaCtrl.getCashierVentasByDate = async (req, res) => {
    var inicio = req.body['inicio'];
    var fin = req.body['fin'];
    var name = req.body['name'];
    const cashierVentas = await Venta.aggregate(
        [
            {
                $match: {
                    $and: [
                        {
                            date_opened: {
                                $gte: new Date(inicio + 'Z'),
                                $lte: new Date(fin + 'Z')
                            }
                        },
                        {
                            cashier: name
                        }
                    ]
                }
            },
        ]
    );
    console.log('Cantidad', cashierVentas.length);
    res.json(cashierVentas);
}
/**
 * Obtener los productos mas rentables en un rango de fechas.
 * */
ventaCtrl.getProductosMasRentables = async (req, res) => {
    var inicio = req.body['inicio'];
    var fin = req.body['fin'];
    // { "name", "total", "category"}
    var rankedProducts = [];
    const ventas = await Venta.aggregate(
        [
            {
                $match: {
                    date_opened: {
                        $gte: new Date(inicio + 'Z'),
                        $lte: new Date(fin + 'Z')
                    }
                }
            },
        ],
    );
    ventas.forEach((venta, i) => {
        venta.products.forEach((product, j) => {
            let index = rankedProducts.findIndex((r) => r.name == product.name);
            if (index != -1) {
                rankedProducts[index].total += (product.price * product.quantity);
            } else {
                rankedProducts.push({
                    "name": product.name,
                    "category": product.category,
                    "total": product.price * product.quantity,
                });
            }
        });
    });
    rankedProducts.sort(function (b, a) {
        if (a.total > b.total) return 1;
        if (a.total < b.total) return -1;
        return 0;
    });
    console.log('Productos', rankedProducts);
    // console.log('Cantidad', cashierVentas.length);
    res.send(JSON.stringify(rankedProducts));
}
/**
 * Obtener las categorias de productos mas rentables en un rango de fechas.
 * */
ventaCtrl.getCategoriasMasRentables = async (req, res) => {
    var inicio = req.body['inicio'];
    var fin = req.body['fin'];
    // { "name", "total"}
    var rankedCategories = [];
    const ventas = await Venta.aggregate(
        [
            {
                $match: {
                    date_opened: {
                        $gte: new Date(inicio + 'Z'),
                        $lte: new Date(fin + 'Z')
                    }
                }
            },
        ],
    );
    ventas.forEach((venta, i) => {
        venta.products.forEach((product, j) => {
            let index = rankedCategories.findIndex((r) => r.name == product.category);
            if (index != -1) {
                rankedCategories[index].total += (product.price * product.quantity);
            } else {
                rankedCategories.push({
                    "name": product.category,
                    "total": product.price * product.quantity,
                });
            }
        });
    });
    // Ordernar DESC
    rankedCategories.sort(function (b, a) {
        if (a.total > b.total) return 1;
        if (a.total < b.total) return -1;
        return 0;
    });
    console.log('Categorias', rankedCategories);
    // console.log('Cantidad', cashierVentas.length);
    res.send(JSON.stringify(rankedCategories));
}
/**
 * Obtener los productos más vendidos en un rango de fechas.
 * */
ventaCtrl.getProductosMasVendidos = async (req, res) => {
    var inicio = req.body['inicio'];
    var fin = req.body['fin'];
    // { "name", "cantidad"}
    var rankedProductos = [];
    const ventas = await Venta.aggregate(
        [
            {
                $match: {
                    date_opened: {
                        $gte: new Date(inicio + 'Z'),
                        $lte: new Date(fin + 'Z')
                    }
                }
            },
        ],
    );
    ventas.forEach((venta, i) => {
        venta.products.forEach((product, j) => {
            let index = rankedProductos.findIndex((r) => r.name == product.name);
            if (index != -1) {
                rankedProductos[index].cantidad += 1;
            } else {
                rankedProductos.push({
                    "name": product.name,
                    "cantidad": 1,
                });
            }
        });
    });
    // Ordernar DESC
    rankedProductos.sort(function (b, a) {
        if (a.cantidad > b.cantidad) return 1;
        if (a.cantidad < b.cantidad) return -1;
        return 0;
    });
    console.log('Categorias', rankedProductos);
    // console.log('Cantidad', cashierVentas.length);
    res.send(JSON.stringify(rankedProductos));
}

ventaCtrl.getRankedWaiters = (req, res) => res.send('Obtener top 10 de meseros con más ventas y rango de fecha');
ventaCtrl.getRankedCashiers = (req, res) => res.send('Obtener top 10 de cajeros con más ventas y rango de fecha');
ventaCtrl.getVentasByPaymentMethods = (req, res) => res.send('Obtener el total de ventas segun el metodo de pago y rango de fecha');
ventaCtrl.getVentasByZone = (req, res) => res.send('Obtener el total de ventas por Zona y rango de fecha');
ventaCtrl.getVentasByTable = (req, res) => res.send('Obtener el total de ventas por Mesa y rango de fecha');
// Cambiar el date tipo String a tipo Date. (Se utilizo solo 1 vez)
ventaCtrl.changeStringToDate = async (req, res) => {
    await Venta.collection.find().forEach(function (obj) {
        obj.date_closed = new Date(obj.date_closed);
        obj.date_opened = new Date(obj.date_opened);
        Venta.collection.updateMany(
            { id: { $eq: obj.id } },
            { $set: { "date_opened": obj.date_opened, "date_closed": obj.date_closed } });
    });
    res.send('Cambiar fecha String a Date');
};
module.exports = ventaCtrl;
