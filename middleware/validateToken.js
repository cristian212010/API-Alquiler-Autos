import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.DDBB);
const db = client.db('AlquilerAutos');
const Empleado = db.collection('empleado');

const validateToken = async (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        await client.connect();
        const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
        const empleado = await Empleado.find({ _id: new ObjectId(uid) }).toArray();
        client.close();
        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }
};

export default validateToken;