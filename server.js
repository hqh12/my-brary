const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');//no need header and footer in ejs
const routerIndex = require('./routes/index');
const mongoose = require('mongoose');
require('dotenv').config();

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
//set layout = header + footer
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(express.static('public'))

//connect to mongoose
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connect Success'))

app.use('/', routerIndex)


app.listen(5000, () => {
    console.log('server is running at port 5000...');
})
