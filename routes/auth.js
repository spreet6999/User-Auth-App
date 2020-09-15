const router = require('express').Router();
const {User, validateRegisterUser, validateLoginUser} = require('../models/user');
const JWT = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const password = require('../functions/password');

router.post('/register', async (req, res) => {
    const {error} = validateRegisterUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is already in our db
    const usernameExists = await User.findOne({username: req.body.username});
    if(usernameExists) return res.status(400).send('Username already exists');

    const emailExists = await User.findOne({email: req.body.email});
    if(emailExists) return res.status(400).send('Email already exists');

    //Hashing passwords
    const salt = await bcrypt.genSalt(10); // 10 is the complexity of the string generated
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    })
    const savedUser = await user.save();
    res.send(savedUser);
});


router.post('/login', async (req, res) => {
    const {error} = validateLoginUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user is in our db
    const user = await User.findOne({username: req.body.username});
    if(!user) return res.status(400).send('Username doesnot exists');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password!');

    const token = JWT.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

router.put('/users/:id/changePassword', async (req,res) => {
    if(true) {
        const oldPassword = req.body.password;
        const newPassword = req.body.newPassword;

        if(!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {
            res.status(400).json({message: 'Invalid Request'});
        }
        else
        {
            const response = await password.changePassword(req.params.id, oldPassword, newPassword);

            if(response.status == 401)
            {
                res.status(401).json({message: response.message});
            }
            else {
                res.status(200).json(response);
            }
        }
    }
    else{
        res.status(401).json({message: 'Invalid Token'});
    }
});

router.post('/users/:id/password', async (req,res) => {
    const _id = req.params.id;
    const token = req.body.token;
    const newPassword = req.body.password;

    if(!token || !newPassword || !token.trim() || !newPassword.trim()) {
        const result = await password.resetPasswordInit(_id);
        
        return res.status(result.status).json({message: result.message});
    }
    else{
        const result = await password.resetPassworFinish(_id, token , newPassword);

        return res.status(result.status).json({message: result.message});

    }
});

module.exports = router;