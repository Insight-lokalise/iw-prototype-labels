export default async function getDeniedReasons() {
    const response = await fetch('/dealreg/deals/getAllDeniedReasons');
    return response.json();
}