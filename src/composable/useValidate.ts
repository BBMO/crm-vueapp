const useValidate = () => {
  interface validationMatchInterface {
    [key: string]: RegExp;
    password: RegExp
    email: RegExp
  }

  const validateRequired = (val: any): boolean => val && val.trim() !== '';

  const validateRequiredSelect = (val: any): boolean => val && val !== '';

  const validateNumber = (val: any): boolean => val !== null && val != 0;

  const validatePercentage = (val: any): boolean => val !== null && val !== '';

  const validatePercentageCommission = (val: any): boolean => val >= 0 && val <= 100;

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

  return {
    validateRequired,
    validateRequiredSelect,
    validateNumber,
    validatePercentage,
    validatePercentageCommission,
    validateFile,
    validateMatch
  }
}

export default useValidate;
