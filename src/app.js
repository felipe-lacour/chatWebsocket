import express from "express";
import {engine} from "express-handlebars";
import {__dirname} from "./utils.js";
import path from "path";
import {viewsRouter} from "./routes/views.routes.js";
import {Server} from "socket.io";

const port = process.env.PORT || 8080;
const app = express();

// middlewares
app.use(express.static(path.join(__dirname, "/public")));

const httpServer = app.listen(port, ()=> console.log(`Server listening on port ${port}`));

// servidor socket
const io = new Server(httpServer);

// configuracion de handlebars
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, './views'));

// routes
app.use(viewsRouter);

let messages = [];
// socket server
io.on("connection", (socket) => {
  console.log("nuevo cliente conectado");
  io.emit("messageHistory", messages);
  socket.on("message", (data) => {
    console.log(data);
    messages.push(data);

    // cada vez que recibamos ese mensaje encuamos todos los mensajes a todos los usuarios conectados
    io.emit("messageHistory", messages);
  })

  socket.on("authenticated", msg => {
    socket.emit("messageHistory", messages)
    socket.broadcast.emit("newUser", msg)
  })
})