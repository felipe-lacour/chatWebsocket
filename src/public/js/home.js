const socketClient = io();

const chatbox = document.getElementById("chatbox");
const chat = document.getElementById("messageLogs")

let user;

Swal.fire({
  title:"Identificate",
  input:"text",
  text:"Ingresa un nombre de usuario para el chat",
  inputValidator:(value)=>{
    if(!value){
      return "El nombre de usuario es obligatorio";
    }
  },
  allowOutsideClick: false
}).then((result) => {
  user = result.value;
  socketClient.emit("authenticated", `usuario ${user} ha iniciado sesion`)
});

chatbox.addEventListener("keyup", (e)=> {
  if(e.key === "Enter"){
    if(chatbox.value.trim().length > 0){ // corroboramos que el usuariono envie datos vacios
      socketClient.emit("message", {user: user, message: chatbox.value});
      chatbox.value = "";
    }
  }
});

socketClient.on("messageHistory", (dataServer)=> {
  let messageElements = "";
  // console.log(dataServer);
  dataServer.forEach( i=> {
    messageElements += `${i.user}: ${i.message} <br/>`
  })

  chat.innerHTML = messageElements;
})

socketClient.on("newUser", data => {
  if(user){
    // si el usuario ya esta autenticado, entonces puede recibir notificaciones
    Swal.fire({
      text:data,
      toast: true,
      position:"top-right"
    })
  }
});