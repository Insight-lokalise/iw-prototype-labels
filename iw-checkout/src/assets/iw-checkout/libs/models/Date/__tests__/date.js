import { monthsAgo, equalMonthAndYear } from './../date'

// const years = [2014, 2015,/* 2016, 2017*/]
// const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
// const days = (new Array(20)).fill(0).map((n, index) => index + 1) // [0, 1, 2, .. 30]

// TODO Still thinking about these tests. Dates are tough.
describe('Date utilities', () => {
    describe('monthsAgo', () => {
        test('monthsAgo ignores day of month', () => {
            const march31 = new Date('03/31/2017')
            const expectedDateTime1 = new Date('02/01/2017').getTime()
            const expectedDateTime2 = new Date('01/01/2017').getTime()
            const expectedDateTime3 = new Date('12/01/2016').getTime()
            expect(monthsAgo(1, march31).getTime()).toBe(expectedDateTime1)
            expect(monthsAgo(2, march31).getTime()).toBe(expectedDateTime2)
            expect(monthsAgo(3, march31).getTime()).toBe(expectedDateTime3)
        })

        xtest('monthsAgo returns sane results', () => {
            // years.forEach(year => {
            //     months.forEach(month => {
            //         days.forEach(day => {
            //             const date = new Date(`${month}/${day}/${year}`)
            //             months.forEach(numMonthsAgo => {
            //                 const dateForYear = new Date(`${Math.max(month - numMonthsAgo, 1)}/01/${year}`)
            //                 console.log('dateForYear', `${Math.max(month - numMonthsAgo, 1)}/01/${year}`)
            //                 const expectedMonthAgo = new Date(`${Math.max(month - numMonthsAgo, 1)}/01/${dateForYear.getUTCFullYear()}`)
            //                 console.log('dateForYear.getYear()', dateForYear, dateForYear.getUTCFullYear())
            //                 expect(monthsAgo(numMonthsAgo, date).getTime()).toBe(expectedMonthAgo.getTime())
            //             })
            //         })
            //     })
            // })
        })
    })

    describe('equalMonthAndYear', () => {
        it('should return sane values', () => {
            const march31st = new Date('03/31/2017')
            const march1st = new Date('03/1/2017')
            const may15th = new Date('05/15/2017')

            expect(equalMonthAndYear(march31st, march1st)).toBe(true)
            expect(equalMonthAndYear(march31st, may15th)).toBe(false)
        })
    })
})
