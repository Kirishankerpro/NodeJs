const { Schema, model } = require('mongoose')

const articleSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    required: true,
  },
  published: {
    type: Date,
    default: Date.now,
  },
})

let Article
module.exports = Article = model('Article', articleSchema)

// async function test() {
//   try {
//     const articles = await Article.find().populate({
//       path: 'user',
//       select: '-password',
//       match: { name: /ben/i },
//     })

//     if (!articles || articles.length === 0) {
//       console.log('Aucun article trouvé.')
//       return
//     }

//     console.log(articles.filter(article => article.user))
//   } catch (error) {
//     console.error('Erreur lors de la récupération des articles:', error)
//   }
// }

// test()
