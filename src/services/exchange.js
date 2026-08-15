const axios = require('axios')

const convertINRtoGBP = async (amountInINR) => {
    const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_KEY}/pair/INR/GBP`
    )
    const rate = response.data.conversion_rate
    const amountInGBP = amountInINR * rate
    return Math.round(amountInGBP * 100)  
}

module.exports = { convertINRtoGBP }
