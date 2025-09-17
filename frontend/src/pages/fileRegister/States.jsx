import { useState } from 'react'

// Custom hook to manage password and form states
export const usePasswordState = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return {
    formData,
    setFormData,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword
  }
}

// Custom hook to manage password errors and loading state
export const usePasswordErrosState = () => {
  const [passwordErrors, setPasswordErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  return { passwordErrors, setPasswordErrors, isLoading, setIsLoading }
}
