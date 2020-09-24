//PRODUCTS

const { response } = require('express');
const sequelize = require('./mysql');

//create new product
function createProduct(req, res) {
        const { name } = req.body;
        const { price } = req.body;
        const { photo } = req.body;
        const { availability } = req.body;
    
        if ((name == undefined) || (price == undefined) || (photo == undefined) || (availability == undefined)){
            res.status(400).send(
                {"msg": "missing parameters"}
            )
        };
    
        if (typeof price !== 'number'){
            res.status(400).send(
                {"msg": "Invalid price"}
            )
     
        };
    
        if (typeof availability !== 'boolean'){
            res.status(400).send(
                {"msg": "Invalid availability type"}
            )
     
        };
        sequelize.query('INSERT INTO products (name, price, photo, availability) VALUES (?, ?, ?, ?)',
            {replacements: [name, price, photo, availability]})
            .then(function(results){
                res.status(200).send(
                    {id:results[0], name: name, price: price, photo: photo, availability: availability}
                )
            })
}

//get products available
function getAvailablePr(req,res) {
    sequelize.query('SELECT * FROM products WHERE availability = 1', { type: sequelize.QueryTypes.SELECT})
    .then((response)=> res.send(response));
}

//get products by id
function getProductById(req, res){
    const { id } = req.params;
    sequelize.query('SELECT * FROM products WHERE id = :id',
    {
        replacements: {id: id},
        type: sequelize.QueryTypes.SELECT
    })
    .then((response)=> res.status(200).send(response));
}

//delete products 
function deleteProduct(req,res){
    const { id } = req.params;
    sequelize.query('DELETE FROM products WHERE id = :id',
    {
        replacements: {id:id}
    })
    .then((result)=>{
    if(result[0]['affectedRows']>0) {
    res.status(200).send(`Product with id: ${id} has been deleted`);
    }
    
     else { res.send(`The product ID: ${id} does not exist`) }
    })
}

//modify existent products
function modifyProduct(req,res){
    const { id } = req.params;
    const { name, price, photo, availability} = req.body;
    let data = [];

    if (name !== undefined) {
        data.push("name = :name");
    }
    if (price !== undefined){
        data.push('price = :price');
    }
    if (photo !== undefined){
        data.push('photo = :photo');
    }
    if (availability !== undefined){
        data.push('availability = :availability');
    }

    if(data.length === 0){
        res.status(400).send(
            {"msg":"Missing data"}
        );
    }
    let querystring = data.join(", ");

    
    sequelize.query('UPDATE products SET '+querystring+' WHERE id = :id',
    {
        replacements: {id: id, name: name, price: price, photo: photo, availability: availability}
    })
    .then((result)=>{
        res.status(200).send(
            {id: id, name: name, price: price, photo: photo, availability: availability}
        )
    })
}


//exports
module.exports = {
    createProduct,
    modifyProduct,
    getAvailablePr,
    getProductById,
    deleteProduct
}