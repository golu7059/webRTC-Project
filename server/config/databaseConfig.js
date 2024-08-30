import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const connectionToDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL environment variable is not defined");
    }

    const connection = await mongoose.connect(mongoUrl);

    if (connection) {
      console.log(`Connected to database: ${connection.connection.host}`);
    }
  } catch (error) {
    console.error("Unable to connect to database:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
};

export default connectionToDB;
