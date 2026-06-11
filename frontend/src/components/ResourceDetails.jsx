
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
} from "../styles/common";

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
        {
          withCredentials: true,
        }
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
        {
          withCredentials: true,
        }
      );

      getResource();
    } catch (err) {
      console.log(err);
    }
  };

const handleOpenResource = () => {
  if (!resource?.fileUrl) return;

  window.open(resource.fileUrl, "_blank");
};
  if (loading) {
    return (
      <div className={pageWrapper}>
        <div className={container}>
          <p className="py-20">
            Loading resource...
          </p>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className={pageWrapper}>
        <div className={container}>
          <p className="py-20">
            Resource not found.
          </p>
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
                Uploaded By:{" "}
                {resource.uploadedBy?.name}
              </p>

              <p className={mutedText}>
                Uploaded On:{" "}
                {new Date(
                  resource.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className={card}>
                <h3 className={titleLg}>👍</h3>
                <p>
                  {resource.upvotes?.length || 0}
                </p>
              </div>

              <div className={card}>
                <h3 className={titleLg}>👎</h3>
                <p>
                  {resource.downvotes?.length || 0}
                </p>
              </div>

              <div className={card}>
                <h3 className={titleLg}>📥</h3>
                <p>
                  {resource.downloads || 0}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={handleUpvote}
                className={primaryBtn}
              >
                👍 Upvote
              </button>

              <button
                onClick={handleDownvote}
                className="px-6 h-12 border border-[#d6d6d6] rounded-lg"
              >
                👎 Downvote
              </button>

              <button
                onClick={handleOpenResource}
                className="px-6 h-12 border border-[#d6d6d6] rounded-lg"
              >
                📖 Open Resource
              </button>
            </div>

  

          </div>
        </div>
      </section>
    </div>
  );
}

export default ResourceDetails;

