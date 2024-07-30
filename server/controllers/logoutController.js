const User = require("../model/Account");

const handleLogout = async (req, res) => {
    // On client side(frontend), also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 });
        return res.sendStatus(204); 
    }
    
    // Delete the refreshToken property in the object yapamıyoruz Node.js de "delete foundUser.refreshToken;" => çalışmıyor.
    // console.log(foundUser);
    
    // Set refreshToken to empty string / null
    foundUser["refreshToken"] = "";
    // Save the updated / loggedoutUser object to db

    await foundUser.save();



    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true, maxAge: 24 * 60 * 60 * 1000 }); // secure: true - only servers on https
    res.sendStatus(204);
}

module.exports = { handleLogout };