const express = require('express')
const sequelize = require('./config')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 3000


const orderRoutes = require('./routes/orders')
const userRoutes = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenseRoutes')


app.use(cors())
app.use(bodyParser.json()) 

app.use('/orders', orderRoutes)
app.use('/api/users', userRoutes)
app.use('/api/expenses', expenseRoutes)


app.get('/',(req,res)=>{
    res.send('hello from expencetracker backend')



})


sequelize.sync().then(() => {
    console.log('Database synchronized');
}).catch((error) => {
    console.error('Error synchronizing database:', error);
});
app.listen(port,()=>{
    console.log(`server is running ${port}`)
})