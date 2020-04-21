// Mongo Atlas secrets

const mongoAtlasAuth = {
  name: 'yoda',
  password: 'l1G3m29S3H7O4QcQ'
}

exports.getMongoConnectionStr = _ => {
  return `mongodb+srv://${mongoAtlasAuth.name}:${mongoAtlasAuth.password}@yay-kclbk.mongodb.net/test?retryWrites=true&w=majority`
}
