import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const router = express.Router();
const client = new MongoClient(process.env.DDBB);
const db = client.db('AlquilerAutos');
const Alquiler = db.collection('alquiler');

router.get('/getAll', async (req, res) => {
    try {
        await client.connect();
        const info = await Alquiler.find().toArray();
        res.json(info);
    } catch (error) {
        res.status(404).json({ message: error.message });
    } finally {
        client.close();
    }
});

router.post('/insertData', async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        const response = await Alquiler.insertOne(data);
        res.json({
            response,
            data
        });
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        await client.connect();
        const id = req.params.id;
        const response = await Alquiler.deleteOne({ _id: new ObjectId(id) });
        res.json(response);
    } catch (error) {
        res.status(404).json({ message: error.message });
    } finally {
        client.close();
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        await client.connect();
        const data = req.body;
        const id = req.params.id;
        await Alquiler.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data });
        res.send(data);
    } catch (error) {
        res.status(404).json({ message: error.message });
    } finally {
        client.close();
    }
});

export default router;
