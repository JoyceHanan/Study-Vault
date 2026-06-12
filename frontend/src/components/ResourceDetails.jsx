
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

import {
  pageWrapper,
  container,
  sectionPadding,
  card,
  displayLg,
  titleLg,
  bodyText,
  mutedText,
  primaryBtn,
  secondaryBtn,
} from "../styles/common";
import { useAuthStore } from "../store/authStore";
// Returns a URL that opens the file in-browser
const getViewerUrl = (fileUrl, fileType) => {
  if (!fileUrl) return null;

  const isPdf =
    fileType?.includes("pdf") ||
    fileUrl.toLowerCase().includes(".pdf");

  const isOffice =
    fileType?.includes("presentation") || // pptx
    fileType?.includes("wordprocessing") || // docx
    fileType?.includes("ms-powerpoint") ||
    fileType?.includes("msword") ||
    fileUrl.toLowerCase().match(/\.(pptx?|docx?|xlsx?)($|\?)/);

  if (isPdf) {
    // PDF — open directly, browser renders it
    return fileUrl;
  }

  if (isOffice) {
    // Office files — route through Google Docs Viewer
    return `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  }

  // Images, text, etc — open directly
  return fileUrl;
};

function ResourceDetails() {
  const currentUser = useAuthStore(
  (state) => state.currentUser
);
  const { id } = useParams();

  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);

  const getResource = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/resource-api/${id}`
      );
      setResource(res.data.payload);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getResource();
  }, [id]);

  const handleUpvote = async () => {
    try {
      await axios.post(
        `http://localhost:5000/resource-api/${id}/upvote`,
        {},
        { withCredentials: true }
      );
      getResource();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDownvote = async () => {
    try {
      await axios.post(
        `http://localhost:5000/resource-api/${id}/downvote`,
        {},
        { withCredentials: true }
      );
      getResource();
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenResource = () => {
    if (!resource?.fileUrl) return;
    const viewerUrl = getViewerUrl(resource.fileUrl, resource.fileType);
    window.open(viewerUrl, "_blank");
  };

  const navigate = useNavigate();

const handleDelete = async () => {
  if (
    !window.confirm(
      "Delete this resource?"
    )
  )
    return;

  try {
    await axios.delete(
      `http://localhost:5000/resource-api/${id}`,
      {
        withCredentials: true,
      }
    );

    navigate("/resources");

  } catch (err) {
    console.log(err);
  }
};
  const handleDownload = () => {
    if (!resource?.fileUrl) return;
    // Force download by creating a temp anchor
    const a = document.createElement("a");
    a.href = resource.fileUrl;
    a.download = resource.title || "resource";
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className={pageWrapper}>
        <div className={container}>
          <p className="py-20">Loading resource...</p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className={pageWrapper}>
        <div className={container}>
          <p className="py-20">Resource not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={pageWrapper}>
      <section className={sectionPadding}>
        <div className={container}>
          <div className={`${card} max-w-5xl mx-auto`}>

            <h1 className={displayLg}>
              {resource.title}
            </h1>

            <div className="mt-6 space-y-3">
              <p className={bodyText}>
                {resource.description}
              </p>

              <p className={mutedText}>
                Subject: {resource.subject}
              </p>

              <p className={mutedText}>
                Unit: {resource.unit || "N/A"}
              </p>

              <p className={mutedText}>
                Topic: {resource.topic || "N/A"}
              </p>

              <p className={mutedText}>
                Semester: {resource.semester || "N/A"}
              </p>

              <p className={mutedText}>
                Uploaded By: {resource.uploadedBy?.name}
              </p>

              <p className={mutedText}>
                Uploaded On:{" "}
                {new Date(resource.createdAt).toLocaleDateString()}
              </p>
            </div>



            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-8">

              {/* Upvote */}
              <button
                onClick={handleUpvote}
                className="flex items-center gap-2 px-2 h-10 transition-colors duration-150"
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
                <span className="text-[14px] font-bold tracking-[0.5px]">
                  {resource.upvotes?.length || 0}
                </span>
              </button>

              {/* Downvote */}
              <button
                onClick={handleDownvote}
                className="flex items-center gap-2 px-2 h-10 transition-colors duration-150"
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
                <span className="text-[14px] font-bold tracking-[0.5px]">
                  {resource.downvotes?.length || 0}
                </span>
              </button>

              <button
                onClick={handleOpenResource}
                className={primaryBtn}
              >
                Open Resource
              </button>

              <button
                onClick={handleDownload}
                className={secondaryBtn}
              >
                Download
              </button>
              <button
  onClick={handleDelete}
  title="Delete Resource"
  className="flex items-center justify-center w-12 h-12 rounded-md transition-all duration-150 hover:border-red-500 hover:text-red-500"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
</button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default ResourceDetails;
