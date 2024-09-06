export const IS_DEV = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
export const IS_MOCK = !!process.env.IS_MOCK
export const IS_IOS = /iPad|iPhone|iPod/.test(navigator ? navigator.userAgent : '')