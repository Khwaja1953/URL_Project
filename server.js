const express = require("express");
const path = require("path");
const cookie_parser = require("cookie-parser");
require("dotenv").config();
const morgan = require("morgan");
const cluster = require("node:cluster");
const os = require("node:os");

const logger = require("./Utils/logger");

//env variables
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

//routes
const urlRoute = require('./Routes/urlRoute');
const userRoute = require('./Routes/userRoute');
const adminRoute = require("./Routes/adminRoute");
const staticRoute = require("./Routes/staticRoute");

//mongodb connection
const connectDb = require("./Db/connectDb");

const totalCpu = os.cpus().length;
if (cluster.isPrimary){
    for (let i= 0; i<totalCpu; i++){
        cluster.fork();
    }

}else{
    const app = express();
//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookie_parser());
app.set("view engine","ejs");
app.set("views",path.resolve("views"));
app.use(express.static(path.resolve("src")));
app.use('/uploads', express.static('uploads'));
// app.use(morgan("tiny"));
// app.use(morgan("dev"));
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(morgan("combined",{
    stream: {
        write: (message)=>{
            logger.info(message);
        }
    }
}))

app.use("/",staticRoute);
app.use("/url",urlRoute);
app.use("/user",userRoute);
app.use("/admin",adminRoute);


connectDb(MONGO_URL)
app.listen(PORT,()=>{
    console.log(`app is listining at http://localhost:${PORT}`);
});
}