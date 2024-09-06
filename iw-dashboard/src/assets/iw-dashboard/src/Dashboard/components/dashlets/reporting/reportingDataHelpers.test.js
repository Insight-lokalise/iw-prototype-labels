import { formatData } from './reportingDataHelpers'

const rawData = [
  { amount: 1, region: 'APAC', country: 'China', month: '2016-01' },
  { amount: 2, region: 'APAC', country: 'China', month: '2017-01' },
  { amount: 4, region: 'EMEA', country: 'Germany', month: '2016-01' },
  { amount: 8, region: 'EMEA', country: 'Germany', month: '2017-01' },
  { amount: 16, region: 'North America', country: 'Canada', month: '2016-01' },
  { amount: 32, region: 'North America', country: 'Canada', month: '2017-01' },
  { amount: 64, region: 'North America', country: 'United States', month: '2016-01' },
  { amount: 128, region: 'North America', country: 'United States', month: '2016-02' },
  { amount: 256, region: 'North America', country: 'United States', month: '2016-03' },
  { amount: 512, region: 'North America', country: 'United States', month: '2017-01' },
  { amount: 1024, region: 'North America', country: 'United States', month: '2017-02' },
  { amount: 2048, region: 'North America', country: 'United States', month: '2017-03' },
]
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const setState = jest.fn((object, callback) => {
  if (callback) callback()
})

describe('reportingDataHelpers', () => {
  afterEach(() => {
    setState.mockClear()
  })
  describe('formatData', () => {
    describe('w/o comparison', () => {
      it('sets quantity name', () => {
        const result = formatData(
          'amount',
          monthNames,
          rawData,
          false,
          'region',
          { startMonth: '2016-01', endMonth: '2017-03' },
          ['Spent']
        )
        const expected = {
          barChartInfo: {
            data: [
              { region: 'APAC', Spent: 3 },
              { region: 'EMEA', Spent: 12 },
              { region: 'North America', Spent: 4080 },
            ],
            dataKey: 'region',
            barKeys: [{ dataKey: 'Spent' }],
          },
          startMonth: '2016-01',
          endMonth: '2017-03',
        }
        expect(result).toEqual(expected)
      })
      it('handles date filtering', () => {
        const result = formatData('amount', monthNames, rawData, false, 'region', {
          startMonth: '2016-02',
          endMonth: '2017-01',
        })
        const expected = {
          barChartInfo: {
            data: [
              { region: 'APAC', 'Feb 2016 - Jan 2017': 2 },
              { region: 'EMEA', 'Feb 2016 - Jan 2017': 8 },
              { region: 'North America', 'Feb 2016 - Jan 2017': 928 },
            ],
            dataKey: 'region',
            barKeys: [{ dataKey: 'Feb 2016 - Jan 2017' }],
          },
          startMonth: '2016-02',
          endMonth: '2017-01',
        }
        expect(result).toEqual(expected)
      })
      it('handles other filters', () => {
        const result = formatData('amount', monthNames, rawData, false, 'region', {
          startMonth: '2016-01',
          endMonth: '2017-04',
          country: 'Canada',
        })
        const expected = {
          barChartInfo: {
            data: [{ region: 'North America', 'Jan 2016 - Apr 2017': 48 }],
            dataKey: 'region',
            barKeys: [{ dataKey: 'Jan 2016 - Apr 2017' }],
          },
          startMonth: '2016-01',
          endMonth: '2017-04',
        }
        expect(result).toEqual(expected)
      })
      it('handles different spendBy', () => {
        const result = formatData('amount', monthNames, rawData, false, 'country', {
          startMonth: '2016-01',
          endMonth: '2017-04',
        })
        const expected = {
          barChartInfo: {
            data: [
              { country: 'Canada', 'Jan 2016 - Apr 2017': 48 },
              { country: 'China', 'Jan 2016 - Apr 2017': 3 },
              { country: 'Germany', 'Jan 2016 - Apr 2017': 12 },
              { country: 'United States', 'Jan 2016 - Apr 2017': 4032 },
            ],
            dataKey: 'country',
            barKeys: [{ dataKey: 'Jan 2016 - Apr 2017' }],
          },
          startMonth: '2016-01',
          endMonth: '2017-04',
        }
        expect(result).toEqual(expected)
      })
      it('handles spendBy = month', () => {
        const result = formatData('amount', monthNames, rawData, false, 'month', {
          startMonth: '2016-01',
          endMonth: '2017-04',
        })
        const expected = {
          barChartInfo: {
            data: [
              { 'Jan 2016 - Apr 2017': 85, month: '2016-01' },
              { 'Jan 2016 - Apr 2017': 128, month: '2016-02' },
              { 'Jan 2016 - Apr 2017': 256, month: '2016-03' },
              { 'Jan 2016 - Apr 2017': 0, month: '2016-04' },
              { 'Jan 2016 - Apr 2017': 0, month: '2016-05' },
              { 'Jan 2016 - Apr 2017': 0, month: '2016-06' },
              { 'Jan 2016 - Apr 2017': 0, month: '2016-07' },
              { 'Jan 2016 - Apr 2017': 0, month: '2016-08' },
              { 'Jan 2016 - Apr 2017': 0, month: '2016-09' },
              { 'Jan 2016 - Apr 2017': 0, month: '2016-10' },
              { 'Jan 2016 - Apr 2017': 0, month: '2016-11' },
              { 'Jan 2016 - Apr 2017': 0, month: '2016-12' },
              { 'Jan 2016 - Apr 2017': 554, month: '2017-01' },
              { 'Jan 2016 - Apr 2017': 1024, month: '2017-02' },
              { 'Jan 2016 - Apr 2017': 2048, month: '2017-03' },
              { 'Jan 2016 - Apr 2017': 0, month: '2017-04' },
            ],
            dataKey: 'month',
            barKeys: [{ dataKey: 'Jan 2016 - Apr 2017' }],
          },
          startMonth: '2016-01',
          endMonth: '2017-04',
        }
        expect(result).toEqual(expected)
      })
    })
    describe('w/ comparison', () => {
      it('works w/ date filters', () => {
        const result = formatData('amount', monthNames, rawData, true, 'region', {
          startMonth: '2016-11',
          endMonth: '2017-10',
        })
        const expected = {
          barChartInfo: {
            data: [
              { 'Nov 2016 - Oct 2017': 2, 'Nov 2015 - Oct 2016': 1, region: 'APAC' },
              { 'Nov 2016 - Oct 2017': 8, 'Nov 2015 - Oct 2016': 4, region: 'EMEA' },
              { 'Nov 2016 - Oct 2017': 3616, 'Nov 2015 - Oct 2016': 464, region: 'North America' },
            ],
            dataKey: 'region',
            barKeys: [{ dataKey: 'Nov 2015 - Oct 2016' }, { dataKey: 'Nov 2016 - Oct 2017' }],
          },
          startMonth: '2016-11',
          endMonth: '2017-10',
        }
        expect(result).toEqual(expected)
      })
      it('sets quantity names', () => {
        const filters = { startMonth: '2017-01', endMonth: '2017-03' }
        const result = formatData('amount', monthNames, rawData, true, 'region', filters, ['Current', 'Past'])
        const expected = {
          barChartInfo: {
            data: [
              { Current: 2, Past: 1, region: 'APAC' },
              { Current: 8, Past: 4, region: 'EMEA' },
              { Current: 3616, Past: 464, region: 'North America' },
            ],
            dataKey: 'region',
            barKeys: [{ dataKey: 'Past' }, { dataKey: 'Current' }],
          },
          startMonth: '2017-01',
          endMonth: '2017-03',
        }
        expect(result).toEqual(expected)
      })
    })
  })
})
