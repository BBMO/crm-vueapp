const useValidate = () => {
  /*interface validationMatchInterface {
    [key: string]: RegExp;
    password: RegExp
    email: RegExp
  }*/

  const validateRequired = (val: any): boolean => val && val.trim() !== '';

  /*const validateNumber = (val: any): boolean => val !== null;

  const validateFile = (val: any): boolean => val && val.length > 0;

  const validateMatch = (val: any, type: string): boolean => {
    const matchType: validationMatchInterface = {
      password:
        /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!/+@#-$%^&*-.])[\w!/+@#-$%^&*-.]{8,20}$/,
      email:
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
    }

    return val && !!val.match(matchType[type])
  }

  const validatePasswordLength = (val: any): boolean => {
    if (!val) return true

    return val.length >= 6;
  }

  const validatePasswordsMatch = (val: any, password: any): boolean => {
    return val === password;
  }*/

  return {
    validateRequired,
  }
}

export default useValidate;
