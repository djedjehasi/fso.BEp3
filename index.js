require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const Person = require('./models/person');
const person = require('./models/person');

morgan.token('content', (request, response) => {return JSON.stringify(request.body)})
morgan.format('customTiny', ':method :url :status :res[content-length] - :response-time ms :content');

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan('customTiny'))
app.use(cors())


let info = `<p>Phonebook has info for ${Person.length} people</p> <p>${Date()}</p>`

app.get('/info', (request, response) => {
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id)
  .then(person => response.json(person))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})


app.post('/api/persons', (request, response) => {
  const body = request.body

 if(!body.name) {
    return response.status(400).json({
      error: 'name missing'
    }) 
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
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


app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const newNumber = request.body.number
  console.log("Updating number to:", newNumber);

  Person.findByIdAndUpdate(id, {number: newNumber}, { new: true })
  .then((updatedPerson) => {
    if(updatedPerson) {
      response.json(updatedPerson)
    } else {
      response.status(404).end()
      error: 'cannot update'
    }
  })
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  console.log(error.name)

  if(error.name === 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
}) 