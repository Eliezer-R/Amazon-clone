import './LoadingSpinner.css'

function LoadingSpinner ({ size = 'medium', text = 'Cargando...' }) {
  return (
    <div className='loading-container'>
      <div className={`spinner ${size}`} />
      {text && <p className='loading-text'>{text}</p>}
    </div>
  )
}

export default LoadingSpinner
