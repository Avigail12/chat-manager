var fs = require('fs').promises;
var fs2 = require('fs');
// var fs = require('fs');
var parse = require('csv-parse/lib/sync');
const axios = require('axios');
const stringify = require('csv-stringify');
const ObjectsToCsv = require('objects-to-csv')

// insert some messages from text file
async function createManyMessages(req, res) {

        if(!req.body.source_file_location){
          return res.status(400).json({ status: "fail", message: `please provide a source file location` })
        }   
        if (!fs2.existsSync(req.body.source_file_location)){
            return res.status(404).json({ status: "fail", message: `source file location not exists` })
        }
        try {

            var result = await readFile(req.body.source_file_location)

            //check if illigel
            var columnResults = {};

            for(var row =0; row < result.length; row++){
                for(var column in result[row]){
                    if(!columnResults[column]){
                        columnResults[column] = [];
                    }
                    columnResults[column].push(result[row][column]);
                }
            }
            columns = Object.keys(columnResults);
            if(columns[0] != "from_name" | columns[1] != "to_name" | columns[2] != "message"| columns[3] != "date" | columns[4] != "key"){
                return res.status(400).json({ status: "fail", message: 'The colums name wrong' })
            }
            resp = await insertAllMessages(result,req.body.source_file_location)
        } catch (error) {
            return res.status(400).json({ status: "fail", message: error.message })
        }
        console.log('after');
       return res.status(200).json({ status: "ok", payload: resp })
  }

  // send post req to chat-assignment server and update key colums
  async function insertAllMessages(rows,path){

      var data = []

    try {
            // rows.forEach(row => {
            //     result = await axios.post('http://localhost:5000/api/messages',row)
            // })
            for (let index = 0; index < rows.length; index++) {
                 result = await axios.post('http://localhost:5000/api/messages',rows[index])
                 message = {from_name:result.data.payload.FROM_NAME,to_name:result.data.payload.TO_NAME,
                    message:result.data.payload.MESSAGE,date:result.data.payload.CREATED_AT,key:result.data.payload.KEY}
                    d = new Date(message.date)
                    message.date = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear()
                 data.push(message) 
            }
            console.log(data);
             csv = new ObjectsToCsv(data)
             await csv.toDisk(path)

        // return data;
    } catch (error) {
        throw error
    }
  }


  // read all messages from file and convers to objects array
  async function readFile(path){

    try {
        const fileContent = await fs.readFile(path);/*__dirname+'/chart-of-accounts.csv'*/
        const records = parse(fileContent, {columns: true});
        return records;
    } catch (error) {
        throw error;
    }
  }

  module.exports = {
    createManyMessages,
  }
