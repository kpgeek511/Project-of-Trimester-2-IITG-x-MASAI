import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './PatientDetail.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function PatientDetail() {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/patients/${id}`);
        setPatient(res.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return <div className="loading">Loading patient details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!patient) return <div>Patient not found</div>;

  return (
    <div className="patient-detail">
      <div className="header">
        <h2>Patient Details</h2>
        <Link to={`/edit/${patient._id}`} className="edit-button">Edit</Link>
      </div>

      <div className="detail-section">
        <h3>Basic Information</h3>
        <div className="detail-row">
          <span className="label">Patient ID:</span>
          <span>{patient.patientId}</span>
        </div>
        <div className="detail-row">
          <span className="label">Name:</span>
          <span>{patient.name}</span>
        </div>
        <div className="detail-row">
          <span className="label">Age:</span>
          <span>{patient.age}</span>
        </div>
        <div className="detail-row">
          <span className="label">Gender:</span>
          <span>{patient.gender}</span>
        </div>
        <div className="detail-row">
          <span className="label">Contact Info:</span>
          <span>{patient.contactInfo}</span>
        </div>
      </div>

      <div className="detail-section">
        <h3>Medical Information</h3>
        <div className="detail-row">
          <span className="label">Allergies:</span>
          <span>{patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None'}</span>
        </div>
        <div className="detail-row">
          <span className="label">Medical History:</span>
          <span>{patient.medicalHistory.length > 0 ? patient.medicalHistory.join(', ') : 'None'}</span>
        </div>
        <div className="detail-row">
          <span className="label">Current Prescriptions:</span>
          <span>{patient.currentPrescriptions.length > 0 ? patient.currentPrescriptions.join(', ') : 'None'}</span>
        </div>
      </div>

      <div className="detail-section">
        <h3>Doctor Notes</h3>
        <div className="notes">
          {patient.doctorNotes || 'No notes available'}
        </div>
      </div>

      <Link to="/" className="back-button">Back to List</Link>
    </div>
  );
}