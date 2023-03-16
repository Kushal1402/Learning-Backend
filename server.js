// This file is used to make a create a server, this is the entry point .

const http = require('http')
const app = require('./app')

// The next line is use as ::
// The dotenv is a module that loads environment variables from a .env file that you create and adds them to the process.env object which is then made available to the application.
// The config() is a method which is provided by the dotenv module to config the env files. 
require('dotenv').config()

const port = process.env.PORT || 5000

console.log('Server started at : ' + port)
const server = http.createServer(app)
server.listen(port)