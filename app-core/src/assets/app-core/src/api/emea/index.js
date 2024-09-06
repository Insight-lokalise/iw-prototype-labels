// EMEA opted out Log Rocket
export const initLogRocket = () => {}
export const getFeatureFlags = () => {
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      reject("Error: no implementation for EMEA")
    }, 0)
  })
}
