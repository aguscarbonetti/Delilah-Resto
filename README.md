# Delilah Restó
## Descripción
Delilah Restó es una api desarrollada en Node.js con múltiples endpoints siendo su objetivo facilitar las operaciones de pedidos de un restaurante.
## Inicializar el server
- Descargar el repositorio `git clone https://github.com/aguscarbonetti/Delilah-Resto.git`
- Instalar las dependencias dentro de la carpeta del proyecto `npm install`
- Levantar una base de datos MySQL (para el proyecto se utilizó XAMPP con los módulos 'Apache' y 'MySQL')
- Crear la base 'delilah_resto' e importar el archivo `delilah_resto.sql` a la base de datos
- Inicializar el servidor `node index.js` o bien con `nodemon`
- Utilizar Postman con el collection incluído en el repositorio
- Se incluyen un usuario con permisos básicos con usuario: **user** password: **user** y un usuario administrador con usuario: **admin** password: **admin**
- Para los endpoints que requieran autorización es necesario agregar en el header el JWT que es obtenido del login dentro de la key 'Authorization'.