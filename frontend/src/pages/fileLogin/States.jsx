import { useState } from 'react'
export const useStatesfileLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return { formData, setFormData, isLoading, setIsLoading, showPassword, setShowPassword }
}
