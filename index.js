const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();

app.use(cors());
app.use(express.json());


// Connect mongodb
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.hayv0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const booksCollection = client.db('book-stock-manager').collection('book-stock');

        //for showing to UI
        app.get('/books', async (req, res) => {
            const query = {};
            const cursor = booksCollection.find(query)
            const books = await cursor.toArray()
            res.send(books)
        });

        // get books by id
        app.get('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const books = await booksCollection.findOne(query)
            res.send(books)
        })

        // create product
        app.post('/books', async (req, res) => {
            const newBook = req.body;
            const result = await booksCollection.insertOne(newBook)
            res.send(result)
        })

        // delete products
        app.delete('/books/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await booksCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running book stock manager')
})

app.listen(port, () => {
    console.log('Listening to port', port);
})