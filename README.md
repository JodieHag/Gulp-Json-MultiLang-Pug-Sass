#Starter Template
**Actualizado: 17/01/2022**

###NodeJs, Pug, i18n, Json, Sass, esLint
##Previa introducción

Este proyecto está hecho con Node.js, por ello necesitaremos instalar previamente [NodeJS](https://nodejs.org/es/)

Una vez clonado el proyecto en vuestra máquina, podreis ver que se compone de una carpeta **dev**, un archivo **gulpfile.js**, un **package.json**, el **.gitignore** y este **Readme.md** hecho con MarkDown.

**Recuerda que para que el liveReload funcione, necesitas tener su extensión instalada en tu navegador [Link](http://livereload.com/extensions/) ;)**

Bien, empezaremos por lo más básico, que es el **package.json**.

###package.json
Es el archivo que necesitamos de base para cualquier proyecto node, donde declararemos el nombre del proyecto, su descripción, los modulos que necesitaremos utilizar y sus dependendecias, el autor del proyecto... Aquí declararemos todo lo necesario sobre nuestro proyecto, para que cuando procedamos a su inicialización se proceda a descargar todos los recursos necesarios para ejecutarlo.

Os dejo un link de información más detallado para que podais ver las reglas de definición y uso [pakage.json](https://docs.npmjs.com/files/package.json).

Ahora mismo este archivo nos viene incluido en el proyect porque yo previamente lo he creado, y después lo he subido. Si vosotros quisierais crear un proyecto de 0 tendríais que ejecutar:

`$npm init`

Para inicializarlo y ir rellenando por consola los datos para que te genere el archivo. Podeis encontrar la documentación necesaria para inicializar un proyecto de node de 0 en [Node Docs](https://docs.npmjs.com/).

###.gitigonre

Todos sabemos como funciona, como esto es un proyecto de git, aquí colocamos los archivos que queremos que el repositorio ignore y no suba, en este caso no subiremos los node_modules que nos generará el package.json con las dependencias y modulos de node, y el www, que es donde nos compilará nuestro trabajo, tampoco será necesario que nos lo suba, puesto que sólo deberíamos guardar el dev, para desarrollar.

###gulpfile.js
Donde se va a basar prácticamente el 80% de nuetra formación, y lo que es el "cerebro" y "corazón" de nuestro proyecto node, arracanado con gulp. (+ info [aquí](http://gulpjs.com/)). Gulp es un conjunto de herramientas para la automatización de tareas, donde podremos construir, en este ejemplo, la compilación sass y pug, minificación de archivos, compilación de plantillas en multilingual... Existen otras variantes como Grunt o Webpack...

##Inicialización
Vamos a empezar a arrancar nuestro proyecto starter, para ello vamos a la consola, nos movemos a la raiz del proyecto y ejecutamos

`$npm install`

Una vez finalizada la descarga de todas las depencias tenemos creadas en nuestro gulp dos tareas diferentes, la default y la dist.

La default nos ejecuta todas la tareas que hemos definido, solo tendremos que ejecutar

`$npm start`

Para el modo desarrollador y empezar a trabajar.

La siguiente tarea es para cuando finalicemos y queramos realizar el paquete de entregable a cliente, en este caso nos genera un zip, donde tendremos todos los htmls, css, js, img's...

`$npm run build`
