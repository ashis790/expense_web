const express = require('express')
const router = express.Router()
const {createOrder,updateResponse} = require('../controllers/orderController')

router.post('/create',createOrder)

//router.put('/update/:orderId',updateOrderStatus)

//router.get('/',getOrders)
router.put('/updatePremium',updateResponse)


module.exports = router