const Order  = require('../models/order')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const axios = require("axios")
const {Cashfree} = require('cashfree-pg')
const router = require('../routes/orders')
require("dotenv").config()

const decodeToken = (token) =>{
    try{

        const secretKey = "@ambe7914"
        const decoded = jwt.verify(token, secretKey)
        console.log("Decoded Token:", decoded)
        return decoded.userId

    }catch(err){
        console.error("Invalid Token:", err)
        return null
    }

}

const createOrder = async(req , res )=>{
    const token = req.headers.authorization?.split(' ')[1]
    console.log(`token from order ${token}`)
    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }
    try{
        const userId = decodeToken(token)
        console.log('user id from ',` order ${userId}`)
        const orderId = "order_" + Date.now()
        const orderData = {
            order_id: orderId,
           "order_amount": 1.00,
            "order_currency": "INR",
            customer_details: {
                customer_id: userId.toString(),
                customer_phone: "9876543210" 
            },
            order_meta: {
                return_url: `http://localhost:5501/Front_end/pay_sucess.html`
            }
        }
        const cashfreeResponse = await axios.post(
            "https://sandbox.cashfree.com/pg/orders",
            orderData,{
                headers:{
                    "Content-Type": "application/json",
                    "x-client-id": process.env.CASHFREE_CLIENT_ID,
                    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
                    "x-api-version": "2025-01-01"
                }

            }
        )



        const order = await Order.create({
            UserId:userId,
            orderId:orderId,
            status:'PENDING',
            paymentSessionId: cashfreeResponse.data.payment_session_id
        })
        return res.status(201).json({ message: 'Order created sucessfully', order ,
            payment_session_id: cashfreeResponse.data.payment_session_id  
        })

    }catch(err){
        console.error(err);
        return res.status(500).json({ message: 'Error creating order' })
    }
}
const updateResponse = (async(req,res)=>{
    const token = req.headers.authorization?.split(' ')[1]

    const userId = decodeToken(token)
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    console.log('this is the cheack from user table update ', userId)
    try{
        const user = await User.findOne({where:{id:userId}})
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.ispremiummember= true
        console.log(user.ispremiummember)
        await user.save()
        return res.status(200).json({ message: "User upgraded to premium" });

    }catch(err){
        console.log(err)
    }
})
module.exports = {createOrder,updateResponse}