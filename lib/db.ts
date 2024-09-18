import mongoose from "mongoose";

//Retrieve the MongoDB connection string from the environment variables and store it in a constant.
const MONGODB_URI = process.env.MONGODB_URI;

export const connect = async () => {
  //Get the current state of the MongoDB connection.
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log("Already connected.");
    return;
  }
  if (connectionState === 2) {
    console.log("Connecting...");
    return;
  }
  try {
    //Establish connection to a monogodb database.
    mongoose.connect(MONGODB_URI!, {
      dbName: "api_handling",
      //Mongoose will queue the commands and run them when the connection is established.
      bufferCommands: true,
    });
    console.log("Connected");
  } catch (err: any) {
    console.log("Error:", err);
    throw new Error(err);
  }
};
