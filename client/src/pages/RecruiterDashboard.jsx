import { useState, useEffect } from "react";
import axios from "axios";

export default function RecruiterDashboard() {
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [appCounts, setAppCounts] = useState({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary: "",
    category: "",
  });

  const token = localStorage.getItem("token");

  // 🔹 Fetch Recruiter Jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  // const fetchJobs = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/api/jobs");
  //     setJobs(res.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const fetchJobs = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/api/jobs/myjobs", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setJobs(res.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/myjobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(res.data);

      // Fetch applicant count for each job
      res.data.forEach(async (job) => {
        const countRes = await axios.get(
          `http://localhost:5000/api/applications/count/${job._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setAppCounts((prev) => ({
          ...prev,
          [job._id]: countRes.data.count,
        }));
      });
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Post Job
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/jobs", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Job posted! Waiting for admin approval.");
      setForm({
        title: "",
        description: "",
        company: "",
        location: "",
        salary: "",
        category: "",
      });
      fetchJobs();
    } catch (err) {
      alert("Error posting job");
    }
  };

  // 🔹 Delete Job
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchJobs();
    } catch (err) {
      console.log(err);
    }
  };

  // const fetchApplicants = async (jobId) => {
  //   try {
  //     const res = await axios.get(
  //       `http://localhost:5000/api/applications/job/${jobId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );
  //     setApplicants(res.data);
  //     setSelectedJob(jobId);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const fetchApplicants = async (jobId) => {
    try {
      setApplicants([]); // clear previous
      setSelectedJob(jobId);

      const res = await axios.get(
        `http://localhost:5000/api/applications/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApplicants(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8">Recruiter Dashboard</h1>

      {/* 🔹 Post Job Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">Post New Job</h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Job Title"
            className="p-3 border rounded"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="text"
            placeholder="Company"
            className="p-3 border rounded"
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />

          <input
            type="text"
            placeholder="Location"
            className="p-3 border rounded"
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />

          <input
            type="text"
            placeholder="Salary"
            className="p-3 border rounded"
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
          />

          <input
            type="text"
            placeholder="Category"
            className="p-3 border rounded"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <textarea
            placeholder="Job Description"
            className="p-3 border rounded md:col-span-2"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <button className="bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition md:col-span-2">
            Post Job
          </button>
        </form>
      </div>

      {/* 🔹 My Jobs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Posted Jobs</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">{job.title}</h3>

                <span
                  className={`px-3 py-1 text-sm rounded-full font-semibold ${
                    job.approved
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {job.approved ? "Approved" : "Pending Approval"}
                </span>
              </div>

              <p className="text-gray-500">{job.company}</p>

              <p className="mt-2 text-sm">
                {job.location} | {job.salary}
              </p>
              <p className="mt-2 text-sm font-semibold text-blue-600">
                Applicants: {appCounts[job._id] || 0}
              </p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleDelete(job._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>

                {/* <button
                  onClick={() => fetchApplicants(job._id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  View Applicants
                </button> */}

                {job.approved ? (
                  <button
                    onClick={() => fetchApplicants(job._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View Applicants
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                  >
                    Awaiting Approval
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        {selectedJob && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Applicants</h2>

            {applicants.length === 0 ? (
              <p>No applicants yet.</p>
            ) : (
              <div className="space-y-6">
                {applicants.map((app) => (
                  <div
                    key={app._id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                  >
                    <h3 className="font-bold">{app.candidate.name}</h3>

                    <p>{app.candidate.email}</p>

                    <p className="mt-2">
                      Status: <strong>{app.status}</strong>
                    </p>

                    {app.candidate.resume && (
                      <a
                        href={`http://localhost:5000/uploads/${app.candidate.resume}`}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        Download Resume
                      </a>
                    )}

                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={async () => {
                          await axios.put(
                            `http://localhost:5000/api/applications/status/${app._id}`,
                            { status: "Selected" },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            },
                          );
                          fetchApplicants(selectedJob);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Select
                      </button>

                      <button
                        onClick={async () => {
                          await axios.put(
                            `http://localhost:5000/api/applications/status/${app._id}`,
                            { status: "Rejected" },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            },
                          );
                          fetchApplicants(selectedJob);
                        }}
                        className="bg-red-600 text-white px-4 py-2 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
