const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const User = require("../Models/Authontication")

//jwt secreat string
const JWT_SEC = "pjphukan";

//Endpoint for create user -->'./routes/Auth/createuser' (No login required)
router.post('/createuser', checkSchema({
    //username schema check
    username: {
        isLength: {
            options: { min: 3 },
        },
        errorMessage: "Enter a valid name!"
    },
    //email check
    email: {
        isEmail: true,
        errorMessage: "Enter a valid email!"

    },
    //password check
    //password schema check
    password: {
        isLength: {
            options: { min: 6 },
        },
        errorMessage: "Password should be at least 6 character!"
    }
}), async (req, res) => {

    //error handling
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log("error");
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        //check user already exist or not
        if (user) {
            return res.status(400).json({ error: "Email Already Exist !" });
        }

        //Password secure section
        const salt = await bcrypt.genSalt(10);
        const SecPass = await bcrypt.hash(req.body.password, salt)

        //create user section
        user = await User.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: SecPass
        })

        //jwt token generate 
        const data={
            user:{
               id:user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SEC);

        //return auth to the user
        res.json({authToken});
        console.log(authToken)
    } catch (error) {
        //Catch the error
        console.log(error)
        res.status(400).send("Internal Server Error");
    }

})



module.exports = router;