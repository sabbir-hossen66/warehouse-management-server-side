const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnzdr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const categoryCollection = client.db('bookHouse').collection('category');
        const itemCollection = client.db('bookHouse').collection('item')

        app.get('/category', async (req, res) => {
            const query = {};
            const cursor = categoryCollection.find(query);
            const categories = await cursor.toArray();
            res.send(categories);
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const category = await categoryCollection.findOne(query);
            res.send(category);
        });
        //  POST
        app.post('/category', async (req, res) => {
            const newCategory = req.body;
            const result = await categoryCollection.insertOne(newCategory);
            res.send(result);
        });
        // DELETE
        app.delete('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await categoryCollection.deleteOne(query);
            res.send(result);
        });
        // Item Collection Api
        app.get('/myitem', async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { email: email };
            const cursor = itemCollection.find(query);
            const myItem = await cursor.toArray();
            res.send(myItem)

        })

        app.post('/item', async (req, res) => {
            const item = req.body;
            const result = await itemCollection.insertOne(item);
            res.send(result);

        });

    }
    finally {

    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running book service')
});

app.listen(port, () => {
    console.log('Listening to port', port);
})
// finish

