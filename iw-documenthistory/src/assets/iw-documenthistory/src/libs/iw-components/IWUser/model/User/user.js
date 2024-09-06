/**
 * [loadUser description]
 * @return {[type]} [description]
 */
export function loadUser() {
  return new Promise((resolve, reject) => {
    window.InsightUserObject
      .ready()
      .fail(reject)
      .then(resolve)
  }).then(parseUser)
}

const parseUser = user => {
  const {
    apac,
    b2bLoginInfo,
    defaultConsortiaId,
    isLoggedin,
    isNavy,
    isSEWPUser,
    navySTName,
    userInformation,
    userPermissions,
    webGroupPermissions,
  } = user

  return {
    b2bLoginInfo,
    defaultConsortiaId: user.defaultConsortiaId,
    isNavy,
    isSEWPUser,
    navySTName,
    userInformation,
    userPermissions,
    webGroupPermissions,
    isAPAC: user.apac,
    isLoggedIn: user.isLoggedin,
  }
}
