import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const router = express.Router();
const client = new MongoClient(process.env.DDBB);
const db = client.db('AlquilerAutos');
const Cliente = db.collection('cliente');

router.get('/getAll' , async (req, res) => {
    try {
        await client.connect();
        const info = await Cliente.find().toArray();
        res.json(info);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

router.post('/insertData' , async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        const response = await Cliente.insertOne(data);
        res.json({
            response,
            data
        });
        client.close();
    } catch (error) {
        console.log(error);
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        await client.connect();
        const id = req.params.id;
        const response = await Cliente.deleteOne({_id: new ObjectId(id)})
        res.json(response)
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        const id = req.params.id;
        await Cliente.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data });
        res.send(data)
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

export default router;