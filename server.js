const app = new (require('express'))()
const expressWs = require('express-ws')(app)
const helmet = require('helmet')
const expressLogging = require('express-logging')
const logger = require('logops')

const port = 80

app.use(helmet())
app.use(expressLogging(logger))

app.get("/", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.ws('/', (ws, req) => {
      console.log('Client connected')
      
      ws.on('message', msg => {
        console.log('Meassage got: ' + msg)
        try{
            let jsonMsg = JSON.parse(msg)
            let method = jsonMsg.method
            if(method){
                switch(method){
                    case 'hi':
                        ws.send('HI from server')
                        break;
                    default:
                        let error = new Error("Method unknown", 501) //Тут метод и правда неизвестен
                        let jsonError = JSON.stringify(error)
                        ws.send(jsonError)  
                }
            }
            else if (!jsonMsg.method) {
                let error = new Error("Method unknown", 501) //Тут отсутствует метод 
                let jsonError = JSON.stringify(error)
                ws.send(jsonError)
            }
            else{
                let error = new Error("Internal Server Error", 500)
                let jsonError = JSON.stringify(error)
                ws.send(jsonError)
            }
        }
        catch (errorParse){
            let error = new Error("Method unknown", 501) //Надо поменять на неферный вормат данных или что-то вроде
            let jsonError = JSON.stringify(error)
            ws.send(jsonError)
            console.log('Unknow user testing our service. Thats bad.')
            console.log(msg)
            console.log(errorParse.name)
            console.log(errorParse.message)
        }
      })
      
})

class Error{
    constructor(type, code){
      	this.method = "error"
        this.type = type
        this.code = code
    }
}

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
