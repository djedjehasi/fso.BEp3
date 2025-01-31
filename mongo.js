const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://djedjehasi:${password}@cluster0.9mxit.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');

    const personSchema = new mongoose.Schema({
      name: String,
      number: String, // Corrected from 'numnber'
    });

    const Person = mongoose.model('Person', personSchema);

    if (name && number) {
      // Save a new person if name and number are provided
      const person = new Person({
        name: name,
        number: number,
      });

      return person.save()
        .then(() => {
          console.log(`added ${name} number ${number} to phonebook`);
        });
    } else {
      // Fetch all person if no name and number are provided
      return Person.find({}).then(person => {
        console.log('Phonebook:');
        person.forEach(person => {
          console.log(`${person.name} ${person.number}`);
        });
      });
    }
  })
  .then(() => {
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error:', err);
    mongoose.connection.close();
  });