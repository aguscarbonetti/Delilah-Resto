//USERS

const { response, request } = require('express');
const sequelize = require('./mysql');
const jwt = require('jsonwebtoken');
const secret = "DelilahResto2020";



//create user
function createUser(req,res){
    const { user } = req.body;
    const { full_name } = req.body;
    const { email } = req.body;
    const { phone_number } = req.body;
    const { address } = req.body;
    const { password } = req.body;

    if ((user == undefined) || (full_name == undefined) || (email == undefined) || (phone_number == undefined) || (address == undefined) || (password == undefined)){
        res.status(400).send(
            {"msg": "missing parameters"}
        )
    };

    sequelize.query('INSERT INTO users (user, full_name, email, phone_number, address, password, role_id) VALUES (?, ?, ?, ?, ?, ?, 1)',
    {replacements: [user, full_name, email, phone_number, address, password]})
    .then(function(results){
        res.status(200).send(
            {id:results[0], user: user, full_name: full_name, email: email, phone_number:phone_number, address: address, password: password, role_id:1}
        )
    })
}

//get all users
function getAllUsers(req,res){
    sequelize.query('SELECT * FROM users', { type: sequelize.QueryTypes.SELECT })
    .then((response)=>res.send(response))
}

//delete user by id
function deleteUser(req,res){
    const { id } = req.params;
    sequelize.query('DELETE FROM users WHERE id = :id',
    {
        replacements: {id:id}
    })
    .then((result)=>{
    if(result[0]['affectedRows']>0) {
    res.status(200).send(`User with id: ${id} has been deleted`);
    }
    
     else { res.send(`The user ID: ${id} does not exist`) }
    })
}

//login
function login(req,res){
    const { user } = req.body;
    const { pass } = req.body;

    sequelize.query('SELECT * FROM users WHERE user = :user AND password = :pass LIMIT 1',
    {
        replacements: {user :user, pass: pass}
    })
    .then((result)=>{
        if (result[0].length <1){
            res.sendStatus(401);
        }else{
            const token = jwt.sign({"id":result[0][0].id, "username":user, "role":result[0][0].role_id}, secret);
            res.status(200).send({"msg": "Authorized", "token": token});
            }
    })

}

//modify
function modifyUser(req,res){
    const token = req.headers.authorization;
    const tokenId = jwt.verify(token, secret);
    let data = [];
    let id;
    let role_id;


    if(tokenId.role===2){
        id = req.body.id;
        role_id = req.body.role_id;

        if(id==undefined){
            res.send({"msg":"Missing ID"});
        }
    } else{
        if(req.body.id!== undefined || req.body.role_id !== undefined){
            res.status(401).send(
                {"msg": "Unauthorized"}
            )
        }
        id = tokenId.id;
        role_id = 1;
    
    }

    const { user, full_name, email, phone_number, address, password} = req.body;

        if(user!== undefined){
            data.push("user = :user");
        }
        if(full_name!== undefined){
            data.push("full_name = :full_name");
        }
        if(email!== undefined){
            data.push("email = :email");
        }
        if(phone_number!== undefined){
            data.push("phone_number = :phone_number");
        }
        if(address!== undefined){
            data.push("address = :address");
        }
        if(password !== undefined){
            data.push("password = :password");
        }
        if(role_id !== undefined && role_id === 1 || role_id === 2){
            data.push("role_id = :role_id")
        }else{
            res.status(401).send(
                {"msg": "The role id does not exist"}
            )
        }
    
        if(data.length === 0){
            res.status(400).send(
                {"msg":"Missing data"}
            );
        }
    
        let querystring = data.join(", ");
        console.log(querystring);
    
        sequelize.query('UPDATE users SET '+querystring+' WHERE id = :id',
        {
            replacements: {id: id, user: user, full_name: full_name, email: email, phone_number: phone_number, address: address, password: password, role_id: role_id}
        })
        .then((result)=>{
            console.log(req.body);
            res.status(200).send(
                {id: id, user:user, full_name: full_name, email: email, phone_number: phone_number, address: address, password: password, role_id: role_id}
            )
        })
} 


//middlewares - user 
const userLogged = (req,res,next) => {
    try{
        const token = req.headers.authorization;
        const verifiedToken = jwt.verify(token, secret);
        if(verifiedToken){
            next();
        }else{
            res.send("Unauthorized")
        }
    }
    catch(err){
        res.json({err});
    }
}

const userAdmin = (req,res,next) =>{
    try{
        const token = req.headers.authorization;
        const decodeToken = jwt.verify(token, secret);
        if(decodeToken.role === 2){
            next();
        }else{
            res.send("Unauthorized")

        }
    }
    catch(err){
        res.json({err});
    }

}




//exports
module.exports = {
    createUser,
    getAllUsers,
    deleteUser,
    login,
    modifyUser,
    userLogged,
    userAdmin
}