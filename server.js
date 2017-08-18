const express = require('express')
const app = express()
const options = {wsOptions: {clientTracking: true}}
var expressWs = require('express-ws')(app, null, options)
//var wss = expressWs.getWss()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.ws('/', (ws, req) => {
      console.log('Client connected')
      
      ws.on('message', msg => {
        console.log('Meassage got: ' + msg)
        try{
            var jsonMsg = JSON.parse(msg)
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
        }
        //expressWs.getWss().clients.forEach(client => {client.send(msg)})
      })
      
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

class Error{
    constructor(type, code){
      	this.method = "error"
        this.type = type
        this.code = code
    }
}