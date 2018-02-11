const express = require('express')
const app = express()

const express_graphql = require('express-graphql')
const { buildSchema } = require('graphql')

const { products } = require('./data.json')

const schema = buildSchema(`
  type Query {
    product(id: Int!): Product
    products(name: String): [Product]
  }

  type Mutation {
    updateProductName(id: Int!, name: String!): Product
  }

  type Product {
    id: Int
    name: String
  }

`)

const getProduct = (args) => {
  let id = args.id

  let product = products.filter(product => {
    return product.id === id
  })
  return product[0]
}

const getProducts = (args) => {
  return products
}

const updateProductName = ({ id, name }) => {
  products.map(product => {
    if (product.id === id) {
      product.name = name
    }
  })
  
  return products.filter(product => product.id === id)[0]
}

const rootValue = {
  message: () => "Hello world!",
  product: getProduct,
  products: getProducts,
  updateProductName
}

app.use('/graphql', express_graphql({
  schema,
  rootValue,
  graphiql: true
}))

app.listen(8000, () => console.log('Server on por 8000'))
