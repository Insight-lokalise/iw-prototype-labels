export default function searchTypeNameMap(searchBy) {
  return searchBy.reduce((acc, curr) => {
    acc[curr.value] = curr.displayName
    return acc
  }, {})
}
