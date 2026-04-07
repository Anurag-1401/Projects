const app = require('./app')
PORT = process.env.PORT

console.log("MongoDB Connected")

app.listen(PORT , () => {
    console.log(`Server is running...`)
})