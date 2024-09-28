// src/App.tsx
import React from 'react';
import XClone from './components/XClone';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to React with TypeScript</h1>
      </header>
      <main>
        <XClone /> 
      </main>
    </div>
  );
}

export default App;