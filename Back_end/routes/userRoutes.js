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
router.get('/cheak_premium',async(req,res)=>{
    const token = req.headers.authorization?.split(' ')[1]
    const id = decodeToken(token)
    try{
        const user = await User.findOne({ where: { id } })
        
        if (!user) {
            return res.status(404).json({ error: "User not found", isPremiumMember: false });
        }
        console.log(`thiss is cheaking ////////[pskdjjhsduhdgsgfsygfy]`,user,user.ispremiummember)
        return res.json({ isPremiumMember: user.ispremiummember })
    }catch(err){
        console.log(err)
    }
})

module.exports = router
