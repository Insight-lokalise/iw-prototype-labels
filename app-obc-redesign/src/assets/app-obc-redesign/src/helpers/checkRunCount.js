/* Determines if we need to show other modules or not */
export default function checkRunCount(runCount, countLimit) {  
  return runCount > countLimit  
}
