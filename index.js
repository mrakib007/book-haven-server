const express = require('express')
const app = express();
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m99d8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const port = process.env.PORT || 5000;

app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const booksCollection = client.db("bookHaven").collection("books");
  const ordersCollection = client.db("bookHaven").collection("orders");

  app.get('/books',(req,res)=>{
    booksCollection.find()
    .toArray((err,items)=>{
      res.send(items);
    })
  })

  app.get('/book/:id',(req,res)=>{
    console.log(req.params.id,'this is book');
    booksCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err,items)=>{
      res.send(items);
    })
  })


  app.get('/order',(req,res)=>{
    ordersCollection.find()
    .toArray((err,items)=>{
      res.send(items);
    })
  })

  app.post('/addBook',(req,res)=>{
    const newBook = req.body;
    console.log('adding new book',newBook);
    booksCollection.insertOne(newBook)
    .then(result =>{
      console.log(result.insertedCount,'added');
      res.send(result.insertedCount>0);
    })
  })

  app.post('/addOrder',(req,res)=>{
    const newOrder = req.body;
    ordersCollection.insertOne(newOrder)
    .then(result =>{
      res.send(result.insertedCount>0);
    })
  })

  app.delete('/delete/:id',(req,res)=>{
    console.log(req.params.id);
    booksCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then((result)=>{
      console.log(result);
    })
  })

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})