import axios from "axios";

export default function JobCard({ job }) {
  const token = localStorage.getItem("token");

  const handleApply = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/applications/${job._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Application submitted!");
    } catch (err) {
      // alert("Error applying for job");
      alert(err.response?.data?.msg || "Error applying");
    }
  };

  const handleSave = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/jobs/save/${job._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      alert("Job saved!");
    } catch (err) {
      alert("Error saving job");
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition">
      <h2 className="text-xl font-bold mb-2">{job.title}</h2>
      <p className="text-gray-500">{job.company}</p>
      <p className="mt-2">{job.location}</p>
      <p className="mt-2 font-semibold text-blue-600">{job.salary}</p>
      <div className="flex gap-3">
        <button
          onClick={handleApply}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
        >
          Apply
        </button>
        <button
          onClick={handleSave}
          className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
        >
          Save Job
        </button>
      </div>
    </div>
  );
}
