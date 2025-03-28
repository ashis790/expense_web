const express = require('express')
const router = express.Router()
const Expense = require('../models/Expense')
const User = require('../models/user')

const jwt = require('jsonwebtoken')
const verifyToken = (req , res , next)=>{
    const token = req.header('Authorization')?.split(' ')[1]
    console.log(`token ~ `,token)
    if (!token) {
        return res.status(403).json({ message: 'Access Denied: No token provided' })
    }
    try{
        const decoded = jwt.verify(token, '@ambe7914')
        console.log(`User iD please attention ???????????////////`,decoded.userId)
        req.userId = decoded.userId
        next()
    }catch(err){
        return res.status(400).json({ message: 'Invalid token' })
    }
}

router.post('/add',verifyToken, async(req , res)=>{
    const userId = req.userId
    const {amount , description , category} = req.body
    console.log(amount,description,category)


    try{
        const user = await User.findByPk(userId)
        if(!user){
            return res.status(400).json({ message: 'User not found' })
        }
        const expense = await Expense.create({amount,description,category,userId})
        console.log(amount,description,category,userId)
        res.status(201).json({ message: 'Expense added successfully', expense })
    }catch(err){
        console.error(err)
        res.status(500).json({ message: 'Error adding expense' })
    }
})

router.get('/showAll',verifyToken,async(req,res)=>{
    const userId = req.userId
    try{
        const expenses = await Expense.findAll({where:{userId}})
        if (expenses.length === 0) {
            return res.status(404).json({ message: 'No expenses found' })
        }
        res.status(200).json({ expenses })
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Error fetching expenses' })
    }
})
module.exports = router