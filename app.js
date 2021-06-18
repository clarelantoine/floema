require('dotenv').config()

// console.log(process.env.PRISMIC_ENDPOINT)

const errorHandlers = require('errorhandler')
const express = require('express')
const methodOverride = require('method-override')
const logger = require('morgan')

const app = express()
const path = require('path')
const port = 3000

app.use(errorHandlers())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride())
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')))

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

// Initialize the prismic.io api
const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req: req
  })
}

// Link Resolver
const handleLinkResolver = (doc) => {
  // console.log(doc)
  if (doc.type === 'product') {
    return `/detail/${doc.slug}`
  }

  if (doc.type === 'about') {
    return `/${doc.slug}`
  }

  if (doc.type === 'collections') {
    return `/${doc.slug}`
  }

  return '/'
}

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.Link = handleLinkResolver

  res.locals.Numbers = index => {
    return index === 0 ? 'One' : index === 1 ? 'Two' : index === 2 ? 'Three' : index === 3 ? 'Four' : ''
  }

  res.locals.PrismicDOM = PrismicDOM

  next()
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

const handleRequest = async api => {
  const meta = await api.getSingle('meta')
  const navigation = await api.getSingle('navigation')
  const preloader = await api.getSingle('preloader')

  return {
    navigation,
    meta,
    preloader
  }
}

app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const home = await api.getSingle('home')

  const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
    fetchLinks: 'product.image'
  })

  res.render('pages/home', {
    ...defaults,
    collections,
    home
  })
})

app.get('/about', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const about = await api.getSingle('about')

  res.render('pages/about', {
    ...defaults,
    about
  })
})

app.get('/collections', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)
  const home = await api.getSingle('home')

  const { results: collections } = await api.query(Prismic.Predicates.at('document.type', 'collection'), {
    fetchLinks: 'product.image'
  })

  res.render('pages/collections', {
    ...defaults,
    collections,
    home
  })
})

app.get('/detail/:uid', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  const product = await api.getByUID('product', req.params.uid, {
    fetchLinks: 'collection.title'
  })

  res.render('pages/detail', {
    ...defaults,
    product
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

/**
 * [WINDOWS] - To list & kill the task that is serving on the port:
 * netstat -ano | findstr :3000
 * taskkill /PID 5824 /F
 */
