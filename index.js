const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfpdn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get("/", (req, res) => {
  res.send("Hello DB connectings it's Working Working....");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");

  //data add or post Code

  app.post("/addProduct", (req, res) => {
    const products = req.body;
    console.log(products);
    productsCollection.insertOne(products).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  //psot or add code end************* Code End Post Method***************

  //***********************get method code start*************

  app.get("/products", (req, res) => {
    productsCollection
      .find({})
      .limit(10)
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  //***********************get method code-end*************************************

  //***********************get method-Single Item Load code******************

  app.get("/product/:key", (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  //****************************get item single load code end********************** */

  //***********************post method-meltiple product to rivewpages  Item code******************

  app.post("/productsByKeys", (req, res) => {
    const productKeys = req.body;
    productsCollection
      .find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  //****************************ethod-meltiple product to rivewpages  Item  end********************** */

  //***********************Order Collection post method****************

  //data add or post Code

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(process.env.PORT || port);
