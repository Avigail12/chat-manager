var fs = require('fs').promises;
// var fs = require('fs');
var parse = require('csv-parse/lib/sync');
const axios = require('axios');
const stringify = require('csv-stringify');


async function createManyMessages(req, res) {

        if(!req.body.source_file_location){
          return res.status(400).json({ status: "fail", message: `please provide a source file location` })
        }   
        // if (!fs.existsSync(req.body.source_file_location)){
        //     return res.status(404).json({ status: "fail", message: `source file location not exists` })
        // }
        try {
            var result = await readFile(req.body.source_file_location)
            await insertAllMessages(result,req.body.source_file_location)
        } catch (error) {
            return res.status(400).json({ status: "fail", message: error.message })
            console.log('erorr');
        }
        console.log('after');
       return res.status(200).json({ status: "ok", payload: "" })
  }

  async function insertAllMessages(files,path){
    let columns = {
        ID: 'id',
        FROM_NAME: 'from_name',
        TO_NAME:'to_name',
        MESSAGE: 'message',
        CREATED_AT: 'created_at',
        UPDATED_AT: 'updated_at',
        KEY: 'key',
      };

    try {
           files.forEach(file => {
            axios.post('http://localhost:5000/api/messages',file)
            .then(response => {
                console.log(response.data.payload);
                // stringify(response.data.payload, { header: true, columns: columns }, function (err, output) {
                //     if (err) throw err;
                //     console.log('write');
                //     fs.writeFile(path, output,(err) => {
                //         if (err) throw err;
                //         console.log('my.csv saved.');
                //       });
                // })
                  fs.writeFile(path, response.data.payload, 'utf8', function (err) {
                    if (err) {
                      console.log('Some error occured - file either not saved or corrupted file saved.');
                    } else{
                      console.log('It\'s saved!');
                    }
                  });
                return;
            })
            .catch(error => {
                  throw error
                // console.log(error.response.data.message);
                // return error;
            });
        });
    } catch (error) {
        throw error
    }
  }

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