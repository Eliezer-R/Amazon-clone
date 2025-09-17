import { useState } from "react"

// Custom hook to manage loading and error states
export const useStatesLoading = () => {
      const [isLoading, setIsLoading] = useState(false)
      const [error, setError] = useState("")

      return { isLoading, setIsLoading, error, setError }
}

// Custom hook to manage form data and success state
export const useStatesData = () => {
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
    shippingAddress: "",
    paymentMethod: "credit_card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })
    return { success, setSuccess, formData, setFormData }
}