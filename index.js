const express = require('express');
const app = express();
const path = require('path');
require("dotenv").config()
    
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/views'));
app.set('view engine','ejs');
app.get('/' , (req,res)=>{
    res.render('index');
})
app.get('/index', (req, res) => {
    res.render('index');
});

const mongoose = require('mongoose');

const db = mongoose.connect(process.env.MONGODB_URL)
db.then(()=>{
    console.log("Connected to mongodb database")
}).catch(()=>{
    console.log("Error connecting to mongodb database")
});

const productSchema = new mongoose.Schema({
    item:String,
    type:String,
    price:Number    
})
    
const Product = mongoose.model('products',productSchema);

    app.post('/insertData',async (req, res) => {
        console.log(req.body);
        let input = req.body;
        let result = await Product.create(req.body);
        res.send("data inserted")
    });
    
    app.get('/read_data',async (req, res) => {
        res.render('read_data');
    });

    app.post('/read_data', async (req, res) => {
            let searchRequest = req.body.name; 
            if(searchRequest.length == 0){
                var result = await Product.find();
            }else{
                var result = await Product.find({item : {$regex : new RegExp(`^${searchRequest}$` , "i")} });
            }
            res.send(result);
    });
    
    app.delete('/deleteData',async (req, res) => {
        let requestItem = req.query.id;
        console.log(requestItem)
        let data = await Product.deleteOne({_id:requestItem});
        res.send("success");
        console.log(data);
    });

    app.get('/update', (req, res) => {
        res.render('update');
    });
    app.get('/searchUpdate', async (req, res) => {
        console.log("welcome")
        let result = await Product.findOne({item : req.query.item});
        res.send(result);
    });

    app.put('/updateData', async (req, res) => {
        let result = await Product.updateOne(
            {_id : req.query.id},
            {$set : req.body}
            );
        res.send(result);
    });
    
    app.listen(process.env.PORT || 5001,()=>{
        console.log(`server connected at port ${process.env.PORT || 5001}`)
    });