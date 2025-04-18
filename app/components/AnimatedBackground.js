import React from 'react';
import styled, { keyframes } from 'styled-components';

const rollDice = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const AnimatedBackground = () => {
  return (
    <StyledWrapper>
      <div className="dice-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="dice">
            <div className="pip pip-1" />
            <div className="pip pip-2" />
            <div className="pip pip-3" />
            <div className="pip pip-4" />
            <div className="pip pip-5" />
            <div className="pip pip-6" />
          </div>
        ))}
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #3b82f6 0%, white 100%);

  .dice-container {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 10px;
    padding: 10px;
  }

  .dice {
    width: 60px;
    height: 60px;
    background: white;
    border-radius: 10px;
    position: relative;
    animation: ${rollDice} 4s infinite linear;
    animation-delay: calc(var(--i) * 0.2s);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pip {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #1a1a1a;
    border-radius: 50%;
  }

  .pip-1 { top: 20%; left: 20%; }
  .pip-2 { top: 20%; right: 20%; }
  .pip-3 { top: 50%; left: 50%; transform: translate(-50%, -50%); }
  .pip-4 { bottom: 20%; left: 20%; }
  .pip-5 { bottom: 20%; right: 20%; }
  .pip-6 { display: none; }
`;

export default AnimatedBackground;