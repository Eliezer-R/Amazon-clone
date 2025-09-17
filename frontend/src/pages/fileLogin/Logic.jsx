// manages changes in the login form inputs
export const handleChange = (e, setFormData) => {
  const { name, value } = e.target
  setFormData((prev) => ({
    ...prev,
    [name]: value
  }))
}

// Handles the submission of the login form
export const handleSubmit = async ({ e, setIsLoading, formData, navigate, login, from }) => {
  e.preventDefault()
  setIsLoading(true)

  const result = await login(formData.email, formData.password)

  if (result.success) {
    navigate(from, { replace: true })
  }

  setIsLoading(false)
}
