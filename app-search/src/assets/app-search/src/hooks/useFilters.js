import { useEffect, useState } from 'react'
import { filtersMock } from './mock'

export const getFilters = (deps = []) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState([])
  useEffect(() => {
    // Call api and update filters
    setFilters(filtersMock)
  }, deps)

  return [filters, loading, error]
}

export const useFilters = (deps = []) => {
  const [selectedFilters, setActiveFilters] = useState(
    new Map().set('in-stock=true', {
      group: 'in-stock',
      label: 'Show in stock only',
      value: true,
    })
  )

  const setFilter = (option, clearGroup) => {
    const key = `${option.group}=${option.value}`
    // Find and remove all queries in the selected group
    if (clearGroup) {
      selectedFilters.forEach((filter) => {
        if (filter.group == option.group) {
          selectedFilters.delete(`${filter.group}=${filter.value}`)
        }
      })
    }
    // Find and remove the selected filter if set
    if (selectedFilters.has(key)) {
      selectedFilters.delete(key)
      setActiveFilters(new Map(selectedFilters))
      return
    }
    setActiveFilters(new Map(selectedFilters.set(key, option)))
    // TODO: persist new map to url
  }

  const clearFilters = () => {
    setActiveFilters(new Map())
  }

  return [selectedFilters, setFilter, clearFilters]
}
