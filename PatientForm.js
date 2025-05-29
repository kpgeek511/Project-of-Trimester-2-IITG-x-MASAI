import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './PatientForm.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const initialState = {
  patientId: '',
  name: '',
  age: '',
  gender: '',
  contactInfo: '',
  allergies: [],
  medicalHistory: [],
  currentPrescriptions: [],
  doctorNotes: ''
};

export default function PatientForm({ editMode = false }) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (editMode && id) {
      const fetchPatient = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${API_URL}/api/patients/${id}`);
          setForm(res.data);
        } catch (err) {
          setError(err.response?.data?.error || err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPatient();
    }
  }, [editMode, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleArrayChange = (field, value) => {
    setForm({
      ...form,
      [field]: value.split(',').map(item => item.trim())
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editMode) {
        await axios.put(`${API_URL}/api/patients/${id}`, form);
      } else {
        await axios.post(`${API_URL}/api/patients`, form);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="form-container">
      <h2>{editMode ? 'Edit Patient' : 'Add New Patient'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient ID (PAT-XXXX)</label>
          <input
            name="patientId"
            value={form.patientId}
            onChange={handleChange}
            pattern="PAT-\d{4}"
            required
            disabled={editMode}
          />
        </div>

        <div className="form-group">
          <label>Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age</label>
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              min="0"
              max="120"
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Contact Information</label>
          <input
            name="contactInfo"
            value={form.contactInfo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Allergies (comma separated)</label>
          <input
            value={form.allergies.join(', ')}
            onChange={(e) => handleArrayChange('allergies', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Medical History (comma separated)</label>
          <input
            value={form.medicalHistory.join(', ')}
            onChange={(e) => handleArrayChange('medicalHistory', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Current Prescriptions (comma separated)</label>
          <input
            value={form.currentPrescriptions.join(', ')}
            onChange={(e) => handleArrayChange('currentPrescriptions', e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Doctor Notes</label>
          <textarea
            name="doctorNotes"
            value={form.doctorNotes}
            onChange={handleChange}
            rows="4"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : (editMode ? 'Update' : 'Add')} Patient
        </button>
      </form>
    </div>
  );
}