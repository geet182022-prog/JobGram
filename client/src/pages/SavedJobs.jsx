import { useEffect, useState } from "react";
import axios from "axios";

export default function SavedJobs() {

  const [jobs, setJobs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/jobs/saved",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setJobs(res.data);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8">
        Saved Jobs
      </h1>

      {jobs.length === 0 ? (
        <p>No saved jobs.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map(job => (
            <div
              key={job._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="font-bold">{job.title}</h3>
              <p>{job.company}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}