// Aqui van las URL de mi server
const { Router } = require('express');
const router = Router();
const ventaCtrl = require('../controllers/ventas.controller.js');
// aqui van todas las rutas de la REST API
// router.get('/', ventaCtrl.getVentasByDate);
// router.get('/', ventaCtrl.getTotalVentasByDate);
// router.get('/', ventaCtrl.getWaiterVentasByDate);
// router.get('/', ventaCtrl.getCashierVentasByDate);
// router.get('/', ventaCtrl.getProductosMasRentables);
// router.get('/', ventaCtrl.getCategoriasMasRentables);
router.get('/', ventaCtrl.getProductosMasVendidos);
// router.get('/', ventaCtrl.getVentasByZone);
// router.get('/', ventaCtrl.getVentasByTable);
// router.get('/', ventaCtrl.getRankedWaiters);
// router.get('/', ventaCtrl.getRankedCashiers);
// router.get('/', ventaCtrl.getVentasByPaymentMethods);


module.exports = router;