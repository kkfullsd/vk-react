const express = require('express')
const path = require('path')
const https = require('https');
const fs = require('fs');


const app = express()

app.use(express.json({ extended: true }))

app.use('/', express.static(path.join(__dirname, 'build')))

app.get('*', (req, res)=>{
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

let PORT = 80

async function start() {
    try {
      https.createServer({
        key: fs.readFileSync('./ssl/key.pem'),
        cert: fs.readFileSync('./ssl/cert.crt'),
      },
        app).listen(PORT)
      console.log('Server is listening :', PORT)
      //  app.listen(PORT, () =>
      //    console.log(`app has been started on port: ${PORT}...`)
      //  );
    } catch (e) {
        console.error(e.message)
        process.exit(1)
    }
}


start()
