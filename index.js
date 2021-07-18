const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

morgan.token('content', function (req, res) {
  const body = req.body
  if (Object.keys(body).length > 0)
    return JSON.stringify(body)
})

const app = express()
app.use(express.json())
app.use(cors())
app.use( morgan( morgan['tiny'] + ' :content'))

const ids = {}
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const getId = () => {
  const newId = Math.floor(Math.random() * 9999)
  if (ids[newId]) {
    getId()
  } else {
    ids[newId] = newId
    return newId;
  }
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.get('/info', (request, response) => {
  const date = Date()
  const content = `<p>Phonebook has info for ${persons.length} people</p><p>${date.toString()}</p`
  response.send(content)
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)
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

  person = {
    name: body.name,
    number: body.number,
    id: getId()
  }
  persons = persons.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3002
app.listen(PORT)