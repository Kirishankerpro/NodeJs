const Article = require('./articles.schema')

class ArticleService {
  create(data) {
    const article = new Article(data)
    return article.save()
  }

  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true })
  }

  getOne(id) {
    return Article.findById(id).populate({
      path: 'user',
      select: '-password',
    })
  }

  delete(id) {
    return Article.deleteOne({ _id: id })
  }

  getAll() {
    return Article.find().populate({
      path: 'user',
      select: '-password',
    })
  }

  getArticlesByUser(userId) {
    return Article.find({ user: userId }).populate({
      path: 'user',
      select: '-password',
    })
  }
}

module.exports = new ArticleService()
