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
  primaryBtn,
  textInput,
  mutedText,
} from "../styles/common";

function Resources() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getResources = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/resource-api"
      );

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
      resource.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
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
      {
        withCredentials: true,
      }
    );

    const link = document.createElement("a");
    link.href = res.data.fileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    getResources(); // refresh download count
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className={pageWrapper}>
      <section className={sectionPadding}>
        <div className={container}>
          <h1 className={displayLg}>
            Study Resources
          </h1>

          <p className={`${bodyText} mt-4`}>
            Browse notes, assignments, question papers
            and study materials.
          </p>

          <div className="mt-8">
            <input
              type="text"
              placeholder="Search resources..."
              className={textInput}
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          {loading ? (
            <p className="mt-10">
              Loading resources...
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {filteredResources.map((resource) => (
                <div
                  key={resource._id}
                  className={card}
                >
                  <h3 className={titleLg}>
                    {resource.title}
                  </h3>

                  <p className={`${bodyText} mt-3`}>
                    {resource.description}
                  </p>

                  <div className="mt-4 space-y-2">
                    <p className={mutedText}>
                      Subject: {resource.subject}
                    </p>

                    <p className={mutedText}>
                      Semester: {resource.semester}
                    </p>

                    <p className={mutedText}>
                      Downloads: {resource.downloads}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      onClick={() =>
                        handleUpvote(resource._id)
                      }
                      className={primaryBtn}
                    >
                      👍 {resource.upvotes?.length || 0}
                    </button>

                    <button
                      onClick={() =>
                        handleDownvote(resource._id)
                      }
                      className="px-6 h-12 border border-[#cccccc]"
                    >
                      👎{" "}
                      {resource.downvotes?.length || 0}
                    </button>

                    <button
                      onClick={() =>
                        handleDownload(resource._id)
                      }
                      className="px-6 h-12 border border-[#cccccc]"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading &&
            filteredResources.length === 0 && (
              <div className="mt-16 text-center">
                <p className={bodyText}>
                  No resources found.
                </p>
              </div>
            )}
        </div>
      </section>
    </div>
  );
}

export default Resources;