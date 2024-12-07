const articleController = require('../api/articles/articles.controller')
const articleService = require('../api/articles/articles.service')

jest.mock('../api/articles/articles.service.js')

describe('Article Controller', () => {
  let req, res, next

  beforeEach(() => {
    req = {
      params: { id: '673b2a696110addab2ef1b01' },
      body: { title: 'Article de Test', content: 'Ceci est un article de test.' },
      user: { _id: '673b2a696110addab2ef1b02', role: 'member' },
      io: { emit: jest.fn() },
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      end: jest.fn(),
    }
    next = jest.fn()
  })

  describe('Create', () => {
    it('should create an article and return 201 with the article data', async () => {
      const mockArticle = {
        _id: '673b2a696110addab2ef1b01',
        title: 'Article de Test',
        content: 'Ceci est un article de test.',
        user: '673b2a696110addab2ef1b02',
      }

      articleService.create.mockResolvedValue(mockArticle)

      await articleController.create(req, res, next)

      expect(articleService.create).toHaveBeenCalledWith({
        title: 'Article de Test',
        content: 'Ceci est un article de test.',
        user: '673b2a696110addab2ef1b02',
      })
      expect(req.io.emit).toHaveBeenCalledWith('article:create', mockArticle)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockArticle)
    })
  })

  describe('Update', () => {
    it('should update an article and return 200 with the updated article data', async () => {
      const mockArticle = {
        _id: '673b2a696110addab2ef1b01',
        title: 'Article de Test',
        content: 'Ceci est un article de test.',
        user: { _id: '673b2a696110addab2ef1b02' },
      }
      const mockUpdatedArticle = {
        _id: '673b2a696110addab2ef1b01',
        title: 'Article Mis à Jour',
        content: 'Ceci est le contenu mis à jour.',
      }

      req.body = { title: 'Article Mis à Jour', content: 'Ceci est le contenu mis à jour.' }

      articleService.getOne.mockResolvedValue(mockArticle)
      articleService.update.mockResolvedValue(mockUpdatedArticle)

      await articleController.update(req, res, next)

      expect(articleService.getOne).toHaveBeenCalledWith('673b2a696110addab2ef1b01')
      expect(articleService.update).toHaveBeenCalledWith('673b2a696110addab2ef1b01', req.body)
      expect(res.json).toHaveBeenCalledWith(mockUpdatedArticle)
      expect(next).not.toHaveBeenCalled()
    })

    it('should allow admin to update any article', async () => {
      req.user.role = 'admin'
      const mockArticle = {
        _id: '673b2a696110addab2ef1b01',
        title: 'Article de Test',
        content: 'Ceci est un article de test.',
        user: { _id: '673b2a696110addab2ef1b03' },
      }
      const mockUpdatedArticle = {
        _id: '673b2a696110addab2ef1b01',
        title: 'Article Mis à Jour',
        content: 'Ceci est le contenu mis à jour.',
      }

      req.body = { title: 'Article Mis à Jour', content: 'Ceci est le contenu mis à jour.' }

      articleService.getOne.mockResolvedValue(mockArticle)
      articleService.update.mockResolvedValue(mockUpdatedArticle)

      await articleController.update(req, res, next)

      expect(articleService.getOne).toHaveBeenCalledWith('673b2a696110addab2ef1b01')
      expect(articleService.update).toHaveBeenCalledWith('673b2a696110addab2ef1b01', req.body)
      expect(res.json).toHaveBeenCalledWith(mockUpdatedArticle)
      expect(next).not.toHaveBeenCalled()
    })
  })

  describe('Delete', () => {
    it('should delete an article and return 204 with no content', async () => {
      const mockArticle = {
        _id: '673b2a696110addab2ef1b01',
        title: 'Article de Test',
        content: 'Ceci est un article de test.',
        user: { _id: '673b2a696110addab2ef1b02' },
      }

      articleService.getOne.mockResolvedValue(mockArticle)
      articleService.delete.mockResolvedValue(true)

      await articleController.delete(req, res, next)

      expect(articleService.getOne).toHaveBeenCalledWith('673b2a696110addab2ef1b01')
      expect(articleService.delete).toHaveBeenCalledWith('673b2a696110addab2ef1b01')
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it('should allow admin to delete any article', async () => {
      req.user.role = 'admin'
      const mockArticle = {
        _id: '673b2a696110addab2ef1b01',
        title: 'Article de Test',
        content: 'Ceci est un article de test.',
        user: { _id: '673b2a696110addab2ef1b03' },
      }

      articleService.getOne.mockResolvedValue(mockArticle)
      articleService.delete.mockResolvedValue(true)

      await articleController.delete(req, res, next)

      expect(articleService.getOne).toHaveBeenCalledWith('673b2a696110addab2ef1b01')
      expect(articleService.delete).toHaveBeenCalledWith('673b2a696110addab2ef1b01')
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })
  })
})
