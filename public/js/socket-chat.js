//este archivo se consume desde index.html

//este io() viene de la libreria socket.io,, que se importa desde el chat.html
var socket = io();

var params = new URLSearchParams( window.location.search );

if( !params.has('nombre') || !params.has('sala') ) {
    window.location = 'index.html';//si no viene el params lo envie al index.html,, para que se registre
    throw new Error('El nombre y sala son necesarios')
}

var usuario = {
    nombre: params.get('nombre'),//viene de la url http://localhost:3000/chat.html?nombre=Jose
    sala: params.get('sala')
};

//on,, son eventos para escuchar informacion
//aqui es importante utilizar una function normal por que no estamos en node
socket.on('connect', function(){
    console.log('Conectado al Servidor');

    //este usuario viene por params del var usuario mensionado arriba
    socket.emit('entrarChat', usuario, function(resp){
        //console.log('Usuarios conectados render', resp);
        renderizarUsuarios(resp);
    })
});

//socket.on ('disconnect'), es por si se pierde conecion con el servidor
socket.on('disconnect', function(){
    console.log('Perdimos conecion con el servidor');
});

//emit, son eventos para enviar informacion,, 
//primer parametro, nombre del evento,, no utilizar caracteres especialesespacios
//segundo parametro es la informacion que voy a enviar y es bueno que sea en obj{} para poder envar varia informacion
//tercer parametro: es una function que se ejecuta si todo sale bien
//Este mensaje lo vemos en la terminal
/*socket.emit('crearMensaje', {
    usuario: 'Jose',
    mensaje: 'Hola Mundo'
},function(resp){//esta function hace de callback, sirve para saber si se enviomensaje
    console.log('respuesta server: ', resp);
});*/

//on: evento para escuchar informacion,, recibe una function
socket.on('crearMensaje', function(mensaje){
    //console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false);//aqui ponemos false por que lo que queremos diferenciar es la vista del chat de conversacion, y este escucha el mensaje de quien lo emit, y en este caso el if(yo) debe de ser false para que renderizarMensajes tome el else

    scrollBottom();// llamamos esta funcion para para que cuando se escriba un mensaje la pantalla de vista de mensajes siempre este  mostrando el ultimo mensaje escrito
});

//Escuchar cambios de usuarios,, cuando un usuario entra o sale del chat
socket.on('ListaPersona', function(personas){
    console.log(personas);
    renderizarUsuarios(personas)
});

// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje Privado: ', mensaje);
});