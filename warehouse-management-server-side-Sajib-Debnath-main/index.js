const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fdvwd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("ghuraguri");
        const haiku = database.collection("haiku");
        const servicesCollection = database.collection("services");
        const teamCollection = database.collection("members");
        const reviewsCollection = database.collection("reviews");
        const allOrdersCollection = database.collection("allOrders");



        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })


        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.send(service);
        })


        app.post('/services', async (req, res) => {
            const service = req.body;

            const result = await servicesCollection.insertOne(service);
            res.json(result)
        });



        app.get('/team', async (req, res) => {
            const cursor = teamCollection.find({});
            const team = await cursor.toArray();
            res.send(team);
        })



        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            console.log(reviews);
            res.send(reviews);
        })



        app.post('/allOrders', async (req, res) => {
            const allOrders = req.body;

            const result = await allOrdersCollection.insertOne(allOrders);
            res.json(result)
        });

        app.get('/allOrders', async (req, res) => {
            const cursor = allOrdersCollection.find({});
            const allOrders = await cursor.toArray();
            res.send(allOrders);
        })

        app.put('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            const updatedAllOrders = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedAllOrders.status,
                },
            };
            const result = await allOrdersCollection.updateOne(filter, updateDoc, options)
            res.json(result)
        })
        // DELETE ALL ORDERS
        app.delete('/allOrders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allOrdersCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hi');
})

app.listen(port, () => {
    console.log('I get your port which is', port);
})