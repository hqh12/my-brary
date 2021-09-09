const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');//no need header and footer in ejs
const routerIndex = require('./routes/index');
const authorIndex = require('./routes/authors');
const bookIndex = require('./routes/books')
const mongoose = require('mongoose');
require('dotenv').config();

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
//set layout = header + footer
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({extended : false}))

//connect to mongoose
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true })

const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connect Success'))

app.use('/', routerIndex)
app.use('/authors', authorIndex)
app.use('/books', bookIndex)


app.listen(5000, () => {
    console.log('server is running at port 5000...');
})
