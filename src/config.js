/**
 * Para instalar babel y usar comandos antiguos y comandos nuevos de JS
 * En el caso de export default para exportar una variable y usarla en el enviroment
 * El guion -D es para instalarlo en dev depencies solamente.
 * npm i @babel/core @babel/cli @babel/node @babel/preset-env -D
 */
import { config } from 'dotenv';
config();

export default {
    mongodbURL: process.env.MONGODB_URI || 'mongodb://localhost/ventas_toteat'
}
