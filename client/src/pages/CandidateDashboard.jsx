import { useState, useEffect } from "react";
import axios from "axios";

export default function CandidateDashboard() {
  const [uploading, setUploading] = useState(false);
  const [stats, setStats] = useState({
    applications: 0,
    saved: 0,
    interviews: 0,
  });
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchStats();
    fetchProfile();
  }, []);

  const fetchStats = async () => {
    try {
      const appsRes = await axios.get(
        "http://localhost:5000/api/applications/my-applications",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const savedRes = await axios.get("http://localhost:5000/api/jobs/saved", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const interviews = appsRes.data.filter(
        (app) => app.status === "Selected",
      ).length;

      setStats({
        applications: appsRes.data.length,
        saved: savedRes.data.length,
        interviews,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleResumeUpload = async (e) => {
    const formData = new FormData();
    formData.append("resume", e.target.files[0]);

    try {
      setUploading(true);
      await axios.post(
        "http://localhost:5000/api/auth/upload-resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setResume(res.data.resume);
      alert("Resume uploaded successfully");
      // fetchProfile();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setResume(res.data.resume);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-10">
      <h1 className="text-3xl font-bold mb-2">Candidate Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Manage your resume and track application progress.
      </p>
      <div className="grid md:grid-cols-4 gap-8 mt-8">
        <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Resume (PDF)</h2>

          {/* <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeUpload}
            className="border p-2 rounded w-full"
          /> */}
          <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
            Upload Resume
            <input
              type="file"
              accept="application/pdf"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </label>

          {uploading && <p className="mt-2 text-blue-600">Uploading...</p>}

          {resume && (
            <a
              href={`http://localhost:5000/uploads/${resume}`}
              target="_blank"
              className="block mt-4 text-blue-600 underline font-semibold"
            >
              View Uploaded Resume
            </a>
          )}
        </div>
        {/* <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold">Applications</h2>
          <p className="text-4xl mt-4">{stats.applications}</p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold">Saved Jobs</h2>
          <p className="text-4xl mt-4">{stats.saved}</p>
        </div>

        <div className="bg-white/20 backdrop-blur-lg p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-semibold">Interviews</h2>
          <p className="text-4xl mt-4">{stats.interviews}</p>
        </div> */}

        {/* Applications */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-xl">
          <h2 className="text-lg font-semibold">Applications</h2>
          <p className="text-4xl font-bold mt-3">{stats.applications}</p>
        </div>

        {/* Saved Jobs */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-xl">
          <h2 className="text-lg font-semibold">Saved Jobs</h2>
          <p className="text-4xl font-bold mt-3">{stats.saved}</p>
        </div>

        {/* Interviews */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-xl">
          <h2 className="text-lg font-semibold">Interviews</h2>
          <p className="text-4xl font-bold mt-3">{stats.interviews}</p>
        </div>
      </div>
    </div>
  );
}
