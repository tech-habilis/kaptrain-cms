import { NextRequest, NextResponse } from "next/server";
import { signOut } from "../../../../lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const result = await signOut();

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Logout successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}