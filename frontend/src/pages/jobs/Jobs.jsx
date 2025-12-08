import React, { useState, useEffect } from 'react';
import { getJobs } from '../../api/jobsApi';
import Spinner from '../../components/ui/Spinner';
import './Jobs.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="jobs-container">
      <h1>Jobs</h1>
      <table className="jobs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>State</th>
            <th>Created On</th>
            <th>Completed On</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.name}</td>
              <td>{job.state}</td>
              <td>{new Date(job.createdon).toLocaleString()}</td>
              <td>{job.completedon ? new Date(job.completedon).toLocaleString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Jobs;
