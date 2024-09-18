import { Schema, model, models } from "mongoose";

//Defining the Schema
const UserSchema = new Schema(
  {
    email: { type: "string", required: true, unique: true },
    username: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
//Model("User", UserSchema) creates the model if it doesn't already exist.
export default User;
