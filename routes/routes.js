import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const router = express.Router();
const client = new MongoClient(process.env.DDBB);
const db = client.db('AlquilerAutos');
const Alquiler = db.collection('alquiler');
const Automovil = db.collection('automovil');
const Cliente = db.collection('cliente');
const Empleado = db.collection('empleado');
const Reserva = db.collection('reserva');
const Sucursal = db.collection('sucursal');
const Sucursal_automovil = db.collection('sucursal_automovil');

// 2. Mostrar todos los clientes registrados en la base de datos.
router.get('/endpoint2', async (req, res) =>{
    try {
        await client.connect();
        const result = await Cliente.find().toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 3. Obtener todos los automóviles disponibles para alquiler.
router.get('/endpoint3', async (req, res) =>{
    try {
        await client.connect();
        const result = await Alquiler.aggregate([
            {
                $match: {$or:[{'Estado': 'Finalizado'},{'Estado': 'Cancelado'}]}
            },
            {
                $lookup:{
                    from: "automovil",
                    localField: "ID_Automovil",
                    foreignField: "ID_Automovil",
                    as: "automovil"
                }
            },
            {
                $project:{
                    _id: 0,
                    automovil: 1
                }
            }
        ]).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 4. Listar todos los alquileres activos junto con los datos de los clientes relacionados.
router.get('/endpoint4', async (req, res) =>{
    try {
        await client.connect();
        const result = await Alquiler.aggregate([
            {
                $match:{
                    'Estado':'Activo'
                }
            },
            {
                $lookup:{
                    from: "cliente",
                    localField: "ID_Cliente",
                    foreignField: "ID_Cliente",
                    as: "cliente"
                }
            }
        ]).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 5. Mostrar todas las reservas pendientes con los datos del cliente
router.get('/endpoint5', async (req, res) =>{
    try {
        await client.connect();
        const result = await Reserva.aggregate([
            {
                $match: {
                    'Estado': 'Pendiente'
                }
            },
            {
                $lookup:{
                    from: "cliente",
                    localField: "ID_Cliente",
                    foreignField: "ID_Cliente",
                    as: "cliente"
                }
            }
        ]).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 6. Obtener los detalles del alquiler con el ID_Alquiler específico.
router.get('/endpoint6/:id', async (req, res) =>{
    try {
        await client.connect();
        const result = await Alquiler.find({ID_Alquiler: parseInt(req.params.id)}).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 7. Listar los empleados con el cargo de "Vendedor".
router.get('/endpoint7', async (req, res) =>{
    try {
        await client.connect();
        const result = await Empleado.find({Cargo: 'Vendedor'}).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 8. Mostrar la cantidad total de automóviles disponibles en cada sucursal.
router.get('/endpoint8', async (req, res) =>{
    try {
        await client.connect();
        const result = await Sucursal_automovil.aggregate([
            {
                $group:{
                    _id: '$ID_Sucursal',
                    Cantidad_Disponible: {
                        $sum: '$Cantidad_Disponible'
                    }
                }
            },
            {
                $project: {
                    _id:0,
                    ID_Sucursal: '$_id',
                    Cantidad_Disponible: '$Cantidad_Disponible'
                }
            }
        ]).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 9. Obtener el costo total de un alquiler específico.
router.get('/endpoint9/:id', async (req, res) =>{
    try {
        await client.connect();
        const result = await Alquiler.aggregate([
            {
                $match: {
                    'ID_Alquiler': parseInt(req.params.id)
                }
            },
            {
                $project: {
                    _id: 0,
                    ID_Alquiler: '$ID_Alquiler',
                    Costo_Total: '$Costo_Total',
                }
            }
        ]).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 10. Listar los clientes con el DNI específico.
router.get('/endpoint10/:dni', async (req, res) =>{
    try {
        await client.connect();
        const result = await Cliente.find({DNI: req.params.dni}).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 11. Mostrar todos los automóviles con una capacidad mayor a 5 personas.
router.get('/endpoint11', async (req, res) =>{
    try {
        await client.connect();
        const result = await Automovil.find({Capacidad: {$gt: 5}}).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 12. Obtener los detalles del alquiler que tiene fecha de inicio en '2023-07-05'.
router.get('/endpoint12', async (req, res) =>{
    try {
        await client.connect();
        const result = await Alquiler.find({Fecha_Inicio: '2023-07-05'}).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 13. Listar las reservas pendientes realizadas por un cliente específico.
router.get('/endpoint13', async (req, res) =>{
    try {
        await client.connect();
        const result = await Reserva.find({$and: [{ID_Cliente: 1},{Estado:'Pendiente'}]}).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 14. Mostrar los empleados con cargo de "Gerente" o "Asistente".
router.get('/endpoint14', async (req, res) =>{
    try {
        await client.connect();
        const result = await Empleado.find({$or: [{Cargo: 'Gerente'}, {Cargo: 'Asistente'}]}).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 15.Obtener los datos de los clientes que realizaron al menos un alquiler.
router.get('/endpoint15', async (req, res) =>{
    try {
        await client.connect();
        const result = await Alquiler.aggregate([
            {
                $lookup:{
                    from: "cliente",
                    localField: "ID_Cliente",
                    foreignField: "ID_Cliente",
                    as: "cliente"
                }
            },
            {
                $project:{
                    _id: 0,
                    cliente: '$cliente'
                }
            }
        ]).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 16. Listar todos los automóviles ordenados por marca y modelo.
router.get('/endpoint16', async (req, res) =>{
    try {
        await client.connect();
        const result = await Automovil.find().sort({Marca:1},{Modelo: 1}).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 17. Mostrar la cantidad total de automóviles en cada sucursal junto con su dirección.
router.get('/endpoint17', async (req, res) =>{
    try {
        await client.connect();
        const result = await Sucursal.aggregate([
            {
                $lookup: {
                    from: "sucursal_automovil",
                    localField: "ID_Sucursal",
                    foreignField: "ID_Sucursal",
                    as: "sucursal_automovil"
                }
            },
            {
                $group: {
                    _id: '$ID_Sucursal',
                    Direccion: { $first: "$Direccion" },
                    Cantidad_Total_Automoviles: { $sum: '$sucursal_automovil.Cantidad_Disponible' }
                }
            },
            {
                $project: {
                    _id: 0,
                    ID_Sucursal: '$_id',
                    Direccion: 1,
                    Cantidad_Total_Automoviles: 1
                }
            }
        ]).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 18. Obtener la cantidad total de alquileres registrados en la base de datos.
router.get('/endpoint18', async (req, res) =>{
    try {
        await client.connect();
        const result = await Alquiler.countDocuments(); 
        res.json(`La cantidad total de alquileres registrados en labase de datos son: ${result}`);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 19. Mostrar los automóviles con capacidad igual a 5 personas y que estén disponibles.
router.get('/endpoint19', async (req, res) =>{
    try {
        await client.connect();
        const result = await Alquiler.aggregate([
            {
                $lookup:{
                    from: "automovil",
                    localField: "ID_Automovil",
                    foreignField: "ID_Automovil",
                    as: "Automovil"
                }
            },
            {
                $unwind:'$Automovil'
            },
            {
                $match:{
                    Estado: 'Finalizado',
                    $expr: { $eq: ["$Automovil.Capacidad", 5] }
                }
            },
            {
                $project: {
                    _id: 0,
                    Automovil: 1
                }
            }            
        ]).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 20. Obtener los datos del cliente que realizó la reservacion.
router.get('/endpoint20', async (req, res) =>{
    try {
        await client.connect();
        const result = await Reserva.aggregate([
            {
                $lookup:{
                    from: "cliente",
                    localField: "ID_Cliente",
                    foreignField: "ID_Cliente",
                    as: "Cliente"
                }
            }
        ]).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

// 21. Listar los alquileres con fecha de inicio entre '2023-07-05' y '2023-07-10'.
router.get('/endpoint21', async (req, res) =>{
    try {
        await client.connect();
        const result = await Alquiler.find({$and: [{Fecha_Inicio: {$gte: '2023-07-05'}},{Fecha_Inicio: {$lte: '2023-07-10'}}]}).toArray(); 
        res.json(result);
        client.close();
    } catch (error) {
        res.status(404).json({message: error.message});
    }
});

export default router;