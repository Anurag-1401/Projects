const app = require('./app')
PORT = process.env.PORT

app.listen(PORT , () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})