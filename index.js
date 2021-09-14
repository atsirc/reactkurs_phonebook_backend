require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Number = require('./models/number')

morgan.token('content', function (req, res) {
  const body = req.body
  if (Object.keys(body).length > 0)
    return JSON.stringify(body)
})

const app = express()
app.use(express.json())
app.use( morgan( morgan['tiny'] + ' :content'))


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.get('/api/persons', (request, response) => {
  Number.find().then(persons => {
    response.json(persons)
  }).catch(error => console.log)
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Number.findById(id).then(result => {
    if (result) response.json(result)
    else response.status(404).end()
  }).catch(error=> next(error))
})

app.get('/info', (request, response) => {
  Number.count().then(result => {
    const date = Date()
    const content = `<p>Phonebook has info for ${result} people</p><p>${date.toString()}</p`
    response.send(content)
  }).catch(error => console.log)
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  Number.find().then(persons => {

    if (!body.name) {
      return response.status(400).json({
        error: 'name is  missing' 
      })
    }

    if (!body.number) {
      return response.status(400).json({
        error: 'number is missing'
      })
    }

    if (persons.find(person => person.name === body.name)) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }

    const person = new Number({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedNumber => response.json(savedNumber))
  }).catch(error => console.log)
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const newNumber = request.body
  Number.findByIdAndUpdate(id, newNumber, { new: true }).then(result => {
    response.json(result)
  })
  .catch(error => next(error))

})

app.delete('/api/persons/:id', (request, response, next) => {
  Number.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3002
app.listen(PORT)
