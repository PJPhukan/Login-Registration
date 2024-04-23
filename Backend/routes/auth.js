const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator");
const User = require("../Models/Authontication");
const fetchData = require("../Middleware/fetchData.js");

//Endpoint for create user -->'/api/auth/createuser' (No login required)
router.post(
  "/createuser",
  checkSchema({
    //username schema check
    username: {
      isLength: {
        options: { min: 3 },
      },
      errorMessage: "Enter a valid name!",
    },
    //email check
    email: {
      isEmail: true,
      errorMessage: "Enter a valid email!",
    },
    //password check
    //password schema check
    password: {
      isLength: {
        options: { min: 6 },
      },
      errorMessage: "Password should be at least 6 character!",
    },
  }),
  async (req, res) => {
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
      // const salt = await bcrypt.genSalt(10);
      const SecPass = await bcrypt.hash(req.body.password, 10);

      //create user section
      user = await User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: SecPass,
      });

      //jwt token generate
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, process.env.JWT_SECRET);

      //return auth to the user
      res.json({ authToken });
      console.log(authToken);
    } catch (error) {
      //Catch the error
      console.log(error);
      res.status(400).send("Internal Server Error");
    }
  }
);

// (ii) Authonticate a user: '/api/auth/login'   method:POST ( login reuired)
router.post(
  "/login",
  checkSchema({
    email: {
      isEmail: true,
      errorMessage: "Enter a valid email ! ",
    },
  }),
  async (req, res) => {
    //req Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // check user exist or not
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid user" });
      }

      //Check password correct or not
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Please enter correct cradentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      //return json token to the user
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.json(authToken);
    } catch (error) {
      console.error(error.massage);
      res.status(500).json({ error: "Internal server occured !" });
    }
  }
);

// (iii) Get login user details: /api/auth/getuser   method:POST ( login reuired)
router.get("/getuser", fetchData, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.massage);
    res.status(500).json({ error: "Internal server occured !" });
  }
});

//(iv) Reset password all routes
//Steps for reset user password
/**
 * step:1-->>> Take user email from req body
 * step:2-->>>  Check Already exist or not , if not then return
 * step:3-->>>  Send a otp or link for the reset password
 * step:4-->>>   Check req body otp isn't correct then return
 * step:5-->>>   Take user new password from the user req body
 * step:6-->>>   Update database and send the token as a response value
 */

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body; //destructure user email from the req.body

  let user = await User.findOne({ email }); //check user already exist or not

  if (!user) {
    // if user id not registered then return with response massage
    res.status(409).send("Invalid user , Please try with a valid credentials");
    return;
  }

  const secret = process.env.JWT_SECRET + user._id; //Create a jwt secret using global jwt secret and user unic id

  //Create payload for jwt token
  const payload = {
    _id: user._id,
    email,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "15m" }); //Create a jwt token and it will be expire in 15minutes

  const Link = `${process.env.MAIN_URI}/api/auth/reset-password/${user._id}/${token}`; //Create a link for reset password
  console.log(Link);
  res.send("Reset password link successfully send .");
});

//Reset password
router.post("/reset-password/:_id/:token", async (req, res) => {
  const { _id, token } = req.params; //destructure user _id and token from the req.params

  const { password } = req.body; //destructure user new password from the req.body

  let user = await User.findById(_id); //Check user is already registered or not

  if (!user) {
    //if not user already registered then return with response message
    console.log("Authentication error !!! ");
    res.send("Authenticate with a valid user credential !");
  }
  try {
    const secret = process.env.JWT_SECRET + user._id; //generate secret using global jwt secret and user _id

    user = jwt.verify(token, secret); //Verigy req.params token is valid or not

    const secPassword = await bcrypt.hash(password, 10); //Generate hash password for the user

    user = await User.findByIdAndUpdate(
      //update user password
      _id,
      {
        $set: {
          password: secPassword,
        },
      },
      {
        new: true,
      }
    );

    const payload = {
      _id: user._id,
      email: user.email,
    };

    let UserToken = jwt.sign(payload, process.env.JWT_SECRET); //generate token and send it to the user

    res.send(UserToken);
  } catch (error) {
    console.log("❗❗ RESET PASSWORD ERROR !", error);
    res.json(error);
  }
});
module.exports = router;
