const fs = require('fs');
const saml2 = require('saml2-js')

/*
* SSO integration using SAML
* */

// Create service provider
const sp_options = {
  entity_id: `${process.env.DOMAIN}/metadata.xml`,
  private_key: fs.readFileSync(process.env.PRIVATE_KEY_PATH).toString(),
  certificate: fs.readFileSync(process.env.CERTIFICATE_PATH).toString(),
  assert_endpoint: `${process.env.DOMAIN}/assert`,
  allow_unencrypted_assertion: true
};

const sp = new saml2.ServiceProvider(sp_options);
// Create identity provider
const idp_options = {
  sso_login_url: "https://login.microsoftonline.com/6c637512-c417-4e78-9d62-b61258e4b619/saml2/",
  sso_logout_url: "https://login.microsoftonline.com/6c637512-c417-4e78-9d62-b61258e4b619/saml2/",
  certificates: [
    // fs.readFileSync(process.env.IDP_CERT_PATH).toString(),
    fs.readFileSync(process.env.IDP_CERT_SIGN_PATH).toString()
  ]
};
const idp = new saml2.IdentityProvider(idp_options);
const ROLE_TYPE = 'ROLE_DEAL_REG_ADMIN'

module.exports = {
  sp,
  idp,
  ROLE_TYPE,
}
