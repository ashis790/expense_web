const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    const { name, user_id, email, password } = req.body
    console.log(name,user_id,email,password)
    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            name,
            user_id,
            email,
            password: hashedPassword
        })

        res.status(201).json({ message: 'User created successfully' })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error registering user' })
    }
})

router.post('/login', async (req, res) => {
    const { user_id, password } = req.body
    console.log(user_id,password)
    try {
        const user = await User.findOne({ where: { user_id } })
        if (!user) {
            return res.status(400).json({ message: 'User not found in database' })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Password not matched' })
        }

        const token = jwt.sign({ userId: user.id }, '@ambe7914', { expiresIn: '1h' })

        res.json({
            message: 'Login successful',
            user,
            token
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Error logging in user' })
    }
})

module.exports = router
