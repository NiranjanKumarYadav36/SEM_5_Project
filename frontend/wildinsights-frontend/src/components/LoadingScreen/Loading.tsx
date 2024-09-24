import React from "react";
import "./LoadingScreen.css"; // Import the CSS

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <div className="sky">
        <div className="stars"></div>
        <div className="moon"></div>
        <div className="sun"></div>
      </div>
      <div className="clouds">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
      </div>
      <div className="mountains">
        <div className="mountain mountain1"></div>
        <div className="mountain mountain2"></div>
        <div className="mountain mountain3"></div>
      </div>
      <div className="road">
        <div className="line"></div>
      </div>
      <div className="car">
        <div className="car-body">
          <div className="wheel wheel1"></div>
          <div className="wheel wheel2"></div>
        </div>
      </div>
      <div className="trees">
        <div className="tree tree1"></div>
        <div className="tree tree2"></div>
        <div className="tree tree3"></div>
      </div>
      <div className="birds">
        <div className="bird bird1">🐦</div>
        <div className="bird bird2">🐦</div>
        <div className="bird bird3">🐦</div>
        <div className="bird bird4">🐦</div>
        <div className="bird bird5">🐦</div>
      </div>
      <div className="loading-text">
        <span style={{ "--i": 1 } as React.CSSProperties}>L</span>
        <span style={{ "--i": 2 } as React.CSSProperties}>o</span>
        <span style={{ "--i": 3 } as React.CSSProperties}>a</span>
        <span style={{ "--i": 4 } as React.CSSProperties}>d</span>
        <span style={{ "--i": 5 } as React.CSSProperties}>i</span>
        <span style={{ "--i": 6 } as React.CSSProperties}>n</span>
        <span style={{ "--i": 7 } as React.CSSProperties}>g</span>
        <span style={{ "--i": 8 } as React.CSSProperties}>.</span>
        <span style={{ "--i": 9 } as React.CSSProperties}>.</span>
        <span style={{ "--i": 10 } as React.CSSProperties}>.</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
