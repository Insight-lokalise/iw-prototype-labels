## FAQ

Q: How do I change the contents of the <td /> I need custom styles for different columns?

A: You can pass components in as your tableData like this:
  const tableData = [
    {
      number: <Testing123 value={'0000000015'} />,
      requestor: 'Anna Bloodworth',
      creationDate: '25 Sep 2017 (3 days ago)',
      daysInQueue: 3,
      account: '1000001 - Blitz Software',
      total: 'USD $3,959.00',
      actions: <TestingDropdown options={testOptions} />,
    }
  ]

Q: What if I want a custom row?

A: You can pass one in using the customRow props. But make sure it's wrapped in a <tbody /> tag.
  See the props in IWExpandableTableRow for a reference of what props it will receive and how you can use them.


