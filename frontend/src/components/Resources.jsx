import { useEffect, useState } from "react";
import axios from "axios";
import {
  pageWrapper,
  container,
  sectionPadding,
  displayLg,
  card,
  titleLg,
  bodyText,
  textInput,
  mutedText,
} from "../styles/common";
import { Link } from "react-router";

function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getResources = async () => {
    try {
      const res = await axios.get("http://localhost:5000/resource-api");
      setResources(res.data.payload || []);
      setFilteredResources(res.data.payload || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResources();
  }, []);

  useEffect(() => {
    const filtered = resources.filter((resource) =>
      resource.title?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredResources(filtered);
  }, [search, resources]);

  const handleUpvote = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/resource-api/${id}/upvote`,
        {},
        { withCredentials: true }
      );
      getResources();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownvote = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/resource-api/${id}/downvote`,
        {},
        { withCredentials: true }
      );
      getResources();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/resource-api/download/${id}`,
        { withCredentials: true }
      );
      const link = document.createElement("a");
      link.href = res.data.fileUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      getResources();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={pageWrapper}>
      <section className={sectionPadding}>
        <div className={container}>
          <h1 className={displayLg}>Study Resources</h1>

          <p className={`${bodyText} mt-4`}>
            Browse notes, assignments, question papers and study materials.
          </p>

          <div className="mt-8">
            <input
              type="text"
              placeholder="Search resources..."
              className={textInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="mt-10">Loading resources...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {filteredResources.map((resource) => (
                <div key={resource._id} className={card}>

                  <Link
                    to={`/resources/${resource._id}`}
                    className="block hover:opacity-80"
                  >
                    <h3 className={titleLg}>{resource.title}</h3>
                  </Link>

                  <p className={`${mutedText} mt-2 line-clamp-2`}>
                    {resource.description}
                  </p>

                  <div className="mt-4 space-y-1">
                    <p className={mutedText}>Subject: {resource.subject}</p>
                    <p className={mutedText}>Semester: {resource.semester}</p>
                  </div>

                  {/* Vote + Download row */}
                  <div className="flex items-center gap-5 mt-6">

                    {/* Upvote */}
                    <button
                      onClick={() => handleUpvote(resource._id)}
                      className="flex items-center gap-1.5 text-[#0a0a0a] hover:text-[#262626] transition-colors duration-150"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22" height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" />
                        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                      </svg>
                      <span className="text-[14px] font-bold">
                        {resource.upvotes?.length || 0}
                      </span>
                    </button>

                    {/* Downvote */}
                    <button
                      onClick={() => handleDownvote(resource._id)}
                      className="flex items-center gap-1.5 text-[#0a0a0a] hover:text-[#262626] transition-colors duration-150"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22" height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3z" />
                        <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                      </svg>
                      <span className="text-[14px] font-bold">
                        {resource.downvotes?.length || 0}
                      </span>
                    </button>

                    {/* Download */}
                    <button
                      onClick={() => handleDownload(resource._id)}
                      className="ml-auto text-[13px] font-bold tracking-[1px] uppercase text-[#0a0a0a] hover:text-[#262626] transition-colors duration-150"
                    >
                      Download
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

          {!loading && filteredResources.length === 0 && (
            <div className="mt-16 text-center">
              <p className={bodyText}>No resources found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Resources;
