import { NextResponse } from "next/server";

//route for logging user out of application
export async function GET() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully." },
      { status: 200 }
    );
    //reduce maxAge to log user out
    response.cookies.set("jwt", "", { maxAge: 1 });
    return response;
  } catch (err) {
    //All other errors
    return NextResponse.json({ message: "Server Error." }, { status: 500 });
  }
}
