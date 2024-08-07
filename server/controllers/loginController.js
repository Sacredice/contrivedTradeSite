const User = require("../model/Account");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ "message": "User Name and password are required." });
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.status(401).json({ msg: "User Name does not exist!" }); // Unauthorized
    console.log("username: ", foundUser.username);
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(!match) return res.status(401).json({ msg: "Wrong password!" });

    if (match) {
        const roles = Object.values(foundUser.roles);
        // create JWT
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "5m" }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" }
        );
        // Saving refreshToken with current user
        // Data base yerine json dosyası kullandığımızdan!! eşleşen username'in objectine refreshToken ekleyerek kaydediyoruz

        foundUser["refreshToken"] = refreshToken;

        // const updatedUser = await User.findByIdAndUpdate(foundUser._id, foundUser);
        await foundUser.save();
    
        res.cookie("jwt", refreshToken, { httpOnly: true, sameSite: "None", secure: true , maxAge: 24 * 60 * 60 * 1000 });
        res.json({ accessToken, creditBalance: foundUser.creditBalance });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };