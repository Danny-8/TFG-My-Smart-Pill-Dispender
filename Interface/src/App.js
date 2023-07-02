import React from 'react';
import Addpill from './components/addpill';
import Checkpill from './components/checkpill';
import './App.css';


function App() {
  return (
    <div style={{height: '100vh', width: '100vw' }}>
      <div className='title'>
        <h1 className='title-text'>
          My Smart Pill Dispenser
        </h1>
      </div>
      <div className='app-container'>
        <div className='right-section'>
          <Checkpill />
        </div>
      </div>
    </div>
  );
}

export default App;
