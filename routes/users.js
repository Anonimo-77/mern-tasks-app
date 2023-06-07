const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const {User} = require("../models/User");
const {Task} = require("../models/Task");
const validator = require("validator").default;

router.post("/register", async(req,res) => {
    try {
        let { email, password, passwordCheck, username } = req.body;

        /**
         * Email
            * isEmpty
            * isEmail
            * not used
         * username
            * isEmpty
            * > 6 ch
            * not used
         * password
            * isEmpty
            * At least 12 characers
            * Must contain letters, numbers and special characters
            * Must contain a mixture of both uppercase and lowercase
        
        */

        let errors = {};

        const emailFound = (await User.find({ email })).length > 0;
        if (emailFound) {
            errors.email = "Email already in use.";
        }
        if (!validator.isEmail(email)) {
            errors.email = "Please enter a valid email.";
        }
        if (validator.isEmpty(email)) {
            errors.email = "Email field is required";
        }
        
        const userFound = (await User.find({ username })).length > 0;
        if (userFound) {
            errors.username = "Username already in use.";
        }
        if (username.length < 6) {
            errors.username = "Username must have at least 6 characters.";
        }
        if (validator.isEmpty(username)) {
            errors.username = "Username field is required.";
        }

        if ((password.length < 12) || !(/\d/).test(password) || !(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/).test(password) || password.toLowerCase()==password || password.toUpperCase()==password) {
            errors.password = "Please enter a valid password.";
        }
        if (validator.isEmpty(password)) {
            errors.password = "Password field is required.";
        }
        if (validator.equals(password,passwordCheck)) {
            errors.passwordCheck = "Repeat password field is required.";
        }

        if (errors.length > 0) {
            res.status(500).json(errors);
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        const newUser = new User({
            username,
            email,
            password: passwordHash
        });

        const savedUser = await newUser.save();
        res.json(savedUser);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.post("/login", async (req,res) => {
    try {
        const { email, password } = req.body;

    // validate
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered." });

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    console.log("token",token);
    res.json({
      token,
      user: {
        id: user._id,
        user: user,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})


router.post("/tokenIsValid", async (req, res) => {
    try {
      const token = req.header("x-auth-token");
      if (!token) return res.json(false);
  
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      if (!verified) return res.json(false);
  
      const user = await User.findById(verified.id);
      if (!user) return res.json(false);
  
      return res.json(true);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({
      user: user,
      id: user._id,

    });
  });
  
  module.exports = router;