const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

var jwt = require('jsonwebtoken');


const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.hayv0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();
        const booksCollection = client.db('book-stock-manager').collection('book-stock');

        app.get('/books', async(req, res) => {
            const query = {};
            const cursor = booksCollection.find(query)
            const books = await cursor.toArray()
            res.send(books)
        });

        app.get('/books/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const books = await booksCollection.findOne(query)
            res.send(books)
        })

        app.post('/books', async(req, res) => {
            const newBook = req.body;
            const result = await booksCollection.insertOne(newBook)
            res.send(result)
        })

        app.post('/login', (req, res) => {
            const email = req.body;
            var token = jwt.sign(email, process.env.USER_TOKEN);
            res.send({token})
            console.log(token);
        })

        app.delete('/books/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await booksCollection.deleteOne(query)
            res.send({success: 'successfully added'})
        })

    }
    finally{

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Running book stock manager')
})

app.listen(port, () => {
    console.log('Listening to port', port);
})