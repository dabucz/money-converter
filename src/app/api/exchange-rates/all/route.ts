import { NextResponse } from 'next/server';

const apiBaseUrl = "https://v6.exchangerate-api.com/v6/";
const apiKey = process.env.API_KEY;

export async function GET() {
    try {
        const response = await fetch(
            `${apiBaseUrl}${apiKey}/latest/USD`
        );
        const data = await response.json();
        
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch exchange rates' },
            { status: 500 }
        );
    }
} 