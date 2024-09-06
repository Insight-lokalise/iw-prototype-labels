import {
  findHighestPriority,
  removeHighestPriority,
  recursivelyRemoveHighestPriority,
  findNextHighestPriorityToAdd,
  addNextHighestPriority,
  recursivelyAddHighestPriority,
  calculateNumberOfBreakpointsToDrop,
  calculateNumberOfBreakpointsToAdd,
} from './helpers'

describe('IWResponsiveTable helpers', () => {
  const tableColumns = [
    { priority: 1, name: 'Number', reference: 'number', className: 'text-left' },
    { priority: 3, name: 'Requestor', reference: 'requestor', className: 'text-left' },
    { priority: 7, name: 'Creation date', reference: 'creationDate', className: 'text-left' },
    { priority: 6, name: 'Days in queue', reference: 'daysInQueue', className: 'text-center' },
    { priority: 5, name: 'Account', reference: 'account', className: 'text-left' },
    { priority: 4, name: 'Total', reference: 'total', className: 'text-right' },
    { priority: 1, name: 'Actions', reference: 'actions', className: 'text-left' },
  ]

  const breakpointList = [400, 491, 574, 639, 748]

  // signature: findHighestPriority(tableColumns)
  describe('findHighestPriority', () => {
    it('should return the number of the highest priority', () => {
      expect(findHighestPriority(tableColumns)).toBe(7)
    })
  })

  // signature: removeHighestPriority(tableColumns, maxExpandedPriortiy)
  describe('removeHighestPriority', () => {
    it('should return a new array with the highest priority column filterd out', () => {
      expect(removeHighestPriority(tableColumns, 7)).toEqual([
        { priority: 1, name: 'Number', reference: 'number', className: 'text-left' },
        { priority: 3, name: 'Requestor', reference: 'requestor', className: 'text-left' },
        { priority: 6, name: 'Days in queue', reference: 'daysInQueue', className: 'text-center' },
        { priority: 5, name: 'Account', reference: 'account', className: 'text-left' },
        { priority: 4, name: 'Total', reference: 'total', className: 'text-right' },
        { priority: 1, name: 'Actions', reference: 'actions', className: 'text-left' },
      ])
    })
  })

  // signature: recursivelyRemoveHighestPriority(tableColumns, maxExpandedPriortiy, numberOfRemainingRemovals)
  describe('recursivelyRemoveHighestPriority', () => {
    it('should return a new array of tableColumns with numberOfRemainingRemovals priorities removed', () => {
      expect(recursivelyRemoveHighestPriority(tableColumns, 7, 5)).toEqual([
        { priority: 1, name: 'Number', reference: 'number', className: 'text-left' },
        { priority: 1, name: 'Actions', reference: 'actions', className: 'text-left' },
      ])
    })
  })

  // signature: findNextHighestPriorityToAdd(tableColumns, maxExpandedPriortiy)
  describe('findNextHighestPriorityToAdd', () => {
    it('should return the number of the priority immediately above the maxExpandedPriortiy', () => {
      expect(findNextHighestPriorityToAdd(tableColumns, 1)).toBe(3)
      expect(findNextHighestPriorityToAdd(tableColumns, 6)).toBe(7)
    })
  })

  // signature: addNextHighestPriority(tableColumns, maxExpandedPriortiy)
  describe('addNextHighestPriority', () => {
    it('should return a new array with the next highest priority column included', () => {
      expect(addNextHighestPriority(tableColumns, 1)).toEqual([
        { priority: 1, name: 'Number', reference: 'number', className: 'text-left' },
        { priority: 3, name: 'Requestor', reference: 'requestor', className: 'text-left' },
        { priority: 1, name: 'Actions', reference: 'actions', className: 'text-left' },
      ])
    })
  })

  // signature: recursivelyAddHighestPriority(tableColumns, maxExpandedPriortiy, numberOfRemainingAdds)
  describe('recursivelyAddHighestPriority', () => {
    it('should return a new array with the next highest priority column included', () => {
      expect(recursivelyAddHighestPriority(tableColumns, 1, 3)).toEqual([
        { priority: 1, name: 'Number', reference: 'number', className: 'text-left' },
        { priority: 3, name: 'Requestor', reference: 'requestor', className: 'text-left' },
        { priority: 5, name: 'Account', reference: 'account', className: 'text-left' },
        { priority: 4, name: 'Total', reference: 'total', className: 'text-right' },
        { priority: 1, name: 'Actions', reference: 'actions', className: 'text-left' },
      ])
    })
  })

  // signature: calculateNumberOfBreakpointsToDrop(divWidth, breakpointList, lowerBreakpointIndex)
  describe('calculateNumberOfBreakpointsToDrop', () => {
    it('should return correct number of breakpoints to drop', () => {
      expect(calculateNumberOfBreakpointsToDrop(405, breakpointList, 4)).toBe(4)
      expect(calculateNumberOfBreakpointsToDrop(405, breakpointList, 2)).toBe(2)
      expect(calculateNumberOfBreakpointsToDrop(505, breakpointList, 4)).toBe(3)
      expect(calculateNumberOfBreakpointsToDrop(750, breakpointList, 4)).toBe(0)
    })
  })

  // signature: calculateNumberOfBreakpointsToAdd(divWidth, breakpointList, upperBreakpointIndex)
  describe('calculateNumberOfBreakpointsToAdd', () => {
    it('should return correct number of breakpoints to add', () => {
      expect(calculateNumberOfBreakpointsToAdd(405, breakpointList, 0)).toBe(1)
      expect(calculateNumberOfBreakpointsToAdd(505, breakpointList, 2)).toBe(0)
      expect(calculateNumberOfBreakpointsToAdd(750, breakpointList, 0)).toBe(5)
    })
  })
})
