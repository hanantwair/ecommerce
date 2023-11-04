import { connect } from "mongoose";

const connectDB = async () => {
    return await connect(process.env.DB_LOCAL)
        .then(() => {
            console.log("Connect to DB...");
        })
        .catch((err) => {
            console.log(`Error to connect to DB, ${err}`);
        });
}

export default connectDB;