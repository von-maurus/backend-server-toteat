// Aqui van las URL de mi server
const { Router } = require('express');
const router = Router();
const ventaCtrl = require('../controllers/ventas.controller.js');
// aqui van todas las rutas de la REST API
router.get('/get-ventas-by-date', ventaCtrl.getVentasByDate);
router.get('/get-ingreso-total', ventaCtrl.getIngresoTotalByDate);
router.get('/get-waiter-ventas', ventaCtrl.getWaiterVentasByDate);
router.get('/get-cashier-ventas', ventaCtrl.getCashierVentasByDate);
router.get('/get-ranked-waiters', ventaCtrl.getRankedWaiters);
router.get('/get-prod-rentables', ventaCtrl.getProductosMasRentables);
router.get('/get-cat-rentables', ventaCtrl.getCategoriasMasRentables);
router.get('/get-prod-mas-vendidos', ventaCtrl.getProductosMasVendidos);
router.get('/get-ranked-metodos', ventaCtrl.getRankedMetodosPago);
router.get('/get-ventas-by-zone', ventaCtrl.getVentasByZone);
router.get('/get-ingresos-per-day', ventaCtrl.getIngresoPorDia);
router.get('/get-hola-mundo', ventaCtrl.getHolaMundo);
module.exports = router;