// real-time password validation functionality
export const useHandleChange = (setFormData, validatePassword) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (name === 'password') {
      validatePassword(value)
    }
  }

  return {
    handleChange
  }
}

// real-time password validation functionality
export const useValidatePassword = (setPasswordErrors) => {
  const validatePassword = (password) => {
    const errors = []

    if (password.length < 6) {
      errors.push('Mínimo 6 caracteres')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Al menos una mayúscula')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Al menos una minúscula')
    }
    if (!/\d/.test(password)) {
      errors.push('Al menos un número')
    }

    setPasswordErrors(errors)
  }

  return {
    validatePassword
  }
}

// form submission handler
export const useHandleSubmit = ({ formData, passwordErrors, setIsLoading, register, navigate }) => {
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      return
    }

    if (passwordErrors.length > 0) {
      return
    }

    setIsLoading(true)

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      address: formData.address
    })

    if (result.success) {
      navigate('/', { replace: true })
    }

    setIsLoading(false)
  }

  return {
    handleSubmit
  }
}

// form validation check
export const useIsFormValid = ({ formData, passwordErrors }) => {
  return (
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    passwordErrors.length === 0
  )
}
