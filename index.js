const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

const cors = require("cors");
app.use(express.json());

app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is Open ..........................')
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://Task-Management:ELITEBOOK@cluster0.w7mc7t5.mongodb.net/?retryWrites=true&w=majority";

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
    const TaskCollection = client.db("Task-Management").collection("Task");

    app.get("/Task", async (req, res) => {
      const email = req.query.email;
      const query = { user: email };
      const result = await TaskCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/Task/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await TaskCollection.findOne(query);
      res.send(result);
    });

    app.post("/Task",async (req, res) => {
      const Task = req.body;
      const result = await TaskCollection.insertOne(Task);
      res.send(result);
    });

    app.delete('/Task/:id', async(req , res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await TaskCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/Task/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const status = req.body.status;
      const query = { _id: new ObjectId(id) };
      const update = { $set: { status: status } };
      const result = await TaskCollection.updateOne(query, update);
      res.send(result);
    });
    app.patch('/Task/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const Task  = req.body;
      const update = {
        $set: {
          taskName: Task.taskName,
          taskdeadline: Task.taskdeadline,
          taskDescription: Task.taskDescription,
          priority: Task.priority,
      }
      }
      const result = await TaskCollection.updateOne(filter, update,);
      res.send(result)
           });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})