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


        const productCollection = client.db('mobileBikroy').collection('products');
        const userCollection = client.db('mobileBikroy').collection('allUsers');
        const categoryCollection = client.db('mobileBikroy').collection('categories');
        const reviewCollection = client.db('mobileBikroy').collection('reviews');
        const wishlistCollection = client.db('mobileBikroy').collection('wishlist');
        const bookingCollection = client.db('mobileBikroy').collection('booking');


        // const verifyAdmin = async(req, res, next) => {
        //     console.log('inside verify', req.decoded.email)
        //     const decodedEmail = req.decoded.email;
        //     const query = { email: decodedEmail };
        //     const user = await userCollection.findOne(query);
      
        //     if (user?.role !== 'admin') {
        //       return res.status(403).send({ message: 'forbidden access' })
        //     }
        //     next();
        //   }

        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await userCollection.findOne(query)
            if (user) {
              const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1hr' })
              return res.send({ accessToken: token })
            }
            res.status(403).send({ accessToken: ' ' })
          })


        app.get('/categories', async (req, res) => {
            const query = {}
            const result = await categoryCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/reviews', async (req, res) => {
            const query = req.body;
            const result = await reviewCollection.insertOne(query)
            res.send(result)
        })
        app.get('/reviews', async (req, res) => {
            const query = {};
            const result = await reviewCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/allProducts', async (req, res) => {
            const query = req.body;
            const result = await productCollection.insertOne(query)
            res.send(result)
        })
        app.get('/allProducts', async (req, res) => {
            let query = {}
            console.log(req.query.email)
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const result = await productCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/allProducts/:category', async (req, res) => {
            const category = req.params.category;
            console.log(category)

            const query = {
                brand: category
            }

            const result = await productCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/allProducts/product/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: new ObjectId(id) }

            const result = await productCollection.findOne(query)
            res.send(result)
        })

        app.put('/allProducts/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedDoc = {
                $set: {
                    booked: true
                }

            }
            const result = await productCollection.updateOne(filter, updatedDoc, option)
            res.send(result)
        })

        app.post('/wishlist', async (req, res) => {
            const wishlist = req.body;
            console.log(wishlist.mobileId)
            const query = {
                mobileId: wishlist.mobileId,
                email: wishlist.email
            }

            const alreadyWishlist = await wishlistCollection.find(query).toArray()
            if (alreadyWishlist.length) {
                const message = 'Already in wishlist'
                return res.send({ acknowledged: false, message })
            }
            const result = await wishlistCollection.insertOne(wishlist)
            res.send(result)
        })

        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const query = {
                id: booking.id
            }

            const alreadyBooked = await bookingCollection.find(query).toArray()
            if (alreadyBooked.length) {
                const message = 'Already Booked'
                return res.send({ acknowledged: false, message })
            }
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
        })

        app.get('/booking', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/booking/seller', async (req, res) => {
            let query = {}
            console.log(req.query.email)
            if (req.query.email) {
                query = {
                    sellerEmail: req.query.email
                }
            }

            const result = await bookingCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/wishlist', async (req, res) => {
            const wishlist = req.body;
            console.log(wishlist.mobileId)
            const query = {
                mobileId: wishlist.mobileId,
                email: wishlist.email
            }

            const alreadyWishlist = await wishlistCollection.find(query).toArray()
            if (alreadyWishlist.length) {
                const message = 'Already in wishlist'
                return res.send({ acknowledged: false, message })
            }
            const result = await wishlistCollection.insertOne(wishlist)
            res.send(result)
        })

        app.get('/wishlist', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const result = await wishlistCollection.find(query).toArray()
            res.send(result)
        })
        app.delete('/wishlist/:id', async (req, res) => {
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await wishlistCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/allUsers', async (req, res) => {
            console.log(req.body)
            const query = req.body;
            const result = await userCollection.insertOne(query)
            res.send(result)
        })
        app.get('/allUsers', async (req, res) => {
            const query = {};
            const result = await userCollection.find(query).toArray();
            res.send(result)
        })
        app.put('/allUsers/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }

            }
            const result = await userCollection.updateOne(filter, updatedDoc, option)
            res.send(result)
        })
        app.put('/allUsers/seller/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedDoc = {
                $set: {
                    verify: true
                }

            }
            const result = await userCollection.updateOne(filter, updatedDoc, option)
            res.send(result)
        })
        app.delete('/allUsers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await userCollection.deleteOne(query)
            res.send(result)
        })
        app.get('/allUsers/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await userCollection.findOne(query)
            res.send({ isSeller: user?.accountType === 'Seller' })
        })


        app.get('/allUsers/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await userCollection.findOne(query)
            res.send(user)
        })


        app.get('/allUsers/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await userCollection.findOne(query)
            res.send({ isVerify: user?.verify === true })
        })
        app.get('/allUsers/admin/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email)
            const query = { email };
            const user = await userCollection.findOne(query)
            res.send({ isAdmin: user?.role === 'admin' })
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