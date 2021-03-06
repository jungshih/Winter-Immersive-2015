
// Listen for websocket connections, calling this function
// with a readable/writeable socket whenever a new user joins.
// This isn't too far removed from what we were using yesterday
// with net.createServer.
// Simple Socket.IO setup example, adapted from:
// http://socket.io/get-started/chat/

var serveStatic = require('serve-static')
var socketIO = require('socket.io')
var johnny = require('johnny-five')
var express = require('express')
var http = require('http')

var app = express()

// Here' we're creating a Node HTTP server
// from our express server. This is just so that
// socket.io properly knows how to work with it,
// and shouldn't change the rest of your code.
var server = http.createServer(app)
var io = socketIO(server)

// Starts up a static server for the "files" directory.
// This works a lot like XAMPP/MAMP/LAMP serves up files,
// except you're not able to generate the output like you could
// with PHP.
app.use(serveStatic(__dirname + '/files'))

// Listens to port 8080, making the express server
// accessible on http://localhost:8080/ from your browser
// once it's ready.
server.listen(8080, function(err) {
  if (err) throw err
  console.log('http://localhost:8080/')
})

// Listen for websocket connections, calling this function
// with a readable/writeable socket whenever a new user joins.
// This isn't too far removed from what we were using yesterday
// with net.createServer.
io.on('connection', function(socket) {
  console.log('a user connected!')

  socket.on('disconnect', function() {
    console.log('a user disconnected...')
  })

  // Magic! The data you send from the browser turns
  // up in this event emitter
  socket.on('message', function(message) {

    // By using io.emit instead of socket.emit here,
    // we send the data back to the browser of every
    // connected user.
    io.emit('message', message)

    if (led) {
      led.strobe()

      setTimeout(function() {
        led.stop().off()
      }, 500)
    }
  })
})

var board = new johnny.Board
var PIN_LED = 13
var led

// Connecting to the Arduino happens asynchronously
// in the background, so you can't start sending it
// commands immediately. `board` is also an EventEmitter,
// and fires the `ready` event when it's ready for
// you to start firing commands.
board.on('ready', function() {
  led = new johnny.Led(PIN_LED)
})
