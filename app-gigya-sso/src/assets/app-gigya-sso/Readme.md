**APP GIGYA SSO**

Gigya is replacing GLM authentication. now every application has its own implementation of 
authentication with GLM. 

Currently we use tokens to jump between applications. With introduction of gigya 
we will be partially or completely moving away from using jump tokens. Main intent of 
this application is use GIGYA Web SDK and build a shared script, to use across applications.
kind of single sign on. 

SSO Flow using GIGYA 

1. App A is populated with a cookie from gigya after authentication which will be found with name "gac"
2. App A will need to load Gigya Web SDK when trying to jump to App B
3. Web SDK will be a simple javascript file from gigya but it is unique to APP. App need to 
   request its web SDK by passing its Gigya API Key. so that Gigya sends right web SDK.
4. When App A loads intermediate page with web SDK, it reads Gigya populated cookies on initial 
authentication and removes "gac" cookie and populates "glt" cookie. Along with it also populates additional 
cookies on gigya domain. Gigya domain is nothing but where the web SDK is loaded from.
5. Web SDK will invoke a callback method upon successful authentication on intermediate page
6. In callback method App A will navigate to its intended location which is App B's intermediate page 
with gigya web SDK is loaded with its own API key. 
7. App B web SDK has access to cookies created on gigya domain by App A intermediate page. Thus it identifies user 
triggers a registered callback. 
8. App B callback need to invoke its own authentication API based on status of callback

Same us repeated when user jumping from App B to App A

This app is simple effort to make things easy and reusable. In this script can be loaded on 
intermediate page or any page. script needs expects below to inialize and run

1. API to fetch gigya API key (GET)
2. App own authentication API to call after callback (POST). script sends below as payload 
  UID,
  UIDSignature,
  signatureTimestamp,
  redirectTo,
  locale 
3. Location / URL to navigate to in Gigya authentication failure 

SAMPLE Intermediate page looks like below. it does not need to be JSP.
```html
<html>
<head>
    <title>Insight SSO</title>
    <script type="text/javascript" src="${your own location where script is hosted}/app-gigya-sso.${hash}.js"></script>
    <script>
        var insightGigyaSSO = InsightGigya.insightGigyaInit({
            apiKeyEndPoint: "/insightweb/gigyaAPIKey",
            authURI: "/insightweb/notifyLogin",
            onAuthFailureURI: "/insightweb/login"
        })
        function onGigyaServiceReady(res) { 
            gigya.accounts.getAccountInfo({
                callback: insightGigyaSSO.onLoginHandler
            });
        }
    </script>
</head>
<body>
    <h1>Loading wheel will be more applealing to user when jump is happening</h1>
</body>
</html>
```    

SAMPLE JUMP URL 

```HTML
App A/intermediate page?targetDomain=App B intermediate page&redirectTo=any valid route on App B&locale=if needed

sample
https://us-dev.insight.com/insightweb/sso/gigya?targetDomain=http%3A%2F%2Fglm-rwmanager-dev.insight.com%2Fwarrantyweb%2Fsso%2Fgigya&redirectTo=%2Fwarrantyweb%2FproductSearch%3Fsourceportal%3Dinsightweb%26action%3Dviewall

```

Explanation of request parameters in jump URL / link

**targetDomain**: intermediate page of App B (required), This is expected to be URL encoded to support additional query 
parameters. 
**redirectTo**: a valid route on App B, where user intent to login after authentication. expected to be URL encoded.

Example: clicking on warranty portal dashlet on insight.com will authenticate user on warranty portal and navigates to 
dashlet page. It is not required

**locale**: If user needs to jump to App B to specific locale, and if redirect URL can not accommodate locale, then 
locale is used. It is not required  

Note: Any additional query parameters added in this jump link are appened to redirect URL. They come handy often. 
example is locale parameter 


Feel free to update / enhance or report bugs 
