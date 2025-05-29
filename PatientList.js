import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './PatientList.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const url = searchTerm 
          ? `${API_URL}/api/patients/search?q=${encodeURIComponent(searchTerm)}`
          : `${API_URL}/api/patients`;
        
        const res = await axios.get(url);
        setPatients(res.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/patients/${id}`);
      setPatients(patients.filter(p => p._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  if (loading) return <div className="loading">Loading patients...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="patient-list">
      <h2>Patient Records</h2>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to="/add" className="add-button">Add New Patient</Link>
      </div>

      {patients.length === 0 ? (
        <p>No patients found</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(patient => (
              <tr key={patient._id}>
                <td>{patient.patientId}</td>
                <td>
                  <Link to={`/patients/${patient._id}`}>{patient.name}</Link>
                </td>
                <td>{patient.age}</td>
                <td>{patient.gender}</td>
                <td className="actions">
                  <Link to={`/edit/${patient._id}`} className="edit">Edit</Link>
                  <button 
                    onClick={() => handleDelete(patient._id)}
                    className="delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}