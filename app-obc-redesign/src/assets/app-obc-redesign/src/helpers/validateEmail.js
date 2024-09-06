import { validateEmail as validateEmailToolkit } from '@insight/toolkit-utils'

export default function validateEmail(email, emailsList) {
  if(!email){
    return { errorMsg: "Please enter something in the email field.", isValid: false }
  }
  if (!validateEmailToolkit(email)) {
    return { errorMsg: "Please enter a valid email.", isValid: false }
  } else if (emailsList.find((element) => (email === element))) {
    return { errorMsg: "Sorry, no duplicate emails are allowed.", isValid: false }
  }
  return { isValid: true }
}
