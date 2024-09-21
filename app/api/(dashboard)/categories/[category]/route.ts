import { Types } from "mongoose";
import { connect } from "@/lib/db";
import User from "@/lib/modals/users";
import { NextResponse } from "next/server";
import Category from "@/lib/modals/category";

export const PATCH = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const body = await request.json();
    const { title } = body;

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "UserId is Invalid" }),
        { status: 400 }
      );
    }
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "CategoryId is Invalid" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "User does not exist in datebase." }),
        { status: 400 }
      );
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ message: "Category does not exist." }),
        { status: 400 }
      );
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    return new NextResponse(
      JSON.stringify({
        message: "Category is updated.",
        category: updatedCategory,
      }),
      { status: 200 }
    );
  } catch (err: any) {
    return new NextResponse("Error in updating category." + err.message, {
      status: 400,
    });
  }
};

export const DELETE = async (request: Request, context: { params: any }) => {
  const categoryId = context.params.category;
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing userId" }),
        { status: 400 }
      );
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid or missing categoryId" }),
        { status: 400 }
      );
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return new NextResponse(
        JSON.stringify({
          message: "Category not found or does not belong to the user",
        }),
        {
          status: 404,
        }
      );
    }

    await Category.findByIdAndDelete(categoryId);

    return new NextResponse(
      JSON.stringify({ message: "Category is deleted" }),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse("Error in deleting category" + error.message, {
      status: 500,
    });
  }
};
