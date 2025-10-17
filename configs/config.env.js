require('dotenv').config();

const dotenv = {
    PORT : process.env.PORT,
    MONGODB_URL : process.env.MONGODB_URL,
    PRIVATE_KEY : process.env.PRIVATE_KEY,
    SECRET_KEY : process.env.SECRET_KEY
}


module.exports = dotenv;