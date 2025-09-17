import { useState, useEffect } from 'react';

const ShoppingDesign = () => {
  // State to manage the window width
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hide design on small screens
  if (windowWidth < 770) {
    return null;
  }
  const styles = {
    container: {
      position: 'relative',
      width: '100%',
      height: '100%',
     
    }
  };

  return (
    <div className="hero-image" style={styles.container}>
      <style>{`
        /* Audífonos completos en la parte superior */
        .headphones {
          position: absolute;
          top: 50px;
          right: 150px;
          width: 90px;
          height: 90px;
          z-index: 15;
        }

        .headphone-band {
          width: 90px;
          height: 90px;
          border: 4px solid #2c3e50;
          border-radius: 50px 50px 20px 20px;
          position: relative;
          background: transparent;
        }

        .headphone-left, .headphone-right {
          position: absolute;
          width: 35px;
          height: 45px;
          background: linear-gradient(135deg, #34495e, #2c3e50);
          border-radius: 50%;
          border: 3px solid #f39c12;
        }

        .headphone-left {
          left: -18px;
          top: 25px;
        }

        .headphone-right {
          right: -18px;
          top: 25px;
        }

        /* Tarjeta shopping central */
        .shopping-card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(15deg);
          width: 200px;
          height: 150px;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          border-radius: 15px;
          z-index: 16;
          box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        }

        .shopping-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #f39c12;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
        }

        /* Formas geométricas completas */
        .geo-shape {
          position: absolute;
          border: 2px solid #f39c12;
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        }

        .circle-1 {
          top: 60%;
          left: 15%;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          z-index: 13;
        }

        .circle-2 {
          top: 25%;
          right: 25%;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          z-index: 12;
        }

        .circle-3 {
          bottom: 20%;
          right: 15%;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          z-index: 14;
        }

        .hexagon-1 {
          top: 70%;
          left: 40%;
          width: 70px;
          height: 70px;
          clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
          z-index: 12;
        }

        .hexagon-2 {
          top: 15%;
          left: 25%;
          width: 90px;
          height: 90px;
          clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
          z-index: 11;
        }

        .diamond {
          bottom: 25%;
          left: 20%;
          width: 60px;
          height: 60px;
          transform: rotate(45deg);
          z-index: 13;
        }

        /* Elementos decorativos */
        .floating-dots {
          position: absolute;
          z-index: 11;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #f39c12;
          border-radius: 50%;
          position: absolute;
          animation: float 3s ease-in-out infinite;
        }

        .dot:nth-child(1) { top: 100px; left: 200px; animation-delay: 0s; }
        .dot:nth-child(2) { top: 150px; left: 250px; animation-delay: 0.5s; }
        .dot:nth-child(3) { top: 120px; left: 300px; animation-delay: 1s; }
        .dot:nth-child(4) { bottom: 100px; right: 200px; animation-delay: 1.5s; }
        .dot:nth-child(5) { bottom: 150px; right: 300px; animation-delay: 2s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.7; }
          50% { transform: translateY(-20px); opacity: 1; }
        }

        /* Efecto de partículas en el shopping card */
        .particle {
          position: absolute;
          background: #f39c12;
          border-radius: 50%;
          pointer-events: none;
        }

        .particle-1 {
          width: 4px;
          height: 4px;
          top: 40%;
          left: 30%;
          animation: sparkle 2s ease-in-out infinite;
        }

        .particle-2 {
          width: 6px;
          height: 6px;
          top: 60%;
          right: 25%;
          animation: sparkle 2s ease-in-out infinite 0.5s;
        }

        .particle-3 {
          width: 3px;
          height: 3px;
          bottom: 30%;
          left: 40%;
          animation: sparkle 2s ease-in-out infinite 1s;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* Animaciones suaves */
        .geo-shape {
          animation: slowRotate 10s linear infinite;
        }

        .shopping-card {
          animation: gentleFloat 4s ease-in-out infinite;
        }

        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes gentleFloat {
          0%, 100% { transform: translate(-50%, -50%) rotate(15deg) translateY(0px); }
          50% { transform: translate(-50%, -50%) rotate(15deg) translateY(-10px); }
        }

        /* Responsive design */
        @media (max-width: 770px) {
          .headphones {
            top: 30px;
            right: 50px;
            transform: scale(0.8);
          }
          
          .shopping-card {
            width: 150px;
            height: 120px;
          }
          
          .shopping-text {
            font-size: 16px;
          }
          
          .circle-1, .circle-2, .circle-3 {
            transform: scale(0.8);
          }
          
          .hexagon-1, .hexagon-2 {
            transform: scale(0.7);
          }
        }
      `}</style>

      
      <div className="headphones">
        <div className="headphone-band">
          <div className="headphone-left"></div>
          <div className="headphone-right"></div>
        </div>
      </div>

      
      <div className="shopping-card">
        <div className="shopping-text">Shopping</div>
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
      </div>

     
      <div className="geo-shape circle-1"></div>
      <div className="geo-shape circle-2"></div>
      <div className="geo-shape circle-3"></div>
      <div className="geo-shape hexagon-1"></div>
      <div className="geo-shape hexagon-2"></div>
      <div className="geo-shape diamond"></div>

     
      <div className="floating-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default ShoppingDesign;