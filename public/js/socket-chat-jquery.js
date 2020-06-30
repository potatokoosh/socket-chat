
var params = new URLSearchParams( window.location.search );

var nombre = params.get('nombre');
var sala = params.get('sala');

// referencias de jQuery, traido por id a divUsuarios, que esta en el chat.html
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');

//Funciones para renderizar usuarios
function renderizarUsuarios( personas ){ // [{},{},{}]

  //console.log('antes ciclo for',personas);

  var html = '';

  //creo de forma dinamica por params el nombre de la sala
  html += '<li>';
  html += '  <a href="javascript:void(0)" class="active"> Chat  de <span> '+ params.get('sala') +' </span></a> ';
  html += '</li>';

  // traemos el nombre de los usuarios que estan en la sala
  for( var i = 0; i < personas.length; i++ ){
    //console.log('siclo for',personas);

    html += '<li>';
    html += '  <a data-id="'+ personas[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> '+ personas[i].nombre +' <small class="text-success">online</small></span></a>';
    html += '</li>';

  }

  //con esto asigno a divUsuario que tenga todo el html de esta funcion
  divUsuarios.html(html);

}

function renderizarMensajes ( mensaje, yo ){

  var html = '';
  var fecha = new Date(mensaje.fecha);
  var hora = fecha.getHours()+ ':' + fecha.getMinutes();

  var adminClass = 'info';//este info lo encontramos en el html que construimos abajo 'box bg-light-info'
  if( mensaje.nombre === 'Administrador'){
    adminClass = 'danger';//esto es un color que le vamos a dar si es administrador
  }

  if( yo ){ 

    html +=     ' <li class="reverse"> ';
    html +=   '   <div class="chat-content"> ';
      html += '     <h5> '+ mensaje.nombre +' </h5> ';
      html += '     <div class="box bg-light-inverse"> '+ mensaje.mensaje +' </div> ';
    html +=   '   </div> ';
    html +=   '   <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div> ';
    html +=   '   <div class="chat-time"> '+hora+' </div> ';
  html +=     ' </li> ';  
    
  }else{
    
    html +=   '<li class="animated fadeIn">';

    if(mensaje.nombre !== 'Administrador'){
      html += '   <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    }

      html += '   <div class="chat-content">';
      html += '   <h5>' + mensaje.nombre + '</h5>';
      html += '   <div class="box bg-light-' +adminClass+ ' ">'+ mensaje.mensaje +'</div>';
      html += '   </div>';
      html += '   <div class="chat-time"> '+hora+' </div>';
    html +=   '</li>';

  }
        
  divChatbox.append(html);// construyo el html con la info correspondiente

}


//funcion para que siempre este la vista en el chat en el ultimo mensaje escrito 
function scrollBottom() {

  // selectors
  var newMessage = divChatbox.children('li:last-child');

  // heights
  var clientHeight = divChatbox.prop('clientHeight');
  var scrollTop = divChatbox.prop('scrollTop');
  var scrollHeight = divChatbox.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight() || 0;

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      divChatbox.scrollTop(scrollHeight);
  }
}

// Listeners,, cuando hagan click en un divUsuarios ejecute la siguiente function,, la 'a' refiere a esta <a></a>
divUsuarios.on('click', 'a', function(){

  // este this refiere por jquery a los html mensionados anteriormente,, lo mismo refiere al id ,, <a data-id=
  var id = $(this).data('id'); 
  if(id){
    console.log(id);
  }
});

// creo un listener, cuando se haga la accion submit, esto me trae un informacion que la estoy mentiendo en e
formEnviar.on('submit', function(e){

  //preventDefault() es una function que evita que al precionar enter se envie el submit
  e.preventDefault();

  //val(),, es una funcion que me permite trear el valor que tiene en este caso txtMensaje
  //trim(),, es una funcion que quita los espacios al principio y al final
  if( txtMensaje.val().trim().length === 0){// si la caja te texto esta vacia que no haga nada
    return;
  }

  console.log(txtMensaje.val());
  //emit, son eventos para enviar informacion,, 
//primer parametro, nombre del evento,, no utilizar caracteres especialesespacios
//segundo parametro es la informacion que voy a enviar y es bueno que sea en obj{} para poder envar varia informacion
//tercer parametro: es una function que se ejecuta si todo sale bien
//Este mensaje lo vemos en la terminal
socket.emit('crearMensaje', {
    nombre: nombre,
    mensaje: txtMensaje.val()
},function(mensaje){//esta function hace de callback, sirve para saber si se enviomensaje
    txtMensaje.val('').focus();//val(''), hacemos que este callback quede vacio una vez se envie el mensaje para que la caja de texto no toque borrar el texto enviado,,
    //focus(),, es para que cuando se envie el mensaje quede aun el foco dentro de la caja de texto para seguir enviando mensajes

    renderizarMensajes(mensaje, true);// metemos la info de crearMensaje en el html
    // el true es para diferenciar el yo, por que de acuerdo a la funcion renderizar el if (yo), refiere a la vista de quien esta escribiendo el mensaje que refiere a yo

    scrollBottom();// llamamos esta funcion para para que cuando se escriba un mensaje la pantalla de vista de mensajes siempre este  mostrando el ultimo mensaje escrito
});


})