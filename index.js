const express = require('express')
const app = express();
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const uri = `mongodb+srv://${process.env.MOBILEDB_USER}:${process.env.MOBILEDB_PASSWORD}@cluster0.pzjaifg.mongodb.net/?retryWrites=true&w=majority`;


app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;






// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {


        const userCollection = client.db('mobileBikroy').collection('allUsers');

        app.post('/allUsers', async(req,res) =>{
            console.log(req.body)
            const query = req.body;
            const result = await userCollection.insertOne(query)
            res.send(result)
        })
        app.get('/allUsers', async(req,res) =>{
            const query = {};
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })
        app.put('/allUsers/:id', async(req,res) =>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const option = {upsert: true}
            const updatedDoc = {
                $set:{
                    role: 'admin'
                }
                
            }
            const result = await userCollection.updateOne(filter,updatedDoc,option)
            res.send(result)
        })
        app.delete('/allUsers/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
        app.get('/allUsers/seller/:email', async(req,res) =>{
            const email = req.params.email;
            console.log(email)
            const query = {email};
            const user = await userCollection.findOne(query)
            res.send({isSeller: user?.accountType === 'Seller'})
        })
        app.get('/allUsers/admin/:email', async(req,res) =>{
            const email = req.params.email;
            console.log(email)
            const query = {email};
            const user = await userCollection.findOne(query)
            res.send({isAdmin: user?.role === 'admin'})
        })
        
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('mobile bikroy server running')
})

app.listen(port, () => {
    console.log(`mobile bikroy server running on ${port}`)
})



//IT9ynfIATbUDwlmX

//mobileBikroy