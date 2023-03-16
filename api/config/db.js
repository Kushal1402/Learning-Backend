const mongoose = require('mongoose')
mongoose.set("strictQuery", false);

mongoose
    .connect(process.env.MONGO_URL, {
        // useMongoClient:true
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
    })
    .then((res) => {
        console.log('Connected to DB...')
        // console.log(res, "res")
    })
    .catch((err) => {
        console.log(err)
        process.exit(1)
    })

exports.mongoose
