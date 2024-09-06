export default function populateHours() {
  const arr = []
  for (let i = 0; i <= 23; i++){
    arr.push(`${i}:00`)
  }
  return arr;
}
