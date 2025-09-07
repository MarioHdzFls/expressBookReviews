const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    const authHeader = req.headers['authorization']; 

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
            error: 'Acceso denegado. Se requiere un token.'
        });
    }

    const token = authHeader.substring(7);

    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            error: 'Token inválido o expirado.'
        });
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
