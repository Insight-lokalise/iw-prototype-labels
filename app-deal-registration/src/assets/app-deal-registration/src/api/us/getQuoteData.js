const TIMEOUT = 3000; // 3 seconds

// Fetch data from API and Abort in case response is not received within 'TIMEOUT' ms.
export default async function getQuoteData(quoteNumber) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT);
 
    let response;
    try {
        response = await fetch(`/dealreg/quote/${quoteNumber}`, {
            signal: controller.signal
        });
        response = response?.json();
    } catch(err) {
        if (err.name == 'AbortError') {
          console.warn(`Timeout while fetching Quote data: `, err);
        } else {
          console.warn(`Failed to fetch Quote data: `, err);
        }
    }
 
    if(id) clearTimeout(id);
    return response;
}

