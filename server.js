const app = new (require('express'))()
const expressWs = require('express-ws')(app)
const helmet = require('helmet')
const expressLogging = require('express-logging')
const logger = require('logops')

const wsHandle = require('./websocket')

const port = 80

app.use(helmet())
app.use(expressLogging(logger))

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.ws('/', function(ws, req){
    wsHandle.handle(ws, req)
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
