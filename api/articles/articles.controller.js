const articleService = require('./articles.service')
const NotFoundError = require('../../errors/not-found')
const UnauthorizedError = require('../../errors/unauthorized')

class ArticlesController {
  async create(req, res, next) {
    const user = req.user._id
    try {
      const data = { ...req.body, user }
      const article = await articleService.create(data)
      req.io.emit('article:create', article)
      res.status(201).json(article)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    const user = req.user

    try {
      const id = req.params.id
      const data = req.body

      const findArticle = await articleService.getOne(id)

      if (!findArticle) {
        throw new NotFoundError()
      }
      if (findArticle.user._id.toString() !== user._id.toString() && user.role !== 'admin') {
        throw new UnauthorizedError()
      }

      const article = await articleService.update(id, data)
      res.json(article)
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    const user = req.user
    try {
      const id = req.params.id
      const findArticle = await articleService.getOne(id)

      if (!findArticle) {
        throw new NotFoundError()
      }
      if (findArticle.user._id.toString() !== user._id.toString() && user.role !== 'admin') {
        throw new UnauthorizedError()
      }

      await articleService.delete(id)
      req.io.emit('article:delete', { id })
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }

  async getAll(req, res, next) {
    const user = req.user
    try {
      if (user.role !== 'admin') {
        throw new UnauthorizedError()
      }

      const articles = await articleService.getAll()
      res.json(articles)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new ArticlesController()
