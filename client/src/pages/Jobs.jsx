import { useEffect, useState } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then(res => setJobs(res.data));
  }, []);

  const filtered = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <input
        type="text"
        placeholder="Search jobs..."
        className="border p-2 rounded mb-6 w-full"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map(job => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
}