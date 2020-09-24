const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
const jwt = require('jsonwebtoken');
const products = require('./products');
const users = require('./users');
const orders = require('./orders');
const { userLogged, userAdmin } = require('./users');


//ENDPOINTS

//products
app.post('/products', userAdmin, (req, res) => products.createProduct(req, res));
app.get('/products', (req, res) =>products.getAvailablePr(req, res));
app.get('/products/:id', (req, res) =>products.getProductById(req,res));
app.delete('/products/:id', userAdmin, (req, res) =>products.deleteProduct(req,res));
app.put('/products/:id', userAdmin, (req, res)=>products.modifyProduct(req,res));

//users

app.post('/users', (req, res) => users.createUser(req,res));
app.get('/users', userAdmin, (req, res) => users.getAllUsers(req,res));
app.delete('/users/:id', (req, res)=> users.deleteUser(req,res));
app.post('/users/login', (req, res) => users.login(req,res));
app.put('/users', (req,res)=> users.modifyUser(req,res));

//orders

app.post('/order', userLogged, (req,res)=> orders.createOrder(req,res));
app.put('/order', userAdmin, (req,res) => orders.updateOrder(req,res));
app.delete('/order/:id', userAdmin, (req,res) => orders.deleteOrder(req,res));
app.get('/orders', userAdmin, (req, res)=> orders.getOrders(req,res));

//Listen
app.listen(3000, ()=>{
    console.log('Server initialized');
})