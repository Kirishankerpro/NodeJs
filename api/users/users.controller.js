const NotFoundError = require('../../errors/not-found')
const UnauthorizedError = require('../../errors/unauthorized')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const usersService = require('./users.service')
const articleService = require('../articles/articles.service')

class UsersController {
  async getById(req, res, next) {
    try {
      const id = req.params.id
      const user = await usersService.get(id)
      if (!user) {
        throw new NotFoundError()
      }
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  async create(req, res, next) {
    const authUser = req.user
    try {
      if (authUser.role !== 'admin') {
        throw new UnauthorizedError()
      }

      const user = await usersService.create(req.body)
      user.password = undefined
      req.io.emit('user:create', user)
      res.status(201).json(user)
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    const user = req.user
    try {
      const id = req.params.id
      const data = req.body

      if (user.role !== 'admin' && user._id.toString() !== id) {
        throw new UnauthorizedError()
      }

      const userModified = await usersService.update(id, data)
      userModified.password = undefined
      res.json(userModified)
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    const user = req.user
    try {
      const id = req.params.id
      if (user.role !== 'admin' && user._id.toString() !== id) {
        throw new UnauthorizedError()
      }

      await usersService.delete(id)
      req.io.emit('user:delete', { id })
      res.status(204).send()
    } catch (err) {
      next(err)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const userId = await usersService.checkPasswordUser(email, password)
      if (!userId) {
        throw new UnauthorizedError()
      }

      const token = jwt.sign({ userId }, config.secretJwtToken, {
        expiresIn: '3d',
      })
      res.json({
        token,
        userId,
      })
    } catch (err) {
      next(err)
    }
  }

  async getUser(req, res, next) {
    const authUser = req.user
    try {
      const decoded = jwt.verify(req.params.id, config.secretJwtToken)
      const user = await usersService.get(decoded.userId)
      if (!user) {
        throw new NotFoundError()
      }

      if (authUser.role !== 'admin' && authUser._id.toString() !== user._id.toString()) {
        throw new UnauthorizedError()
      }

      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  async articles(req, res, next) {
    const user = req.user
    try {
      const userId = req.params.id

      if (user.role !== 'admin' && user._id.toString() !== userId) {
        throw new UnauthorizedError()
      }

      const articles = await articleService.getArticlesByUser(userId)
      res.status(200).json(articles)
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

      const users = await usersService.getAll()
      res.json(users)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new UsersController()
