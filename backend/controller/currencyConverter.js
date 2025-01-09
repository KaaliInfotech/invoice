const baseRates = {
    "AED": 0.3673,
    "AFN": 0.0121,
    "USD": 0.012,
    "EUR": 1.2048,
    "GBP": 1.3889,
    "ARS": 0.1135,
    "AUD": 0.771,
    "CAD": 0.798,
    "CNY": 0.153,
    "JPY": 0.171,
    "CHF": 0.735,
    "DKK": 0.090,
    "KRW": 0.015,
    "MXN": 0.240,
    "RUB": 0.919,
    "SGD": 0.016,
    "TRY": 0.107,
    "ZAR": 0.235,
    "KWD": 0.0036,
    "LKR": 0.144,
    "NGN": 5.62,
    "PKR": 1.25,
    "THB": 0.032,
    "VND": 0.024,
    "INR": 1.0,
    "BRL": 0.076,
    "CUP": 0.024,
    "SAR": 0.045,
    "QAR": 0.045,
    "NPR": 0.118,
    "RWF": 2.16,
    "KES": 1.11,
    "UGX": 2.29,
    "BHD": 0.0004,
    "SYP": 0.036,
    "MYR": 0.241,
    "MUR": 0.605,
    "TND": 0.350,
    "OMR": 0.0039,
    "GHS": 0.061,
    "BBD": 0.020,
    "GEL": 0.302,
    "CVE": 0.048,
    "BZD": 0.020,
    "HUF": 0.300,
    "HRK": 0.164,
    "DOP": 0.017,
    "ISK": 0.0078,
    "JMD": 1.65,
    "LYD": 0.007,
    "ZWL": 0.051,
    "SLL": 104.50,
    "TJS": 0.0091,
    "WST": 0.067,
    "FJD": 0.021,
    "PGK": 0.070,
    "FOK": 0.067,
    "LKR": 0.144
  }
  
  
  // Function to get the conversion rate from INR to another currency
  const getConversionRate = async (fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return 1;
  
    const fromRate = baseRates[fromCurrency];
    const toRate = baseRates[toCurrency];
  
    if (!fromRate) {
      throw new Error(`Conversion rate for ${fromCurrency} is not available.`);
    }
  
    if (!toRate) {
      throw new Error(`Conversion rate for ${toCurrency} is not available.`);
    }
  
    // Convert from INR to the 'fromCurrency', then to the 'toCurrency'
    const rate = (1 / fromRate) * toRate;
    return rate;
  };
  
  // Export the function for use
  module.exports = { getConversionRate };
  