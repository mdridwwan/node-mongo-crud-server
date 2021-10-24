const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;


const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

//mongodb user pass
// user: mydbuser1
// pass: YHCGBQD1DJE4r0VP
//user: mydbuser2
//pass: 98nODhTUbh52n2OG
//user: mydbuser3
//pass: 98nODhTUbh52n2OG

const uri = "mongodb+srv://mydbuser3:98nODhTUbh52n2OG@cluster0.ufevr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//     const collection = client.db("foodmater").collection("users");
//     // perform actions on the collection object
//     console.log('hitting with database')

//     const user = {name: 'Farhan', email: 'farhan@gmail.com', phone: '016480234843'}
//     collection.insertOne(user)
//     .then( () =>{
//             console.log('insert success')
//     })

//     // client.close();
// });

async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const users = database.collection("users");
       
        //get api
        app.get('/users', async(req, res) =>{
            const cursor = users.find({});
            const user = await cursor.toArray();
            res.send(user);
        })
        // Post Api
        app.post('/users', async (req, res) =>{
            const newUser = req.body;
            const result = await users.insertOne(newUser)
            console.log('hitting the poSSSSSST', req.body)
            res.json(result)
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        })

        app.get('/users/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const user = await users.findOne(query)
            console.log('load  user with id: ', id);
            res.send(user);
        })

        //Delete api
        app.delete('/users/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await users.deleteOne(query);

            console.log('deleting user with id', result);
            res.json(result);
        })
    } 
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Running my Crud Server');
})

app.listen(port, () =>{
    console.log('Runnig Server on port', port);
})