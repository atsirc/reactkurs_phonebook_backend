const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('some arguments are missin. Give password as first argument, name as second and phone-numer as third. If you only use the password then you will get all the phone numbers that have been added to the app')
  process.exit(1)
}

const [path, fullPath, password, name, number] = process.argv

const url =`mongodb+srv://database_user_2:${password}@cluster0.9qhsp.mongodb.net/phone-app?retryWrites=true&w=majority`
mongoose.connect(url)

const numberSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Number = mongoose.model('Number', numberSchema)

if (name && number) {
  const newNumber = new Number( {
    name: name,
    number: number,
  })
  newNumber.save().then(response => {
    console.log('success')
    mongoose.connection.close()
  })
} else {
  Number.find().then(result => {
    result.forEach(number => console.log(number))
    mongoose.connection.close()
  })
}


