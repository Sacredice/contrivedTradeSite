const User = require("../model/Account");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { user, pwd, email } = req.body;
    // Bad request 400
    if (!user || !pwd) return res.status(400).json({ "message": "Username and password are required." });
    
    //  check for duplicate usernames and email addresses in the db
    const duplicateUser = await User.findOne({ username: user }).exec();
    const duplicateEmail = await User.findOne({ email: email }).exec();
    if (duplicateUser || duplicateEmail) {
        // Conflict 409
        return res.status(409).json({ msg: duplicateUser ? "Username already in use!" : "Email address already in use!" });
    }
        
    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        // create and store the new user
        const result = await User.create({ 
            "username": user,
            "password": hashedPwd,
            "email": email
        });
        
        console.log(result);
        
        res.status(201).json({ "message": `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
}

module.exports = { handleNewUser };