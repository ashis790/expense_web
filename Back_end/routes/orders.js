const express = require('express')
const router = express.Router()
const createOrder = require('../controllers/orderController')

router.post('/create',createOrder)

//router.put('/update/:orderId',updateOrderStatus)

//router.get('/',getOrders)


module.exports = router