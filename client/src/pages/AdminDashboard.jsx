// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function AdminDashboard() {

//   const [stats, setStats] = useState({
//     users: 0,
//     jobs: 0,
//     applications: 0
//   });

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/admin/stats", {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`
//       }
//     })
//     .then(res => setStats(res.data))
//     .catch(err => console.log(err));
//   }, []);

//   return (
//     <div className="min-h-screen p-10 bg-gray-100 dark:bg-gray-900">

//       <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

//       <div className="grid md:grid-cols-3 gap-6">

//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
//           <h2 className="text-xl font-semibold">Total Users</h2>
//           <p className="text-4xl mt-4 text-blue-600">{stats.users}</p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
//           <h2 className="text-xl font-semibold">Total Jobs</h2>
//           <p className="text-4xl mt-4 text-green-600">{stats.jobs}</p>
//         </div>

//         <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
//           <h2 className="text-xl font-semibold">Total Applications</h2>
//           <p className="text-4xl mt-4 text-purple-600">{stats.applications}</p>
//         </div>

//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
  });

  const [pendingJobs, setPendingJobs] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchPendingJobs();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPendingJobs = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/pending-jobs",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setPendingJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchPendingJobs();
      fetchStats();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* 🔹 Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-4xl mt-4 text-blue-600">{stats.users}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold">Jobs</h2>
          <p className="text-4xl mt-4 text-green-600">{stats.jobs}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold">Applications</h2>
          <p className="text-4xl mt-4 text-purple-600">{stats.applications}</p>
        </div>
      </div>

      {/* 🔹 Pending Jobs Section */}
      <h2 className="text-2xl font-bold mb-6">Pending Job Approvals</h2>

      {pendingJobs.length === 0 ? (
        <p>No pending jobs.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {pendingJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-lg font-bold">{job.title}</h3>

              <p className="text-gray-500">{job.company}</p>

              <p className="mt-2 text-sm">
                {job.location} | {job.salary}
              </p>

              <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleApprove(job._id)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition gap-3"
              >
                Approve Job
              </button>
              <button
                onClick={async () => {
                  await axios.delete(
                    `http://localhost:5000/api/admin/reject/${job._id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    },
                  );
                  fetchPendingJobs();
                }}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Reject Job
              </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
