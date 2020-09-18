const SerialPort = require('serialport');
const ReadLine = require('@serialport/parser-readline');

const utils = require('../libs/utils');

const maxAttempts = 5;
let attempts = 0;
let timeoutAttempts, timeoutError;
let dataReceived = null;

const sendMessage = (reject, light_ender, port) => {

  if (attempts == maxAttempts) {

    clearTimeout(timeoutAttempts);

    if (!dataReceived) {
      reject(new Error('Attempeted exceded'))
    }
    
    attempts = 0;
    return
  }

  console.log(`Attempeted: ${attempts} to send`)

  let caracToSend = light_ender.toString();
  caracToSend = Buffer.from(caracToSend);

  port.write(caracToSend, err => {
    ++attempts;
    timeoutAttempts = setTimeout(() => {
      sendMessage(reject, light_ender, port);
    }, 1000);
  });
}

module.exports = {
  
  async switchState (req, res, next) {

    return new Promise((resolve, reject) => {
      
      const errorMsg = 'Impossible to detect the light to trigger';
      const light_ender = req.body.light_ender || null;

      if (!light_ender) {
        return reject(errorMsg);
      }

      const port = new SerialPort('/dev/ttyUSB0', { 
        lock : true,
        baudRate: 9600,
        autoOpen: false
      });
      const parser = new ReadLine({ delimiter: '\r' });
      
      port.pipe(parser);
      port.on('error', e => reject(e))
      port.on('open', () => {
        console.log('Connection opened');
        sendMessage(reject, light_ender, port)
      })
      port.on('close', () => {
        console.log('Connection Closed');
        resolve({
          success: true,
          msg: dataReceived
        })
      })

      parser.on('data', data => {
        console.log('Response from device --> ', data)
        dataReceived = data;
        clearTimeout(timeoutAttempts);
        port.close()
      });

      port.open();

    })
    .then(response => {
      attempts = 0;
      utils.sendResponse(res, response)
    })
    .catch(e => utils.sendErrorResponse(res, e));
  },
}