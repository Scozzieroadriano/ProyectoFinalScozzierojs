# ProyectoFinalScozziero
Pagina con informacion deportiva sobre futbol:

Index: Login de usuario: busca si existe un usuario en el localStorage, si existe redirecciona a la siguiente pagina, sino
si el usuario es otro al logeado limbia el localstorage y sube un usuario nuevo, si no existe guarda el usuario normalmente.

Una vez redireccionados 
Estadistica:

Muestra las posiciones simuladas de los equipos, muestram posicion, nombre equipo, partido jugado, partido ganado, partido empatado, perdido, 
goles favor, goles contra, diferencia goles,
Tambien muestra una simulacion de como salieron los equipos en algunos partidos de las fechas 1 y 2(sirve para todas las fechas pero
en el json hay solo 2 fechas, si el usuario quiere ver la fecha 3 va a obtener un error)

Prode:
Despues tenemos la pagina de prode, se consulta un json con inforamcion simulada de prodes, y se obtiene los datos de los usuarios ordenados por
puntaje.
Recomiendo usar el usuario Admin, que tiene 0 puntaje, para una mejor experiencia.
Tiene 0 puntos, y los demas puntajes estan fijos en el json, el programa funciona para todos los usuarios logeados, ya que primero obtiene 
datos del json, pero una vez guardado el pronostico se actualiza la tabla de posiciones con un objeto copiado del que obtengo del json,
de esta forma puedo simular un metodo put.

Muchas gracias por las correcciones, quedo a la espera para poder mejorar la pagina.
