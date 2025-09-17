import { createContext, useContext, useReducer, useEffect } from 'react'

const AuthContext = createContext()

const initialState = {
  user: null,
  loading: true,
  error: null
}

function authReducer (state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'LOGOUT':
      return { ...state, user: null, loading: false, error: null }
    default:
      return state
  }
}

export function AuthProvider ({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // At startup we check if there is a session cookie
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'SET_USER', payload: data.user })
      } else if (response.status === 401) {
        dispatch({ type: 'LOGOUT' })
      } else {
        console.warn('Error inesperado en /auth/me', response.status)
      }
    } catch (error) {
      console.error('Error al verificar sesión:', error)
      dispatch({ type: 'LOGOUT' })
    }
  }

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })
      const data = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_USER', payload: data.user })
        return { success: true }
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message })
        return { success: false, error: data.message }
      }
    } catch {
      const errorMessage = 'Error de conexión. Intenta de nuevo.'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
        credentials: 'include'
      })
      const data = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_USER', payload: data.user })
        return { success: true }
      } else {
        dispatch({ type: 'SET_ERROR', payload: data.message })
        return { success: false, error: data.message }
      }
    } catch {
      const errorMessage = 'Error de conexión. Intenta de nuevo.'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      dispatch({ type: 'LOGOUT' })
    }
  }

  const setUser = async (user) => {
    dispatch({ type: 'SET_USER', payload: user })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    setUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth () {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
