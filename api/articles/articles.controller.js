const articleService = require('./articles.service')
const NotFoundError = require('../../errors/not-found')

class ArticlesController {
  async create(req, res, next) {
    try {
      const data = { ...req.body }
      const article = await articleService.create(data)
      req.io.emit('article:create', article)
      res.status(201).json(article)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id
      const data = req.body
      const article = await articleService.update(id, data)
      res.json(article)
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id
      await articleService.delete(id)
      req.io.emit('article:delete', { id })
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new ArticlesController()
