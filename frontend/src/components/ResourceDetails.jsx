
import { useEffect, useState } from "react";
import { useParams } from "react-router";
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className={card}>
                <h3 className={titleLg}>👍</h3>
                <p>{resource.upvotes?.length || 0}</p>
              </div>

              <div className={card}>
                <h3 className={titleLg}>👎</h3>
                <p>{resource.downvotes?.length || 0}</p>
              </div>

              <div className={card}>
                <h3 className={titleLg}>📥</h3>
                <p>{resource.downloads || 0}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={handleUpvote}
                className={primaryBtn}
              >
                👍 Upvote
              </button>

              <button
                onClick={handleDownvote}
                className="px-6 h-12 border border-[#d6d6d6]"
              >
                👎 Downvote
              </button>

              <button
                onClick={handleOpenResource}
                className="px-6 h-12 border border-[#d6d6d6]"
              >
                📖 Open Resource
              </button>

              <button
                onClick={handleDownload}
                className={secondaryBtn}
              >
                📥 Download
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default ResourceDetails;
