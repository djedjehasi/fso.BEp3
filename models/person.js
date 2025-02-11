const mongoose = require('mongoose');

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
})
.catch(error => {
    console.log('error connecting to MongoDB:', error.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
        
    number: {
        type: String,
        validate: {
            validator: (num) => {
                if (num.length < 8)  return false
                if(num[2] !== '-' && num[3] !== '-') return false
                const parts = num.split('-')
                const [first, secound] = parts
                if (Number(first) && Number(secound)) {
                    return true
                } else {
                    return false
                } 
            },
            message: "Phone Number Invalid - must contain 8 digits, 1 separator (-) after second or third digit and contain only numbers."
        },
        required: true
    } 
})

personSchema.set('toJSON', {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
    }
})


module.exports = mongoose.model('Person', personSchema)