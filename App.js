import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>Healthcare Management System</h1>
        <Routes>
          <Route path="/" element={<PatientList />} />
          <Route path="/add" element={<PatientForm />} />
          <Route path="/edit/:id" element={<PatientForm editMode={true} />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;