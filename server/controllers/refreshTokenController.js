const User = require("../model/Account");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: "Lax", secure: true, maxAge: 24 * 60 * 60 * 1000 });

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    // console.log("foundUser", foundUser);
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); // Forbidden
                console.log("not expired but used(already changed) refreshToken reuse attempt!");
                const hackedUser = await User.findOne({ username: decoded.username }).exec(); // find user with using encoded username from token
                hackedUser["refreshToken"] = "";

                await hackedUser.save();
            }
        )
        return res.sendStatus(403); // Forbidden
    }

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                console.log('expired refresh token')
                foundUser.refreshToken = "";
                const result = await foundUser.save();
                console.log("Result", result);
            }
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "59s"}
            );

            const newRefreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );
            foundUser.refreshToken = newRefreshToken;
            await foundUser.save();

            res.cookie("jwt", newRefreshToken, { httpOnly: true, sameSite: "Lax", secure: true , maxAge: 24 * 60 * 60 * 1000 });
            res.json({ accessToken, username: foundUser.username, creditBalance: foundUser.creditBalance })
        }
    )
    
}

module.exports = { handleRefreshToken };