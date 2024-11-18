const request = require('supertest')
const { app } = require('../server')
const jwt = require('jsonwebtoken')
const config = require('../config')
const mockingoose = require('mockingoose')
const Article = require('../api/articles/articles.schema')
const articlesService = require('../api/articles/articles.service')

describe('Tester API Articles', () => {
  let token
  const USER_ID = '673b2a696110addab2ef1b20'
  const ARTICLE_ID = '673b8160fb5dd4b89fb391f9'
  const MOCK_ARTICLES = [
    {
      _id: ARTICLE_ID,
      title: 'Test Article',
      content: 'This is a test article',
      user: USER_ID,
      status: 'draft',
      published: '2021-01-01',
    },
  ]
  const MOCK_NEW_ARTICLE = {
    title: 'New Article',
    content: 'Content for new article',
    user: USER_ID,
    status: 'published',
    published: '2021-01-01',
  }

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID, role: 'admin' }, config.secretJwtToken)
    mockingoose(Article).toReturn(MOCK_ARTICLES, 'find')
    mockingoose(Article).toReturn(MOCK_NEW_ARTICLE, 'save')
    mockingoose(Article).toReturn(MOCK_NEW_ARTICLE, 'findOneAndUpdate')
    mockingoose(Article).toReturn({}, 'deleteOne')
  })

  test('[Articles] Create Article', async () => {
    const res = await request(app).post('/api/articles').send(MOCK_NEW_ARTICLE).set('x-access-token', token)

    console.log('resTest', res.body)

    expect(res.status).toBe(201)
    expect(res.body.title).toBe(MOCK_NEW_ARTICLE.title)
    expect(res.body.user).toBe(USER_ID)
  })

  test('[Articles] Update Article', async () => {
    const updatedArticle = { ...MOCK_NEW_ARTICLE, title: 'Updated Article' }
    mockingoose(Article).toReturn(updatedArticle, 'findOneAndUpdate')

    const res = await request(app).put(`/api/articles/${ARTICLE_ID}`).send(updatedArticle).set('x-access-token', token)

    expect(res.status).toBe(200)
    expect(res.body.title).toBe('Updated Article')
  })

  test('[Articles] Delete Article', async () => {
    const res = await request(app).delete(`/api/articles/${ARTICLE_ID}`).set('x-access-token', token)

    expect(res.status).toBe(204)
  })

  test('Est-ce articlesService.create', async () => {
    const spy = jest.spyOn(articlesService, 'create').mockImplementation(() => MOCK_NEW_ARTICLE)

    await request(app).post('/api/articles').send(MOCK_NEW_ARTICLE).set('x-access-token', token)

    expect(spy).toHaveBeenCalled()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedWith(MOCK_NEW_ARTICLE)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
