const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter, collection } = require('firebase-admin/firestore');
const serviceAccount = JSON.parse(process.env.FIRESTORE_SERVICE_ACCOUNT);

initializeApp({
    credential: cert(serviceAccount)
  });
  
const db = getFirestore();
  
// price changes between MIN_LIMIT and MAX_LIMIT in seconds!
const MIN_TIME_LIMIT = 2.5 * 60;
const MAX_TIME_LIMIT = 6 * 60;

const GOLD_PRICE_LIMIT = { max: 3500, min: 1500 };
const URANIUM_PRICE_LIMIT = { max: 180, min: 10 };
const RIPCOIN_PRICE_LIMIT = { max: 80000, min: 20 };
const TIBCOIN_PRICE_LIMIT = { max: 105, min: -10 };
const DIAMOND_PRICE_LIMIT = { max: 11000, min: 1000 };
const PLUTONIUM_PRICE_LIMIT = { max: 15000, min: 4000 };

const DAYS_AGO = 1;     // keep how many days old price in history


function randomNumber(max, min=0) {
    return Math.floor((Math.random()) * (max - min + 1) + min);
}

function randomIntervals(material) {
    setTimeout(() => {
        randomNewPrice(material);
        console.log("Ding!", new Date());
        randomIntervals(material);    
    }, randomNumber(MAX_TIME_LIMIT, MIN_TIME_LIMIT) * 1000);
}

function keepServerUp() {

    setInterval(async () => {
        try {
            const response = await fetch(process.env.API_URL);
            console.log(response.statusText);
        } catch (err) {
            console.log(err.message);
        }
        keepServerUp();
    }, 0.5 * 60 * 1000)
}

async function setNewMaterialDoc() {
    // add new or set material/materials to the data base
    try {
        await db.collection('prices').doc('gold').set(
            {
                history: [{ timestamp: Date.now(), price: 1650 }], 
                limits: { tempMaxLimit: 3400, tempMinLimit: 1600, maxAmount: 200}, 
                balancer: 0
            }
        );
        await db.collection('prices').doc('uranium').set(
            {
                history: [{ timestamp: Date.now(), price: 100 }], 
                limits: { tempMaxLimit: 155, tempMinLimit: 35, maxAmount: 60 }, 
                balancer: 0
            }
        );
        await db.collection('prices').doc('ripCoin').set(
            {
                history: [{ timestamp: Date.now(), price: 540 }], 
                limits: { tempMaxLimit: 76000, tempMinLimit: 520, maxAmount: 8000 }, 
                balancer: 0
            }
        );
        await db.collection('prices').doc('tibCoin').set(
            {
                history: [{ timestamp: Date.now(), price: 93 }], 
                limits: { tempMaxLimit: 100, tempMinLimit: 2, maxAmount: 10 }, 
                balancer: 0
            }
        );
        await db.collection('prices').doc('diamond').set(
            {
                history: [{ timestamp: Date.now(), price: 1650 }], 
                limits: { tempMaxLimit: 10400, tempMinLimit: 1600, maxAmount: 800 }, 
                balancer: 0
            }
        );
        await db.collection('prices').doc('plutonium').set(
            {
                history: [{ timestamp: Date.now(), price: 5031 }], 
                limits: { tempMaxLimit: 14600, tempMinLimit: 4400, maxAmount: 1000 }, 
                balancer: 0
            }
        );
        await db.collection('prices').doc('currentPrices').set(
            {
                gold: 1601,
                uranium: 154,
                ripCoin: 531,
                tibCoin: 99,
                diamond: 1601,
                plutonium: 5000,
            }
        );
    } catch (err) {
        console.error(err);
    }
    
}

async function updateNewPrice(material, newPrice, staticLimit=null, priceChange=null, newLimitMaxRoll=null,  balancer=0) {
    // balancer is little addition to randomized price increase or decrease.
    // balancer is used for get higher chance to increase the price, when min limit reached, 
    // and lower the increase chance, when max limit is reached. 
    // if price reach min/max limit set random new min/max limit, and add 2 stack balancer value for next random increase roll.
    if (staticLimit !== null && priceChange < 0) {
        const data = {
            history: FieldValue.arrayUnion({ timestamp: Date.now(), price: newPrice }),
            'limits.tempMinLimit' : staticLimit + randomNumber(newLimitMaxRoll),
            balancer: FieldValue.increment(2)
        };

        try {
            await db.collection('prices').doc(material).update(data);   
        } catch (err) {
            console.error(err);
        }
    // if price reach max limit set random new max limit, and subtract 2 stack balancer value for next random increase roll.
    } else if (staticLimit !== null && priceChange > 0) {
        const data = {
            history: FieldValue.arrayUnion({ timestamp: Date.now(), price: newPrice }),
            'limits.tempMaxLimit' : staticLimit - randomNumber(newLimitMaxRoll),
            balancer: FieldValue.increment(-2)
        };

        try {
            await db.collection('prices').doc(material).update(data);      
        } catch (err) {
            console.error(err);
        }
    } else if (balancer !== 0) {
        const data = {
            history: FieldValue.arrayUnion({ timestamp: Date.now(), price: newPrice }),
            balancer: FieldValue.increment(balancer)
        };

        try {
            await db.collection('prices').doc(material).update(data);          
        } catch (err) {
            console.error(err);
        }
    } else {
        const data = {
            history: FieldValue.arrayUnion({ timestamp: Date.now(), price: newPrice }),
        };

        try {
            await db.collection('prices').doc(material).update(data);
        } catch (err) {
            console.error(err);
        }
    }
    try {
        const allPrices = {}
        allPrices[material] = newPrice;
        await db.collection('prices').doc("currentPrices").update(allPrices);
    } catch (err) {
        console.error(err);
    }

}

const randomNewPrice = async (material) => {
    // check if price reach any tempLimit true => set new temp limit
    const matObj = (await db.collection('prices').doc(material).get()).data();
    clearOldHistoryData(material, matObj);
    const increase = randomNumber(matObj.limits.maxAmount);
    if (matObj.currentPrice < matObj.limits.tempMinLimit) {
        const newPrice = matObj.currentPrice + Math.floor(increase / 2);
        await updateNewPrice(material, newPrice);
        return
    } else if (matObj.currentPrice > matObj.limits.tempMaxLimit) {
        const newPrice = matObj.currentPrice - Math.floor(increase / 2);
        await updateNewPrice(material, newPrice);
        return
    }
    const priceChange = increase - Math.floor(matObj.limits.maxAmount / 2);
    const newPrice = matObj.balancer !== 0 
        ? matObj.currentPrice + priceChange + matObj.balancer * matObj.limits.maxAmount / 10 
        : matObj.currentPrice + priceChange;

    if (newPrice < matObj.limits.tempMinLimit || newPrice > matObj.limits.tempMaxLimit) {
        switch (material) {
            case "gold":
                const staticGoldLimit = newPrice < matObj.limits.tempMinLimit ? GOLD_PRICE_LIMIT.min : GOLD_PRICE_LIMIT.max;
                const forcedGoldPrice = matObj.currentPrice - priceChange
                await updateNewPrice(material, forcedGoldPrice, staticGoldLimit, priceChange, matObj.limits.maxAmount);
                break;
            case "uranium":
                const staticUraniumLimit = newPrice < matObj.limits.tempMinLimit ? URANIUM_PRICE_LIMIT.min : URANIUM_PRICE_LIMIT.max;
                const forcedUraniumPrice = matObj.currentPrice - priceChange
                await updateNewPrice(material, forcedUraniumPrice, staticUraniumLimit, priceChange, matObj.limits.maxAmount);
                break;
            case "ripCoin":
                const staticRipCoinLimit = newPrice < matObj.limits.tempMinLimit ? RIPCOIN_PRICE_LIMIT.min : RIPCOIN_PRICE_LIMIT.max;
                const forcedRipCoinPrice = matObj.currentPrice - priceChange
                await updateNewPrice(material, forcedRipCoinPrice, staticRipCoinLimit, priceChange, matObj.limits.maxAmount);
                break;
            case "tibCoin":
                const staticTibCoinLimit = newPrice < matObj.limits.tempMinLimit ? TIBCOIN_PRICE_LIMIT.min : TIBCOIN_PRICE_LIMIT.max;
                const forcedTibPrice = matObj.currentPrice - priceChange
                await updateNewPrice(material, forcedTibPrice, staticTibCoinLimit, priceChange, matObj.limits.maxAmount);
                break;
            case "diamond":
                const staticDiamondCoinLimit = newPrice < matObj.limits.tempMinLimit ? DIAMOND_PRICE_LIMIT.min : DIAMOND_PRICE_LIMIT.max;
                const forcedDiamondPrice = matObj.currentPrice - priceChange
                await updateNewPrice(material, forcedDiamondPrice, staticDiamondCoinLimit, priceChange, matObj.limits.maxAmount);
                break;
            case "plutonium":
                const staticPlutoniumCoinLimit = newPrice < matObj.limits.tempMinLimit ? PLUTONIUM_PRICE_LIMIT.min : PLUTONIUM_PRICE_LIMIT.max;
                const forcedPlutoniumPrice = matObj.currentPrice - priceChange
                await updateNewPrice(material, forcedPlutoniumPrice, staticPlutoniumCoinLimit, priceChange, matObj.limits.maxAmount);
                break;
            default:
                console.log("No material match found")
            
        }
    } else {
        // console.log("no limit breached");
        // when no limit reached reduce balancer stack by 1
        const incrementBalancer = matObj.balancer < 0 ? 1 : matObj.balancer > 0 ? -1 : 0;
        await updateNewPrice(material, newPrice, null, null, null, incrementBalancer);
    }
    
}


const clearOldHistoryData = async (material, Obj) => {
    // remove price history data older than 1 day.
    const now = new Date();
    const tomorrowTimeStamp = now.setDate(now.getDate() - DAYS_AGO);
    if (Obj?.history[0]?.timestamp && Obj?.history[0]?.timestamp < tomorrowTimeStamp) {
        const filteredHistoryArray = Obj.history.filter(record => record.timestamp > tomorrowTimeStamp);
        const data = {
            history: filteredHistoryArray
        }
        await db.collection('prices').doc(material).update(data);
    }
}

async function getPriceForMatch() {
    const doc = await db.collection("prices").doc("currentPrices").get();
    const pricesObj = doc.data();
    return pricesObj;
}


module.exports = {randomIntervals, randomNewPrice, setNewMaterialDoc, getPriceForMatch, keepServerUp };