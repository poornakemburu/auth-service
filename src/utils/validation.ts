export const validateSignup = (data: any) => {
    const errors: Record<string, string> = {};
  
    if (!data.firstName || data.firstName.trim() === '') {
      errors.firstName = 'First name is required';
    } else {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(data.firstName.trim())) {
        errors.firstName = 'First name should only contain letters and spaces';
      }
    }
  
    if (data.lastName && data.lastName.trim() !== '') {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(data.lastName.trim())) {
        errors.lastName = 'Last name should only contain letters and spaces';
      }
    }
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.(com|in|co|uk|us|net|org|edu)$/i;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.email = 'Valid email is required';
    }
  
    if (!data.password) {
      errors.password = 'Password is required';
    } else {
      const hasUpperCase = /[A-Z]/.test(data.password);
      const hasNumber = /\d/.test(data.password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(data.password);
      const isLongEnough = data.password.length >= 8;
      const isTooLong = data.password.length > 16;
  
      if (!hasUpperCase || !hasNumber || !hasSpecialChar || !isLongEnough || isTooLong) {
        errors.password = 'Password must be between 8-16 characters and include at least one uppercase letter, one number, and one special character';
      }
    }
  
    const validTargets = [
      'LOSE_WEIGHT',
      'GAIN_WEIGHT',
      'IMPROVE_FLEXIBILITY',
      'GENERAL_FITNESS',
      'BUILD_MUSCLE',
      'REHAB_RECOVERY'
    ];
    if (!data.target || !validTargets.includes(data.target.toUpperCase())) {
      errors.target = 'Valid target is required';
    }
  
    const validActivities = [
      'YOGA',
      'CLIMBING',
      'STRENGTH_TRAINING',
      'CROSS_FIT',
      'CARDIO_TRAINING',
      'REHABILITATION'
    ];
    if (!data.preferableActivity || !validActivities.includes(data.preferableActivity.toUpperCase().replace('-', '_'))) {
      errors.preferableActivity = 'Valid activity is required';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  export const validateSignin = (data: any) => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.(com|in|co|uk|us|net|org|edu)$/i;
  
    if (!data.email || !data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Invalid email format';
    }
  
    if (!data.password || !data.password.trim()) {
      errors.password = 'Password is required';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  export const validateUserUpdate = (data: any) => {
    const errors: Record<string, string> = {};
  
    // First name validation
    if (data.firstName) {
      if (data.firstName.trim() === '') {
        errors.firstName = 'First name cannot be empty';
      } else {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(data.firstName.trim())) {
          errors.firstName = 'First name should only contain letters and spaces';
        }
      }
    }
  
    // Last name validation
    if (data.lastName) {
      if (data.lastName.trim() === '') {
        errors.lastName = 'Last name cannot be empty';
      } else {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(data.lastName.trim())) {
          errors.lastName = 'Last name should only contain letters and spaces';
        }
      }
    }
  
    const validTargets = [
      'LOSE_WEIGHT',
      'GAIN_WEIGHT',
      'IMPROVE_FLEXIBILITY',
      'GENERAL_FITNESS',
      'BUILD_MUSCLE',
      'REHAB_RECOVERY'
    ];
    if (data.target && !validTargets.includes(data.target.toUpperCase())) {
      errors.target = 'Valid target is required';
    }
  
    const validActivities = [
      'YOGA',
      'CLIMBING',
      'STRENGTH_TRAINING',
      'CROSS_FIT',
      'CARDIO_TRAINING',
      'REHABILITATION'
    ];
    if (data.preferableActivity && !validActivities.includes(data.preferableActivity.toUpperCase().replace('-', '_'))) {
      errors.preferableActivity = 'Valid activity is required';
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  