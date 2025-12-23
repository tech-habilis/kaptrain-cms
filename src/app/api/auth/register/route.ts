import { NextRequest, NextResponse } from "next/server";
import {
  registerUser,
  isValidEmail,
  isValidPassword,
} from "../../../../lib/supabase";
import { isValidRole, getDefaultRole } from "../../../../types/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name, role } = body;

    // Validate required fields
    if (!email || !password || !first_name || !last_name) {
      return NextResponse.json(
        { success: false, error: "Email, password, first name, and last name are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters long",
        },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !isValidRole(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Register user
    const result = await registerUser({
      email,
      password,
      first_name,
      last_name,
      role: role || "user",
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: result.user,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
