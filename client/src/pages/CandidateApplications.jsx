import { useEffect, useState } from "react";
import axios from "axios";

export default function CandidateApplications() {

  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/applications/my-applications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setApplications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100 dark:bg-gray-900">

      <h1 className="text-3xl font-bold mb-8">
        My Applications
      </h1>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-lg font-bold">
                {app.job.title}
              </h3>

              <p className="text-gray-500">
                {app.job.company}
              </p>

              <p className="mt-2">
                Status: 
                <span
                  className={`ml-2 font-semibold ${
                    app.status === "Selected"
                      ? "text-green-600"
                      : app.status === "Rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {app.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}