const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectID = require("mongodb").ObjectId;
const admin = require("firebase-admin");
require("dotenv").config();

const port = 3032;

const app = express();
app.use(cors());
app.use(bodyParser.json());

//Firebase Admin
var serviceAccount = require("./config/internet-provider-2-firebase-adminsdk-1p9ys-0718f8ba40.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Connect mongoDB-----
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@internetprovider.czasc.mongodb.net/internetServiceProvider?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

/*---------------------------------------------------------*/

//Add Packages-----------
client.connect((err) => {
    const packagesCollection = client
        .db("internetServiceProvider")
        .collection("allPackages");

    //Add Packages Post Route
    app.post("/addPackages", (req, res) => {
        const packagesData = req.body;
        packagesCollection.insertOne(packagesData).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    // Packages get Route
    app.get("/packages", (req, res) => {
        packagesCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    //Package Delate Route
    app.delete("/packageDelete/:id", (req, res) => {
        const id = ObjectID(req.params.id);
        packagesCollection.deleteOne({ _id: id }).then((result) => {
            console.log(result.deletedCount > 0);
        });
    });
});

//Add Product-------------
client.connect((err) => {
    const productsCollection = client
        .db("internetServiceProvider")
        .collection("allProducts");

    // Add Products Post Route
    app.post("/addProducts", (req, res) => {
        const productsData = req.body;
        productsCollection.insertOne(productsData).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    // Products get Route
    app.get("/products", (req, res) => {
        productsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    //Product Delate Route
    app.delete("/productDelete/:id", (req, res) => {
        const id = ObjectID(req.params.id);
        productsCollection.deleteOne({ _id: id }).then((result) => {
            console.log(result.deletedCount > 0);
        });
    });

    // Products Filter Email Route
    app.get("/products/:id", (req, res) => {
        const id = ObjectID(req.params.id);
        productsCollection.find({ _id: id }).toArray((err, documents) => {
            res.send(documents[0]);
        });
    });
});

//Buy Product-------------
client.connect((err) => {
    const buySuccessProductsCollection = client
        .db("internetServiceProvider")
        .collection("buySuccessProduct");

    //Buy product Post Route
    app.post("/buyProducts", (req, res) => {
        const buyProductsData = req.body;
        buySuccessProductsCollection
            .insertOne(buyProductsData)
            .then((result) => {
                res.send(result.insertedCount > 0);
            });
    });

    // Buy Products get Route
    app.get("/buySuccessProducts", (req, res) => {
        buySuccessProductsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    //Buy Products Update Route
    app.patch("/updateStatus/:id", (req, res) => {
        const id = ObjectID(req.params.id);
        buySuccessProductsCollection
            .updateOne(
                { _id: id },
                {
                    $set: { orderStatus: req.body.updateStatus.status },
                }
            )
            .then((result) => {
                // console.log(result);
            });
    });

    // Buy Products Filter Email Route
    app.get("/orderEmail", (req, res) => {
        buySuccessProductsCollection
            .find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });
});

//Admin List--------------
client.connect((err) => {
    const adminCollection = client
        .db("internetServiceProvider")
        .collection("adminList");
    // Admin List Post Route
    app.post("/makeAdmin", (req, res) => {
        const adminEmail = req.body;
        adminCollection.insertOne(adminEmail).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    // Admin list get Route
    app.get("/admins", (req, res) => {
        adminCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.get("/isAdmin", (req, res) => {
        adminCollection
            .find({ email: req.query.email })
            .toArray((err, admin) => {
                res.send(admin);
            });
    });
});

// Add Movies----------
client.connect((err) => {
    const moviesCollection = client
        .db("internetServiceProvider")
        .collection("allMovies");
    // Movies Post Route
    app.post("/allMovies", (req, res) => {
        const moviesData = req.body;
        moviesCollection.insertOne(moviesData).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    // Movies get Route
    app.get("/movies", (req, res) => {
        moviesCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    //Movie Delate Route
    app.delete("/movieDelete/:id", (req, res) => {
        const id = ObjectID(req.params.id);
        moviesCollection.deleteOne({ _id: id }).then((result) => {
            console.log(result.deletedCount > 0);
        });
    });
});

// Registration Form----------
client.connect((err) => {
    const registerCollection = client
        .db("internetServiceProvider")
        .collection("registerPeopleList");
    // Register Post Route
    app.post("/registerForm", (req, res) => {
        const registerPeople = req.body;
        registerCollection.insertOne(registerPeople).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    // Register get Route
    app.get("/registeredCustomer", (req, res) => {
        registerCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    //Register Delate Route
    app.delete("/RegSubDelete/:id", (req, res) => {
        const id = ObjectID(req.params.id);
        registerCollection.deleteOne({ _id: id }).then((result) => {
            console.log(result.deletedCount > 0);
        });
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(process.env.PORT || port);
