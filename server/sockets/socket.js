const { io } = require('../server');

const { Usuarios } = require('../classes/usuarios');
const usuarios = new Usuarios();//inicializo el constructor

const { crearMensaje } = require ('../util/utilidades')

//on: evento que escucha informacion
io.on('connection', (client) => { 
    
  client.on('entrarChat', (data, callback) => {
      //el parametro data viene desde socket.chat con el valor

      if(!data.nombre || !data.sala ){// si no viene ningun usuario mande el callback
          return callback({
              error: true,
              mensaje: 'El nombre y sala es necesario'
          })
      }

      client.join(data.sala);

      //agregarPersona(id, nombre),, requiere el id y el nombre por que asi se mensiono en el constructor del archivo usuario.js,,, client.id es una referencia que lo crea el socket
      usuarios.agregarPersona(client.id, data.nombre, data.sala);

      //evento que va a indicar cada ves que una persona entre o salga da la sala de chat, solo a los de la misma sala
      client.broadcast.to(data.sala).emit('ListaPersona', usuarios.getPersonasPorSala(data.sala));

      callback(usuarios.getPersonasPorSala(data.sala));

  });

  client.on('crearMensaje', (data) => {

    let persona = usuarios.getPersona(client.id);

    let mensaje = crearMensaje( persona.nombre, data.mensaje );
    //vamos a enviar mensaje solo a las personas que esten en la misma sala
    client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
  });

  client.on('disconnect', ()=> {

    let personaBorrada = usuarios.borrarPersona(client.id)

    //cuando un usuario se desconecte quiero informar a los demas usuario de la misma sala, que un usuario salio de sala
    client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${ personaBorrada.nombre } salio`));

    //Actualizamos la lista de los usuarios que hay
    client.broadcast.to(personaBorrada.sala).emit('ListaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));


  });

  // Mensajes privados
  client.on('mensajePrivado', data => {

    let persona = usuarios.getPersona( client.id );

    //para referenciar a un usuario en especifico se crea un nuevo parametro aqui directamente a data y la llamamos (para), a este campo desde consola web le damos el valor del id del usuario al que le queremos mandar el mensaje privado
    client.broadcast.to(data.para).emit( 'mensajePrivado', crearMensaje( persona.nombre, data.mensaje ) );

  });

});