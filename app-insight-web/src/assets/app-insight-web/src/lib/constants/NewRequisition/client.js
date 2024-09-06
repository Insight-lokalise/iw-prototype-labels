//will make this file dynamic in the future
export const CLIENTS = {
  fresenius: {
    title: "Fresenius user",
    instructions: "user by first name, last name, email or user ID",
    columns: [
      {
        id: 'email',
        title: 'Email'
      },
      {
        id: 'surname',
        title: 'Last Name'
      },
      {
        id: 'givenname',
        title: 'First Name'
      },
      {
        id: 'employeeID',
        title: 'User ID'
      },
    ]
  },
  parsons: {
    title: "Job WBS code",
    instructions: "Job WBS code",
    columns: [
      {
        id: 'email',
        title: 'Approver Email'
      },
      {
        id: 'jobName',
        title: 'Job WBS'
      },
    ]
  },
  marriott:{
    title: "Marriott user",
    instructions: "user by first name, last name, email, DUD or EID",
    columns: [
      {
        id: 'surname',
        title: 'Last Name'
      },
      {
        id: 'givenname',
        title: 'First Name'
      },
      {
        id: 'email',
        title: 'Email'
      },
      {
        id: 'dud',
        title: 'DUD'
      },
      {
        id: 'employeeID',
        title: 'EID'
      },
    ]
  }
}