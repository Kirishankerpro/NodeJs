const express = require('express')
const router = express.Router()
const articlesController = require('./articles.controller')

router.get('/', articlesController.getAll)
router.post('/', articlesController.create)
router.put('/:id', articlesController.update)
router.delete('/:id', articlesController.delete)

module.exports = router
