import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // In a real implementation, we would create a link token using the Plaid API
    // For now, we'll just return a mock success response
    return NextResponse.json({ 
      success: true,
      link_token: "mock-link-token-for-testing",
      message: "This is a mock implementation. In a real app, this would return a Plaid link token."
    });
  } catch (error) {
    console.error("Error in mock create-link-token:", error);
    return NextResponse.json(
      { error: "An error occurred in the mock implementation" },
      { status: 500 }
    );
  }
} 