const Account = require("../model/Account");
const { getPriceForMatch } = require("../utilities/randomIntervals")
const { format } = require("date-fns");
const { handleInvTypeFormat } = require("../utilities/helperFunctions")

const getUserProfile = async (req,res) => {
    if(!req?.params?.user) return res.status(400).json({ message: "User parameter is required"});

    const userData = await Account.findOne({ username: req.params.user }, { marketHistory: 0 }).exec();
    if(!userData) return res.status(400).json({ message: `Username ${req.params.user} not found.` });

    const profile = {
        username: userData?.username,
        email: userData?.email,
        creditBalance: userData?.creditBalance,
        investments: userData?.investments,
    }
    res.status(200).json(profile);
}

const patchUserProfile = async (req, res) => {
    if(!req?.params?.user) return res.status(400).json({ message: "User parameter is required"});

    const userData = await Account.findOne({ username: req.params.user }, { marketHistory: 0 }).exec();
    if(!userData) return res.status(400).json({ message: `Username ${req.params.user} not found`});

    const { creditBalance, investments } = req.body;
    if(creditBalance === undefined || !investments) return res.status(400).json({ message: `Request payload is missing!`});

    const investmentType = Object.keys(investments)[0];
    const pricesObj = await getPriceForMatch();
    if(!Object.keys(pricesObj).includes(investmentType)) return res.status(400).json({ message: "Not expected request data!"});
    
    const price = pricesObj[investmentType];
    
    // Check if balance and owned investment qty cannot be less than 0
    if(creditBalance < 0 || investments[investmentType] < 0) {
        return res.status(400).json({ message: "Credit Balance or owned investment qty cannot be below 0" });
    }
    // check if credit spend is equal to current price * bought quantity vice versa
    if(creditBalance - userData.creditBalance !== (userData.investments[investmentType] - investments[investmentType]) * price) {
        console.log("Price is not match");
        return res.status(400).json({ message: "Price is not up to date!"});
    }

    // Add transaction type(Purchase/Sale), date, price, quantity 
    const transaction = {}
    transaction.name = handleInvTypeFormat(investmentType);
    transaction.date = `${format(new Date(), 'dd.MM.yyyy-HH:mm:ss')}`

    if (creditBalance < userData.creditBalance) {
        transaction.type = "Purchase";
        transaction.qty = investments[investmentType] - userData.investments[investmentType];
    } else {
        transaction.type = "Sale"
        transaction.qty = userData.investments[investmentType] - investments[investmentType];
    }

    transaction.price = price;


    try {
        const result = await Account.updateOne(
            { username: req.params.user },
            {
                $set: {
                    creditBalance: creditBalance,
                    [`investments.${investmentType}`]: investments[investmentType]
                },
                $push: {
                    marketHistory: { $each: [transaction], $position: 0 }
                }
            }
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Account updated successfully' });
        } else {
            res.status(404).json({ message: 'User not found or no update made' });
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }

    // await userData.save();
    // res.json(userData);

}

const getMarketHistoryPage = async (req, res) => {
    if(!req?.params?.user) return res.status(400).json({ message: "User parameter is required"});

    let page = parseInt(req.query.page) || 1;
    page = page < 1 ? 1 : page; // set page to 1, when query param is 0 or negative
    const limit = 10;

    const startIndex = (page - 1) * limit;

    try {
        const result = await Account.aggregate([
            { $match: { username: req.params.user } },    
            { $project: {
                marketHistory: { 
                    $slice: ["$marketHistory", startIndex, limit] 
                },
                 marketHistoryLength: { $size: "$marketHistory" } } }
        ]).exec();

        const arrayLength = result[0]?.marketHistoryLength;
        const pageList = result[0]?.marketHistory;
        const count = Math.ceil(arrayLength / 10);

        const paginatedResults = {
            count,
            currentPage: page,
            pageList,

        }
        res.paginatedResults = paginatedResults;
    } catch (err) {
        res.status(500).json({ message: err.message });
    }



    res.status(200).json(res.paginatedResults);
}

module.exports = {
    getUserProfile, patchUserProfile, getMarketHistoryPage
    
}