export const validateEmail = email => {
  if(email !== '') {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  return true;
}
