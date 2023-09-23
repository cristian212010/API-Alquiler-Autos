import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/routes.js';
import routerCliente from './controllers/cliente.controller.js';
import routerAlquiler from './controllers/alquiler.controller.js';
import routerReserva from './controllers/reserva.controller.js';
import routerSucursalAutomovil from './controllers/sucursal_automovil.controller.js'

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/api/alquiler', routes);
app.use('/crud/cliente', routerCliente);
app.use('/crud/alquiler', routerAlquiler);
app.use('/crud/reserva', routerReserva);
app.use('/crud/sucursalAutomovil', routerSucursalAutomovil);

app.listen(port, ()=>{
    console.log(`Server listening on ${port}`);
})