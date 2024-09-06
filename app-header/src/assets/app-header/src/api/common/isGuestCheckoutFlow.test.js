import { isGuestCheckoutFlow } from "./isGuestCheckoutFlow";

describe("Validate if user location  is in Guest Checkout flow pages", () => {

    test("Reject when location is not in checkout flow ", () => {
        const pathname = "/login";
        const result = isGuestCheckoutFlow(pathname);
        expect(result).toBeFalsy();
    });

    test("Accept  is in Guest Checkout flow pages", () => {
        const pathname = "/customerInfo";
        const result = isGuestCheckoutFlow(pathname);
        expect(result).toBeTruthy();
    });

    test.each([undefined, 0, "", 1, null, 0x12, Infinity])("Reject when location is not a path %s", (pathname) => {
        let result = isGuestCheckoutFlow(pathname);
        expect(result).toBeFalsy();
    });

})