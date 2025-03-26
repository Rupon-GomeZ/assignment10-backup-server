require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u6wg9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

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
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const database = client.db("chill-gamer-db");
        const gameCollection = database.collection("games");
        const reviewCollection = database.collection("reviews");
        const myReviewCollection = database.collection("myReviews");

        const userCollection = database.collection("users");

        app.get('/games', async (req, res) => {
            const cursor = gameCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/add-reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        app.post('/add-my-reviews', async (req, res) => {
            const myReview = req.body;
            const result = await myReviewCollection.insertOne(myReview);
            res.send(result);
        })
        app.get('/my-reviews/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const cursor = myReviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })


        // User Collection
        app.post('/signUp', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            result = await cursor.toArray();
            res.send(result);
        })



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Game review server is running');
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})