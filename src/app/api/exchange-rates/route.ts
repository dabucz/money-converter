import { NextResponse } from 'next/server';

const apiBaseUrl = "https://v6.exchangerate-api.com/v6/";
const apiKey = './.env_api_key';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const fromCurrency = searchParams.get('from');
    const toCurrency = searchParams.get('to');
    const amount = searchParams.get('amount');

    if (!fromCurrency || !toCurrency || !amount) {
        return NextResponse.json(
            { error: 'Missing required parameters' },
            { status: 400 }
        );
    }

    try {
        const response = await fetch(
            `${apiBaseUrl}${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`
        );
        const data = await response.json();

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch exchange rate' },
            { status: 500 }
        );
    }
} 