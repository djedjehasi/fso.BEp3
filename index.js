require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const Person = require('./models/persons')

morgan.token('content', (request, response) => {return JSON.stringify(request.body)})
morgan.format('customTiny', ':method :url :status :res[content-length] - :response-time ms :content');

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('customTiny'))
app.use(cors())


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

let info = `<p>Phonebook has info for ${persons.length} people</p> <p>${Date()}</p>`

app.get('/info', (request, response) => {
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)  
}

app.post('/api/persons', (request, response) => {
  const body = request.body

 if(!body.name) {
    return response.status(400).json({
      erorr: 'name missing'
    }) 
  } else if (!body.number) {
    return response.status(400).json({
      erorr: 'number missing'
    }) 
  } else if (persons.find(person => person.name === body.name)){
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savePerson => {
    response.json(savePerson)
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) 