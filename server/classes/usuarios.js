/*{ 
    id: 'adfasd',
    nombre: 'Jose',
    sala: 'Video Juegos'
  }*/



class Usuarios {

  constructor(){
    this.personas = [];
  }

  agregarPersona(id, nombre, sala){
    let persona = { id, nombre, sala };

    //mando el valor del array de agregarPersona al valor de constructor personas
    this.personas.push(persona);

    return this.personas;

  }

  //filter nos ayuda a filtrar en el array de this.personas, y creamos una funcion donde llamamos el parametro (persona =>{retornamos una condicion})
  getPersona( id ){
    let persona = this.personas.filter( persona => persona.id === id )[0]//ponemos la posicion [0], por que filter returna un array y queremos siempre la primer posicion;
    return persona;
  }

  getPersonas(){
    return this.personas;
  }

  getPersonasPorSala( sala ){
    let personasEnSala = this.personas.filter( persona => persona.sala === sala);
    return personasEnSala;
  }

  borrarPersona(id){
    //Esta persona se va a borrar por eso se pone al inicio de esta misma funcion
    let personaBorrada = this.getPersona(id);

    //renuevo el arreglo de this.personas
    this.personas = this.personas.filter( persona => persona.id != id ); // este return me trae un nuevo array con las objetos persona dentro de this.personas que tengan id diferente el que mandamos por parametros, y creamos un nuevo this.personas

    return personaBorrada;
  }

}

module.exports = {
  Usuarios
}