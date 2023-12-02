const express = require('express')
const app = express();
const cors = require('cors')

require('dotenv').config()


app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000;


console.log(process.env.MOBILEDB_PASSWORD)


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MOBILEDB_USER}:${process.env.MOBILEDB_PASSWORD}@cluster0.pzjaifg.mongodb.net/?retryWrites=true&w=majority`;

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