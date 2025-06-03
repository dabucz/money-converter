'use client';

import { useState, useEffect } from 'react';
import { MdSwapVert, MdSave, MdDelete } from "react-icons/md";

interface ExchangeRateData {
    conversion_rates: {
        [key: string]: number;
    };
    base_code: string;
}

interface ConversionHistory {
    id: string;
    amount: string;
    fromCurrency: string;
    toCurrency: string;
    result: number;
    rate: string;
    timestamp: Date;
}

const currencies = [
    { code: 'AED', name: 'UAE Dirham' },{ code: 'AFN', name: 'Afghan Afghani' },{ code: 'ALL', name: 'Albanian Lek' },{ code: 'AMD', name: 'Armenian Dram' },
    { code: 'ANG', name: 'Netherlands Antillian Guilder' },{ code: 'AOA', name: 'Angolan Kwanza' },{ code: 'ARS', name: 'Argentine Peso' },
    { code: 'AUD', name: 'Australian Dollar' },{ code: 'AWG', name: 'Aruban Florin' },{ code: 'AZN', name: 'Azerbaijani Manat' },
    { code: 'BAM', name: 'Bosnia and Herzegovina Mark' },{ code: 'BBD', name: 'Barbados Dollar' },{ code: 'BDT', name: 'Bangladeshi Taka' },
    { code: 'BGN', name: 'Bulgarian Lev' },{ code: 'BHD', name: 'Bahraini Dinar' },{ code: 'BIF', name: 'Burundian Franc' },{ code: 'BMD', name: 'Bermudian Dollar' },
    { code: 'BND', name: 'Brunei Dollar' },{ code: 'BOB', name: 'Bolivian Boliviano' },{ code: 'BRL', name: 'Brazilian Real' },
    { code: 'BSD', name: 'Bahamian Dollar' },{ code: 'BTN', name: 'Bhutanese Ngultrum' },{ code: 'BWP', name: 'Botswana Pula' },
    { code: 'BYN', name: 'Belarusian Ruble' },{ code: 'BZD', name: 'Belize Dollar' },{ code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CDF', name: 'Congolese Franc' },{ code: 'CHF', name: 'Swiss Franc' },{ code: 'CLP', name: 'Chilean Peso' },
    { code: 'CNY', name: 'Chinese Renminbi' },{ code: 'COP', name: 'Colombian Peso' },{ code: 'CRC', name: 'Costa Rican Colon' },
    { code: 'CUP', name: 'Cuban Peso' },{ code: 'CVE', name: 'Cape Verdean Escudo' },{ code: 'CZK', name: 'Czech Crown' },
    { code: 'DJF', name: 'Djiboutian Franc' },{ code: 'DKK', name: 'Danish Krone' },{ code: 'DOP', name: 'Dominican Peso' },
    { code: 'DZD', name: 'Algerian Dinar' },{ code: 'EGP', name: 'Egyptian Pound' },{ code: 'ERN', name: 'Eritrean Nakfa' },
    { code: 'ETB', name: 'Ethiopian Birr' },{ code: 'EUR', name: 'Euro' },{ code: 'FJD', name: 'Fiji Dollar' },
    { code: 'FKP', name: 'Falkland Islands Pound' },{ code: 'FOK', name: 'Faroese Króna' },{ code: 'GBP', name: 'Pound Sterling' },
    { code: 'GEL', name: 'Georgian Lari' },{ code: 'GGP', name: 'Guernsey Pound' },{ code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'GIP', name: 'Gibraltar Pound' },{ code: 'GMD', name: 'Gambian Dalasi' },{ code: 'GNF', name: 'Guinean Franc' },
    { code: 'GTQ', name: 'Guatemalan Quetzal' },{ code: 'GYD', name: 'Guyanese Dollar' },{ code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'HNL', name: 'Honduran Lempira' },{ code: 'HRK', name: 'Croatian Kuna' },{ code: 'HTG', name: 'Haitian Gourde' },
    { code: 'HUF', name: 'Hungarian Forint' },{ code: 'IDR', name: 'Indonesian Rupiah' },{ code: 'ILS', name: 'Israeli New Shekel' },
    { code: 'IMP', name: 'Manx Pound' },{ code: 'INR', name: 'Indian Rupee' },{ code: 'IQD', name: 'Iraqi Dinar' },
    { code: 'IRR', name: 'Iranian Rial' },{ code: 'ISK', name: 'Icelandic Króna' },{ code: 'JEP', name: 'Jersey Pound' },
    { code: 'JMD', name: 'Jamaican Dollar' },{ code: 'JOD', name: 'Jordanian Dinar' },{ code: 'JPY', name: 'Japanese Yen' },
    { code: 'KES', name: 'Kenyan Shilling' },{ code: 'KGS', name: 'Kyrgyzstani Som' },{ code: 'KHR', name: 'Cambodian Riel' },
    { code: 'KID', name: 'Kiribati Dollar' },{ code: 'KMF', name: 'Comorian Franc' },{ code: 'KRW', name: 'South Korean Won' },
    { code: 'KWD', name: 'Kuwaiti Dinar' },{ code: 'KYD', name: 'Cayman Islands Dollar' },{ code: 'KZT', name: 'Kazakhstani Tenge' },
    { code: 'LAK', name: 'Lao Kip' },{ code: 'LBP', name: 'Lebanese Pound' },{ code: 'LKR', name: 'Sri Lanka Rupee' },
    { code: 'LRD', name: 'Liberian Dollar' },{ code: 'LSL', name: 'Lesotho Loti' },{ code: 'LYD', name: 'Libyan Dinar' },
    { code: 'MAD', name: 'Moroccan Dirham' },{ code: 'MDL', name: 'Moldovan Leu' },{ code: 'MGA', name: 'Malagasy Ariary' },
    { code: 'MKD', name: 'Macedonian Denar' },{ code: 'MMK', name: 'Burmese Kyat' },{ code: 'MNT', name: 'Mongolian Tögrög' },
    { code: 'MOP', name: 'Macanese Pataca' },{ code: 'MRU', name: 'Mauritanian Ouguiya' },{ code: 'MUR', name: 'Mauritian Rupee' },
    { code: 'MVR', name: 'Maldivian Rufiyaa' },{ code: 'MWK', name: 'Malawian Kwacha' },{ code: 'MXN', name: 'Mexican Peso' },
    { code: 'MYR', name: 'Malaysian Ringgit' },{ code: 'MZN', name: 'Mozambican Metical' },{ code: 'NAD', name: 'Namibian Dollar' },
    { code: 'NGN', name: 'Nigerian Naira' },{ code: 'NIO', name: 'Nicaraguan Córdoba' },{ code: 'NOK', name: 'Norwegian Krone' },
    { code: 'NPR', name: 'Nepalese Rupee' },{ code: 'NZD', name: 'New Zealand Dollar' },{ code: 'OMR', name: 'Omani Rial' },
    { code: 'PAB', name: 'Panamanian Balboa' },{ code: 'PEN', name: 'Peruvian Sol' },{ code: 'PGK', name: 'Papua New Guinean Kina' },
    { code: 'PHP', name: 'Philippine Peso' },{ code: 'PKR', name: 'Pakistani Rupee' },{ code: 'PLN', name: 'Polish Złoty' },
    { code: 'PYG', name: 'Paraguayan Guaraní' },{ code: 'QAR', name: 'Qatari Riyal' },{ code: 'RON', name: 'Romanian Leu' },
    { code: 'RSD', name: 'Serbian Dinar' },{ code: 'RUB', name: 'Russian Ruble' },{ code: 'RWF', name: 'Rwandan Franc' },
    { code: 'SAR', name: 'Saudi Riyal' },{ code: 'SBD', name: 'Solomon Islands Dollar' },{ code: 'SCR', name: 'Seychellois Rupee' },
    { code: 'SDG', name: 'Sudanese Pound' },{ code: 'SEK', name: 'Swedish Krona' },{ code: 'SGD', name: 'Singapore Dollar' },
    { code: 'SHP', name: 'Saint Helena Pound' },{ code: 'SLE', name: 'Sierra Leonean Leone' },{ code: 'SOS', name: 'Somali Shilling' },
    { code: 'SRD', name: 'Surinamese Dollar' },{ code: 'SSP', name: 'South Sudanese Pound' },{ code: 'STN', name: 'São Tomé and Príncipe Dobra' },
    { code: 'SYP', name: 'Syrian Pound' },{ code: 'SZL', name: 'Eswatini Lilangeni' },{ code: 'THB', name: 'Thai Baht' },
    { code: 'TJS', name: 'Tajikistani Somoni' },{ code: 'TMT', name: 'Turkmenistan Manat' },{ code: 'TND', name: 'Tunisian Dinar' },
    { code: 'TOP', name: 'Tongan Paʻanga' },{ code: 'TRY', name: 'Turkish Lira' },{ code: 'TTD', name: 'Trinidad and Tobago Dollar' },
    { code: 'TVD', name: 'Tuvaluan Dollar' },{ code: 'TWD', name: 'New Taiwan Dollar' },{ code: 'TZS', name: 'Tanzanian Shilling' },
    { code: 'UAH', name: 'Ukrainian Hryvnia' },{ code: 'UGX', name: 'Ugandan Shilling' },{ code: 'USD', name: 'United States Dollar' },
    { code: 'UYU', name: 'Uruguayan Peso' },{ code: 'UZS', name: 'Uzbekistani So\'m' },{ code: 'VES', name: 'Venezuelan Bolívar Soberano' },
    { code: 'VND', name: 'Vietnamese Đồng' },{ code: 'VUV', name: 'Vanuatu Vatu' },{ code: 'WST', name: 'Samoan Tālā' },
    { code: 'XAF', name: 'Central African CFA Franc' },{ code: 'XCD', name: 'East Caribbean Dollar' },{ code: 'XDR', name: 'Special Drawing Rights' },
    { code: 'XOF', name: 'West African CFA franc' },{ code: 'XPF', name: 'CFP Franc' },{ code: 'YER', name: 'Yemeni Rial' },
    { code: 'ZAR', name: 'South African Rand' },{ code: 'ZMW', name: 'Zambian Kwacha' },{ code: 'ZWL', name: 'Zimbabwean Dollar' }
];

// Cookie helper functions
const setCookie = (name: string, value: string, days: number = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

export default function Home() {
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [amount, setAmount] = useState('1');
    const [result, setResult] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [rates, setRates] = useState<{ [key: string]: number } | null>(null);
    const [history, setHistory] = useState<ConversionHistory[]>([]);

    // Load history from cookies on component mount
    useEffect(() => {
        const savedHistory = getCookie('conversionHistory');
        if (savedHistory) {
            try {
                const parsedHistory = JSON.parse(savedHistory);
                // Convert timestamp strings back to Date objects
                const historyWithDates = parsedHistory.map((item: any) => ({
                    ...item,
                    timestamp: new Date(item.timestamp)
                }));
                setHistory(historyWithDates);
            } catch (error) {
                console.error('Error loading history from cookies:', error);
            }
        }
    }, []);

    // Save history to cookies whenever history changes
    useEffect(() => {
        if (history.length > 0) {
            setCookie('conversionHistory', JSON.stringify(history));
        }
    }, [history]);

    // Fetch all exchange rates only once
    useEffect(() => {
        const fetchAllRates = async () => {
            try {
                const response = await fetch('/api/exchange-rates/all');
                const data: ExchangeRateData = await response.json();
                setRates(data.conversion_rates);
            } catch (error) {
                console.error('Error fetching exchange rates:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllRates();
    }, []);

    useEffect(() => {
        if (!rates || !amount) {
            setResult(null);
            return;
        }

        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];

        if (fromRate && toRate) {
            // First convert to USD, then to target currency
            const amountInUSD = parseFloat(amount) / fromRate;
            const finalAmount = amountInUSD * toRate;
            setResult(finalAmount);
        }
    }, [amount, fromCurrency, toCurrency, rates]);

    // Calculate current exchange rate for display
    const getCurrentExchangeRate = () => {
        if (!rates) return null;
        const fromRate = rates[fromCurrency];
        const toRate = rates[toCurrency];
        if (fromRate && toRate) {
            return (toRate / fromRate).toFixed(6);
        }
        return null;
    };

    const CurrencySelector = ({ value, onChange, disabled }: {
        value: string,
        onChange: (code: string) => void,
        disabled: boolean
    }) => {
        return (
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="p-2 w-full text-right outline-none cursor-pointer bg-transparent"
                    disabled={disabled}
                >
                    {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                            {currency.name}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

    const handleSwap = () => {
        const tempAmount = amount;
        const tempResult = result;
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setAmount(tempResult?.toFixed(2) ?? '');
        setResult(tempAmount ? parseFloat(tempAmount) : null);
    };

    const handleSave = () => {
        if (!result || !amount || !rates) return;
        
        const currentRate = getCurrentExchangeRate();
        if (!currentRate) return;

        const newConversion: ConversionHistory = {
            id: Date.now().toString(),
            amount,
            fromCurrency,
            toCurrency,
            result,
            rate: currentRate,
            timestamp: new Date()
        };

        setHistory(prev => [newConversion, ...prev]);
    };

    const handleDelete = (id: string) => {
        setHistory(prev => {
            const newHistory = prev.filter(item => item.id !== id);
            if (newHistory.length === 0) {
                // Clear cookies if no history left
                setCookie('conversionHistory', '', -1);
            }
            return newHistory;
        });
    };

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-4">
            <div className="flex flex-col lg:flex-row w-full max-w-7xl justify-between items-start gap-8">
                {/* Left Column - Empty for now (hidden on mobile) */}
                <div className="w-[350px] hidden lg:block">
                    {/* Future content can go here */}
                </div>

                {/* Middle Column - Main Converter */}
                <div className="flex flex-col items-center gap-4 w-full lg:w-auto">
                    <div className="text-sm text-gray-400 mt-2 text-center">
                        Exchange Rate: 1 {fromCurrency} = {getCurrentExchangeRate()} {toCurrency}
                    </div>
                    <div className="flex flex-row gap-4">
                        <div 
                            className="px-2 flex flex-row justify-center items-center text-3xl bg-[#2d2d2d] rounded-[10px] border border-[#3f3f3f] hover:border-[#6e6e6e] transition duration-200 cursor-pointer"
                            onClick={handleSwap}
                        >
                            <MdSwapVert />
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row bg-[#2d2d2d] px-[15px] rounded-[10px] border border-[#3f3f3f] hover:border-[#6e6e6e] transition duration-200 w-full sm:w-[400px]">
                                <div className="w-1/3">
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Amount"
                                        className="p-2 w-full text-left outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    />
                                </div>
                                <div className="h-1/2 w-[1px] bg-[#3f3f3f] my-auto"></div>
                                <div className="w-2/3">
                                    <CurrencySelector
                                        value={fromCurrency}
                                        onChange={setFromCurrency}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row bg-[#2d2d2d] px-[15px] rounded-[10px] border border-[#3f3f3f] hover:border-[#6e6e6e] transition duration-200 w-full sm:w-[400px]">
                                <div className="w-1/3 flex text-left">
                                    {loading ? (
                                        <div className="text-center mt-4">Loading...</div>
                                    ) : result !== null ? (
                                        <div className="p-2 w-full text-left outline-none">
                                            {result.toFixed(2)}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="h-1/2 w-[1px] bg-[#3f3f3f] my-auto"></div>
                                <div className="w-2/3">
                                    <CurrencySelector
                                        value={toCurrency}
                                        onChange={setToCurrency}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - History Panel */}
                <div className="bg-[#2d2d2d] rounded-[10px] border border-[#3f3f3f] w-full lg:w-[350px] h-[500px] flex flex-col">
                    <div className="p-4 border-b border-[#3f3f3f]">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Conversion History</h3>
                                <p className="text-sm text-gray-400">{history.length} saved conversions</p>
                            </div>
                            <div 
                                className="gap-2 flex flex-row justify-center items-center px-4 py-2 bg-[#2d2d2d] rounded-[10px] border border-[#3f3f3f] hover:border-[#6e6e6e] transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSave}
                                style={{ opacity: (!result || !amount) ? 0.5 : 1, cursor: (!result || !amount) ? 'not-allowed' : 'pointer' }}
                            >
                                <MdSave />Save
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {history.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>No conversions saved yet</p>
                            </div>
                        ) : (
                            <div className="p-2">
                                {history.map((conversion) => (
                                    <div key={conversion.id} className="mb-3 p-3 bg-[#1f1f1f] rounded-lg border border-[#3f3f3f] hover:border-[#6e6e6e] transition duration-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-sm font-medium text-white flex-1">
                                                {conversion.amount} {conversion.fromCurrency} → {conversion.result.toFixed(2)} {conversion.toCurrency}
                                            </div>
                                            <button
                                                onClick={() => handleDelete(conversion.id)}
                                                className="ml-2 p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition duration-200 cursor-pointer"
                                                title="Delete conversion"
                                            >
                                                <MdDelete size={16} />
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-400 mb-1">
                                            Rate: 1 {conversion.fromCurrency} = {conversion.rate} {conversion.toCurrency}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {`${conversion.timestamp.getDate().toString().padStart(2, '0')}.${(conversion.timestamp.getMonth() + 1).toString().padStart(2, '0')}.${conversion.timestamp.getFullYear()} ${conversion.timestamp.getHours().toString().padStart(2, '0')}:${conversion.timestamp.getMinutes().toString().padStart(2, '0')}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
