// Mongo Atlas secrets

const mongoAtlasAuth = {
  name: 'name',
  password: 'password'
}

exports.getMongoConnectionStr = _ => {
  return `mongodb+srv://${mongoAtlasAuth.name}:${mongoAtlasAuth.password}@y<URL>?retryWrites=true&w=majority`
}
