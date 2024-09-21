import { Types } from "mongoose";
import { connect } from "@/lib/db";
import User from "@/lib/modals/users";
import { NextResponse } from "next/server";
import Category from "@/lib/modals/category";

export const GET = async (request: Request) => {
  try {
    //new URL(request.url): Constructs a new URL object from the provided request.url.
    //Destructures the searchParams property from the URL object.
    const { searchParams } = new URL(request.url);
    //Retrieves the value associated with userId
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    await connect();

    //Looks for user in database with userId
    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        {
          status: 400,
        }
      );
    }

    //Query the Category model to find all the categories where the user field matches the userId.
    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });

    return new NextResponse(JSON.stringify(categories), {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse("Error in fetching categories" + error.message, {
      status: 500,
    });
  }
};

export const POST = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const { title } = await request.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        {
          status: 400,
        }
      );
    }

    await connect();
    const user = await User.findById(userId);

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: "User not found in the database" }),
        {
          status: 400,
        }
      );
    }

    const newCategory = new Category({
      title,
      user: new Types.ObjectId(userId),
    });

    await newCategory.save();

    return new NextResponse(
      JSON.stringify({ message: "Category is created." }),
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return new NextResponse("Error in fetching categories" + err.message, {
      status: 500,
    });
  }
};
