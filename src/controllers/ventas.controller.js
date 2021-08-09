const ventaCtrl = {};
const Venta = require('../models/venta');
// ----------Finanzas y Comportamiento----------------
/**
 * Obtener todas las ventas en un rango de fechas.
 * */
ventaCtrl.getVentasByDate = async (req, res) => {
    // Se le agrega una Z al final de la fecha debido a que el servidor la transforma a UTC +3hrs
    console.log('Body Params', req.query);
    var inicio = req.query['inicio'];
    var fin = req.query['fin'];
    const ventas = await Venta.find(
        {
            date_opened: {
                $gte: new Date(inicio + 'Z'),
                $lte: new Date(fin + 'Z')
            }
        }
    );
    // Obtener ingresos por dia

    // // const zones = await Venta.distinct("table");
    // // res.json(zones);
    res.json(ventas);
};

ventaCtrl.getHolaMundo = async (req, res) => {
    res.send('Hola Mundo');
}
/**
 * Obtener el total de ingresos en un rango de fechas.
 * */
ventaCtrl.getIngresoTotalByDate = async (req, res) => {
    var inicio = req.query['inicio'];
    var fin = req.query['fin'];
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
};

/**
 * Obtener los productos mas rentables en un rango de fechas.
 * */
ventaCtrl.getProductosMasRentables = async (req, res) => {
    var inicio = req.query['inicio'];
    var fin = req.query['fin'];
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
};

/**
 * Obtener las categorias de productos mas rentables en un rango de fechas.
 * */
ventaCtrl.getCategoriasMasRentables = async (req, res) => {
    var inicio = req.query['inicio'];
    var fin = req.query['fin'];
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
};

/**
 * Obtener los productos más vendidos en un rango de fechas.
 * */
ventaCtrl.getProductosMasVendidos = async (req, res) => {
    var inicio = req.query['inicio'];
    var fin = req.query['fin'];
    // { "name", "cantidad", "montoTotal"}
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
                rankedProductos[index].montoTotal += product.price * product.quantity;
            } else {
                rankedProductos.push({
                    "name": product.name,
                    "cantidad": 1,
                    "montoTotal": product.price * product.quantity
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
};

/**
 * Obtener un ranking de Metodos de Pago más rentables y más utilizados en general 
 * y por zona.
 * */
ventaCtrl.getRankedMetodosPago = async (req, res) => {
    var inicio = req.query['inicio'];
    var fin = req.query['fin'];
    // {nombre, cantidad, monto}
    var rankedMasUsados = [];
    // {nombre, montoTotal}
    var rankedMasRentables = [];
    // {zone, nombre, cantidad, monto}
    var rankedMasUsadosByZone = [];
    // {zone, nombre, montoTotal}
    var rankedMasRentablesByZone = [];
    var array = [];
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
        venta.payments.forEach((p) => {
            let indexRent = rankedMasRentables.findIndex((e) => e.nombre == p.type);
            if (indexRent != -1) {
                rankedMasRentables[indexRent].montoTotal += p.amount;
            } else {
                rankedMasRentables.push({
                    "nombre": p.type,
                    "montoTotal": p.amount
                });
            }
            let indexUsed = rankedMasUsados.findIndex((e) => e.nombre == p.type);
            if (indexUsed != -1) {
                rankedMasUsados[indexUsed].cantidad += 1;
                rankedMasUsados[indexUsed].monto += p.amount;
            } else {
                rankedMasUsados.push({
                    "nombre": p.type,
                    "cantidad": 1,
                    "monto": p.amount
                });
            }
            if (venta.zone == 'Salón') {
                let indexRZ = rankedMasRentablesByZone.findIndex((e) => e.nombre == p.type && e.zone == venta.zone);
                if (indexRZ != -1) {
                    rankedMasRentablesByZone[indexRZ].montoTotal += p.amount;
                } else {
                    rankedMasRentablesByZone.push({
                        "nombre": p.type,
                        "montoTotal": p.amount,
                        "zone": venta.zone
                    });
                }
                let indexUsed = rankedMasUsadosByZone.findIndex((e) => e.nombre == p.type && e.zone == venta.zone);
                if (indexUsed != -1) {
                    rankedMasUsadosByZone[indexUsed].cantidad += 1;
                    rankedMasUsadosByZone[indexUsed].monto += p.amount;
                } else {
                    rankedMasUsadosByZone.push({
                        "nombre": p.type,
                        "cantidad": 1,
                        "zone": venta.zone,
                        "monto": p.amount
                    });
                }
            } else if (venta.zone == 'Terraza') {
                let indexRZ = rankedMasRentablesByZone.findIndex((e) => e.nombre == p.type && e.zone == venta.zone);
                if (indexRZ != -1) {
                    rankedMasRentablesByZone[indexRZ].montoTotal += p.amount;
                } else {
                    rankedMasRentablesByZone.push({
                        "nombre": p.type,
                        "montoTotal": p.amount,
                        "zone": venta.zone,
                    });
                }
                let indexUsed = rankedMasUsadosByZone.findIndex((e) => e.nombre == p.type && e.zone == venta.zone);
                if (indexUsed != -1) {
                    rankedMasUsadosByZone[indexUsed].cantidad += 1;
                } else {
                    rankedMasUsadosByZone.push({
                        "nombre": p.type,
                        "cantidad": 1,
                        "zone": venta.zone,
                        "monto": p.amount
                    });
                }
            } else {
                let indexRZ = rankedMasRentablesByZone.findIndex((e) => e.nombre == p.type && e.zone == venta.zone);
                if (indexRZ != -1) {
                    rankedMasRentablesByZone[indexRZ].montoTotal += p.amount;
                } else {
                    rankedMasRentablesByZone.push({
                        "nombre": p.type,
                        "montoTotal": p.amount,
                        "zone": venta.zone,
                    });
                }
                let indexUsed = rankedMasUsadosByZone.findIndex((e) => e.nombre == p.type && e.zone == venta.zone);
                if (indexUsed != -1) {
                    rankedMasUsadosByZone[indexUsed].cantidad += 1;
                } else {
                    rankedMasUsadosByZone.push({
                        "nombre": p.type,
                        "cantidad": 1,
                        "zone": venta.zone,
                        "monto": p.amount
                    });
                }
            }
        });
    });
    // Ordernar DESC
    rankedMasRentables.sort(function (b, a) {
        if (a.montoTotal > b.montoTotal) return 1;
        if (a.montoTotal < b.montoTotal) return -1;
        return 0;
    });
    // Ordernar DESC
    rankedMasUsados.sort(function (b, a) {
        if (a.cantidad > b.cantidad) return 1;
        if (a.cantidad < b.cantidad) return -1;
        return 0;
    });
    // Ordernar DESC
    rankedMasRentablesByZone.sort(function (b, a) {
        if (a.montoTotal > b.montoTotal) return 1;
        if (a.montoTotal < b.montoTotal) return -1;
        return 0;
    });
    // Ordernar DESC
    rankedMasUsadosByZone.sort(function (b, a) {
        if (a.cantidad > b.cantidad) return 1;
        if (a.cantidad < b.cantidad) return -1;
        return 0;
    });
    array.push({
        "masUsados": rankedMasUsados,
        "masRentables": rankedMasRentables,
        "masUsadosByZone": rankedMasUsadosByZone,
        "masRentablesByZone": rankedMasRentablesByZone,
    });
    res.json(array);
};

/**
 * Obtener total de ventas por zona ordenadas de forma DESC en un rango de 
 * fechas.
 * */
ventaCtrl.getVentasByZone = async (req, res) => {
    var inicio = req.query['inicio'];
    var fin = req.query['fin'];
    // {zone, montoTotal}
    var rankedZones = [];
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
        let index = rankedZones.findIndex((e) => e.zone == venta.zone);
        if (index != -1) {
            rankedZones[index].montoTotal += venta.total;
        } else {
            rankedZones.push({
                "zone": venta.zone,
                "montoTotal": venta.total
            });
        }
    });
    // Ordernar DESC
    rankedZones.sort(function (b, a) {
        if (a.montoTotal > b.montoTotal) return 1;
        if (a.montoTotal < b.montoTotal) return -1;
        return 0;
    });
    res.json(rankedZones);
};

/**
 * Obtener total de ingresos ordenados por dia de la semana (Lun-Dom) en un rango de 
 * fechas. {dia, montoTotal}
 * */
ventaCtrl.getIngresoPorDia = async (req, res) => {
    var inicio = req.query['inicio'];
    var fin = req.query['fin'];
    // {dia, montoTotal}
    var ingresosPerDay = [];
    var dayName = '';
    var days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
    const ventas = await Venta.aggregate(
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
        ],
    );
    ventas.forEach((venta) => {
        var d = new Date(venta.date_opened);
        console.log(d);
        dayName = days[d.getDay()];
        let index = ingresosPerDay.findIndex((e) => e.dia == dayName);
        console.log(dayName);
        if (index != -1) {
            ingresosPerDay[index].montoTotal += venta.total;
        } else {
            ingresosPerDay.push({
                "dia": dayName,
                "montoTotal": venta.total
            });
        }
    });
    res.json(ingresosPerDay);
};
// 
// ---------------------Reporte de Trabajadores---------------------------
/**
 * Obtener las ventas atendidas por un mesero en un rango de fechas.
 * */
ventaCtrl.getWaiterVentasByDate = async (req, res) => {
    var inicio = req.query['inicio'];
    var fin = req.query['fin'];
    var name = req.query['name'];
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
};

/**
 * Obtener las ventas registradas por un cajero en un rango de fechas.
 * */
ventaCtrl.getCashierVentasByDate = async (req, res) => {
    var inicio = req.query['inicio'];
    var fin = req.query['fin'];
    var name = req.query['name'];
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
};

/**
 * Obtener un top de meseros en un rango de fechas por: rentabilidad, personas atendidas y ventas realizadas. 
 * En general y filtradas por Zona
 * */
ventaCtrl.getRankedWaiters = async (req, res) => {
    var inicio = req.query['inicio'];
    var fin = req.query['fin'];
    // {nombre, cantidad }
    var waitersMasRentables = [];
    var waitersMasPersonasAtendidas = [];
    var waitersMasVentas = [];
    // {nombre, cantidad, zone }
    var waitersMasRentablesByZone = [];
    var waitersMasPersonasAtendidasByZone = [];
    var waitersMasVentasByZone = [];
    var array = [];
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
        let indexR = waitersMasRentables.findIndex((e) => e.nombre == venta.waiter);
        if (indexR != -1) {
            waitersMasRentables[indexR].cantidad += venta.total;
        } else {
            waitersMasRentables.push({
                "nombre": venta.waiter,
                "cantidad": venta.total
            });
        }
        let indexPA = waitersMasPersonasAtendidas.findIndex((e) => e.nombre == venta.waiter);
        if (indexPA != -1) {
            waitersMasPersonasAtendidas[indexPA].cantidad += venta.diners;
        } else {
            waitersMasPersonasAtendidas.push({
                "nombre": venta.waiter,
                "cantidad": venta.diners
            });
        }
        let indexPR = waitersMasVentas.findIndex((e) => e.nombre == venta.waiter);
        if (indexPR != -1) {
            waitersMasVentas[indexPR].cantidad += 1;
        } else {
            waitersMasVentas.push({
                "nombre": venta.waiter,
                "cantidad": 1
            });
        }
        let indexRZ = waitersMasRentablesByZone.findIndex((e) => e.nombre == venta.waiter && e.zone == venta.zone);
        if (indexRZ != -1) {
            waitersMasRentablesByZone[indexRZ].cantidad += venta.total;
        } else {
            waitersMasRentablesByZone.push({
                "nombre": venta.waiter,
                "cantidad": venta.total,
                "zone": venta.zone
            });
        }
        let indexPAZ = waitersMasPersonasAtendidasByZone.findIndex((e) => e.nombre == venta.waiter && e.zone == venta.zone);
        if (indexPAZ != -1) {
            waitersMasPersonasAtendidasByZone[indexPAZ].cantidad += venta.diners;
        } else {
            waitersMasPersonasAtendidasByZone.push({
                "nombre": venta.waiter,
                "cantidad": venta.diners,
                "zone": venta.zone
            });
        }
        let indexPRZ = waitersMasVentasByZone.findIndex((e) => e.nombre == venta.waiter && e.zone == venta.zone);
        if (indexPRZ != -1) {
            waitersMasVentasByZone[indexPRZ].cantidad += 1;
        } else {
            waitersMasVentasByZone.push({
                "nombre": venta.waiter,
                "cantidad": 1,
                "zone": venta.zone
            });
        }
    });
    // Ordernar DESC
    waitersMasRentables.sort(function (b, a) {
        if (a.cantidad > b.cantidad) return 1;
        if (a.cantidad < b.cantidad) return -1;
        return 0;
    });
    // Ordernar DESC
    waitersMasPersonasAtendidas.sort(function (b, a) {
        if (a.cantidad > b.cantidad) return 1;
        if (a.cantidad < b.cantidad) return -1;
        return 0;
    });
    // Ordernar DESC
    waitersMasVentas.sort(function (b, a) {
        if (a.cantidad > b.cantidad) return 1;
        if (a.cantidad < b.cantidad) return -1;
        return 0;
    });
    // Ordernar DESC
    waitersMasRentablesByZone.sort(function (b, a) {
        if (a.cantidad > b.cantidad) return 1;
        if (a.cantidad < b.cantidad) return -1;
        return 0;
    });
    // Ordernar DESC
    waitersMasPersonasAtendidasByZone.sort(function (b, a) {
        if (a.cantidad > b.cantidad) return 1;
        if (a.cantidad < b.cantidad) return -1;
        return 0;
    });
    // Ordernar DESC
    waitersMasVentasByZone.sort(function (b, a) {
        if (a.cantidad > b.cantidad) return 1;
        if (a.cantidad < b.cantidad) return -1;
        return 0;
    });
    array.push({
        "rentables": waitersMasRentables,
        "masPersonas": waitersMasPersonasAtendidas,
        "masPedidos": waitersMasVentas,
        "rentablesByZone": waitersMasRentablesByZone,
        "masPersonasByZone": waitersMasPersonasAtendidasByZone,
        "masPedidosByZone": waitersMasVentasByZone,
    });
    res.json(array);
};

// ventaCtrl.getVentasByTable = (req, res) => res.send('Obtener el total de ventas por Mesa y rango de fecha');
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
