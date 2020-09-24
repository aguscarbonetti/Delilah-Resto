//ORDERS

const { response, request } = require('express');
const sequelize = require('./mysql');
const seq = require('sequelize');
const jwt = require('jsonwebtoken');
const secret = "DelilahResto2020";


//create new order
function createOrder(req,res){
    const time_created_at = new Date();
    const token = req.headers.authorization;
    const tokenId = jwt.verify(token, secret);
    const user_id = tokenId.id;
    const { payment_id } = req.body;
    const status_id = 1;
    const { products } = req.body;


    if (payment_id == undefined || payment_id > 4){
        res.status(400).send(
            {"msg": "Missing payment"})
    }
    if (products == undefined){
        res.status(400).send(
            {"msg": "Insert products into the order"}
        )
    }
    

    sequelize.query('INSERT INTO orders(time_created_at, user_id, payment_id, status_id) VALUES (?,?,?,?)',
        {replacements: [time_created_at, user_id, payment_id, status_id]})

        .then(function(results){
            const id = results[0];
            for (let index = 0; index < products.length; index++) {
                sequelize.query('INSERT INTO orders_products (order_id, product_id) VALUES (?, ?)',
                {replacements: [id, products[index]]})
                    
            }
            res.status(200).send(
                {id:results[0], time_created_at:time_created_at, user_id:user_id, payment_id: payment_id, status_id: status_id, product_id:products}
            )

        })
    
}

//update order
function updateOrder(req,res){
    const { id, payment_id, status_id } = req.body;
    let data = [];

    if(id == undefined){
        res.status(401).send(
            {"msg": "missing id"}
        )
    }

    if(payment_id !== undefined){
        data.push("payment_id = :payment_id")
    }
    if(status_id !== undefined){
        data.push("status_id = :status_id")
    }

    if(data.length === 0){
        res.status(400).send(
            {"msg":"Missing data"}
        );
    }
    let querystring = data.join(", ");

    sequelize.query('UPDATE orders SET '+querystring+' WHERE id = :id',
    {
        replacements: {id: id, payment_id: payment_id, status_id: status_id}
    })
    .then((result)=>{
        res.status(200).send({
            id:id, payment_id: payment_id, status_id: status_id
        })
    })


}

//delete order
function deleteOrder(req,res){
    const { id } = req.params;
    if(id == undefined){
        res.status(401).send(
            {"msg": "missing id"}
        )}
    sequelize.query('DELETE FROM orders WHERE id = :id',
    {replacements: {id:id}})
    .then((result)=>{
        if(result[0]['affectedRows']>0) {
            res.status(200).send(`Order with id: ${id} has been deleted`);
            }
            
             else { res.send(`The order ID: ${id} does not exist`) }
            })
        
}

//get all orders
function getOrders(req,res){
    sequelize.query('SELECT * FROM orders', { type: sequelize.QueryTypes.SELECT})
    .then((response)=>{
        res.status(200).send(response)
    })
}



//exports
module.exports = {
    createOrder,
    updateOrder,
    deleteOrder,
    getOrders
}