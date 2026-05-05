import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  const PLACE_ID = process.env.GOOGLE_PLACE_ID;

  if (!API_KEY || !PLACE_ID) {
    return NextResponse.json(
      { error: "Missing API key or Place ID" },
      { status: 500 }
    );
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,user_ratings_total,reviews&key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}