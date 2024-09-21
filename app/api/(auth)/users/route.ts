import { Types } from "mongoose";
import { connect } from "@/lib/db";
import User from "@/lib/modals/users";
import { NextResponse } from "next/server";

const ObjectId = require("mongoose").Types.ObjectId;

export const GET = async () => {
  try {
    //Connects to MongoDb databasee using mongoose.
    await connect();
    //Retrieves all documents from User collection.
    const users = await User.find();
    //Data is serialized into JSON format and returned with a response code.
    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (err: any) {
    return new NextResponse("Error in fetching users" + err.message, {
      status: 500,
    });
  }
};

//request contains details of incoming http request.
export const POST = async (request: Request) => {
  try {
    //Parse the JSON data coming from the body of post request.
    const body = await request.json();
    await connect();
    //Create instance of new user which is not yet saved to database.
    const newUser = new User(body);
    //Saves the new user document to the User collection in MongoDB.
    await newUser.save();
    return new NextResponse(
      JSON.stringify({ message: "User is created.", user: newUser }),
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return new NextResponse("Error in creating user:" + err.message, {
      status: 500,
    });
  }
};

export const PATCH = async (request: Request) => {
  try {
    const body = await request.json();
    //Body of request should contain userId and newUsername
    const { userId, newUsername } = body;

    await connect();

    if (!userId || !newUsername) {
      return new NextResponse(JSON.stringify({ message: "User not found." }), {
        status: 400,
      });
    }
    //Used to validate whether userId is a valid MongoDB ObjectId.
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid userId." }), {
        status: 400,
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(userId) }, // Looks for the user with the given userId.
      { username: newUsername }, //Updates the username field with the new vaule.
      { new: true } //Makes the function return the updated document(user).
    );

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database." }),
        { status: 400 }
      );
    }
    return new NextResponse(
      JSON.stringify({ message: "User is updated.", user: updatedUser }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse("Error in updating user." + err.message, {
      status: 500,
    });
  }
};

export const DELETE = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return new NextResponse(JSON.stringify({ message: "User not found." }), {
        status: 400,
      });
    }
    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid userId." }), {
        status: 400,
      });
    }
    await connect();

    const deletedUser = await User.findByIdAndDelete(
      new Types.ObjectId(userId)
    );

    if (!deletedUser) {
      return new NextResponse(JSON.stringify({ message: "User not found." }), {
        status: 400,
      });
    }
    return new NextResponse(
      JSON.stringify({ message: "User id Deleted.", user: deletedUser }),
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return new NextResponse("Error in updating user." + err.message, {
      status: 500,
    });
  }
};
