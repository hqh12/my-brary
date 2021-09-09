const express = require('express');
const router = express.Router();
const multer = require('multer');
const Book = require('../models/book')
const Author = require('../models/author')
const fs = require('fs')

const path = require('path');
const { read } = require('fs');
const { error } = require('console');
const uploadPath = path.join('public', Book.coverImageBasePath);

//create a array to accept all image files
const imageMineTypes = ['image/jpeg', 'image/png', 'image/gif']

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMineTypes.includes(file.mimetype))
    }
})

//get all books
router.get('/', async(req, res) =>{

    let query = Book.find()
    if (req.query.title != null  && req.query.title != ''){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishBefore != null  && req.query.publishBefore != ''){
        query = query.lte('publishDate', req.query.publishBefore)
    }
    if (req.query.publishAfter != null  && req.query.publishAfter != ''){
        query = query.lte('publishDate', req.query.publishAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
          books : books,
          searchOptions : req.query
      })  
    } catch (error) {
        res.redirect('/')
    }
})

//New author
router.get('/new',async(req, res) => {
    renderNewPage(res , new Book())
})

//Creating
router.post('/', upload.single('cover') , async(req, res) => {

    const fileName = req.file != null ? req.file.filename : null

    //create all properties of book models
    const book = new Book({
        title : req.body.title,
        author: req.body.author,
        publishDate : new Date(req.body.publishDate),
        pageCount : req.body.pageCount,
        coverImageName : fileName,
        description : req.body.description
    })
    try {
        const newBook = await book.save()
        //res.redirect(`books/${newBook.id}`)
        res.redirect(`/books`)
    } catch (error) {
        console.log(error)
        if (book.coverImageName != null){
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res , book , true)
    }
})

const renderNewPage = async(res, book, hasError = false) => {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book : book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)
    } catch (error) {
        res.redirect('/books')
    }
}

const removeBookCover = async(fileName) => {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}


module.exports = router;