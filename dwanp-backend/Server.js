//port
const port = 3001;
const host = "localhost";
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const emprouter = require("./routes/employee_router");
//creating for the sockets remove this if anything goes wrong
const io = require('socket.io')(port)

const chatusers = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    chatusers[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    io.emit('chat-message', { message: message, name: chatusers[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', chatusers[socket.id])
    delete chatusers[socket.id]
  })
})
//to import routers

// adala cmnt ekat ytin line eke router path dapan adala thana
//menu
const menrouter = require('./routes/menu_router');

//inventory
const invrouter = require("./routes/inventory_router");

//order
const orderrouter = require('./routes/order_router');
//employee

//table
const tablerouter = require('./routes/table_router');

//authentication  
//importing auth router
const auth_user_router = require('./routes/auth_user_router')

app.use(cors());
app.use(express.json());
//username for the db navindu0315
//password dwanp5

//creating the db connection string
//meka chnge krnna epa
const uri =
  "mongodb+srv://navindu0315:dwanp5@dwanp.2xoqrcy.mongodb.net/?retryWrites=true&w=majority";
const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("connected to mongodb");
  } catch (error) {
    console.log("mongodb error ", error);
  }
};

connect();
const server = app.listen(port, host, () => {
  console.log("Node server is listenging to ", server.address().port);
});





//wish
app.use('/api',orderrouter);
app.use("/api", emprouter);
app.use("/api", invrouter);
app.use('/api',menrouter);
app.use('/api', tablerouter);

//for the authentication here um gonna use  my own but in the tutorial it says ('./api/user',auth_user_router)
app.use('/api/user',auth_user_router);

