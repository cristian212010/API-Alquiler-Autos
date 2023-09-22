import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/api/alquiler', routes)

app.listen(port, ()=>{
    console.log(`Server listening on ${port}`);
})