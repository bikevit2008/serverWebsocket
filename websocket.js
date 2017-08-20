var handle = function(ws, req){
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
}

module.exports.handle = handle