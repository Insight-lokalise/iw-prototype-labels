const handleLogout = () => {
    function redirectToLogout() {
        window.location.href = "/insightweb/logout";
    }
    window.localStorage.removeItem("persist:checkout")
    var removeGigyaCookieFlag = window.flags && window.flags['GNA-9532-Remove-Gigya-Cookie'];
    var isGigyaLogoutAvailable = window.gigya && window.gigya.accounts && window.gigya.accounts.logout;
    var isLoginAsUser = window.location.hostname.includes('loginas');
    if(removeGigyaCookieFlag && isGigyaLogoutAvailable && !isLoginAsUser) {
        try {
            var timeoutId = setTimeout(redirectToLogout, 400);

            // Call Gigya Logout
            function callback(resp) {
                clearTimeout(timeoutId);
                var errorCode = resp && resp.errorCode;
                if(errorCode !== 0) {
                    console.log('---- Gigya logout failure ----',error);
                }
                redirectToLogout();
            }

            window.gigya.accounts.logout({
                callback: callback
            });
        } catch (error) {
            console.error('---- Error calling Gigya logout method ----',error);
            redirectToLogout();
        }
    } else {
        redirectToLogout();
    }
}

export default handleLogout;
