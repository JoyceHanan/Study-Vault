import { useState } from "react";
import {useNavigate} from "react-router"
import axios from "axios";
import { toast } from "react-hot-toast";

import {
  pageWrapper,
  container,
  sectionPadding,
  displayLg,
  card,
  textInput,
  bodyText,
  primaryBtn,
  errorText,
} from "../styles/common";

function UploadResource() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [resourceData, setResourceData] = useState({
    title: "",
    description: "",
    subject: "",
    unit: "",
    topic: "",
    semester: "",
    tags: "",
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setResourceData({
      ...resourceData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", resourceData.title);
      formData.append(
        "description",
        resourceData.description
      );
      formData.append(
        "subject",
        resourceData.subject
      );
      formData.append("unit", resourceData.unit);
      formData.append("topic", resourceData.topic);
      formData.append(
        "semester",
        resourceData.semester
      );

      formData.append(
        "tags",
        resourceData.tags
      );

      formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/resource-api/upload",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        res.data.message || "Resource uploaded"
      );
    setTimeout(() => {
      navigate("/resources");
    }, 1000);
      setResourceData({
        title: "",
        description: "",
        subject: "",
        unit: "",
        topic: "",
        semester: "",
        tags: "",
      });

      setFile(null);
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
          "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={pageWrapper}>
      <section className={sectionPadding}>
        <div className={container}>
          <div className="max-w-3xl mx-auto">
            <h1 className={displayLg}>
              Upload Resource
            </h1>

            <p className={`${bodyText} mt-4`}>
              Share notes, assignments,
              question papers and study
              material with other students.
            </p>

            <form
              onSubmit={handleSubmit}
              className={`${card} mt-10 space-y-6`}
            >
              {/* Title */}

              <div>
                <label className="block mb-2 font-bold">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={resourceData.title}
                  onChange={handleChange}
                  className={textInput}
                  required
                />
              </div>

              {/* Description */}

              <div>
                <label className="block mb-2 font-bold">
                  Description
                </label>

                <textarea
                  rows="4"
                  name="description"
                  value={resourceData.description}
                  onChange={handleChange}
                  className={`${textInput} h-auto py-3`}
                />
              </div>

              {/* Subject */}

              <div>
                <label className="block mb-2 font-bold">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={resourceData.subject}
                  onChange={handleChange}
                  className={textInput}
                  required
                />
              </div>

              {/* Unit */}

              <div>
                <label className="block mb-2 font-bold">
                  Unit
                </label>

                <input
                  type="text"
                  name="unit"
                  value={resourceData.unit}
                  onChange={handleChange}
                  className={textInput}
                />
              </div>

              {/* Topic */}

              <div>
                <label className="block mb-2 font-bold">
                  Topic
                </label>

                <input
                  type="text"
                  name="topic"
                  value={resourceData.topic}
                  onChange={handleChange}
                  className={textInput}
                />
              </div>

              {/* Semester */}

              <div>
                <label className="block mb-2 font-bold">
                  Semester
                </label>

                <select
                  name="semester"
                  value={resourceData.semester}
                  onChange={handleChange}
                  className={textInput}
                >
                  <option value="">
                    Select Semester
                  </option>

                  {[1,2,3,4,5,6,7,8].map((sem) => (
                    <option
                      key={sem}
                      value={sem}
                    >
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}

              <div>
                <label className="block mb-2 font-bold">
                  Tags
                </label>

                <input
                  type="text"
                  name="tags"
                  value={resourceData.tags}
                  onChange={handleChange}
                  className={textInput}
                  placeholder="DSA, Notes, Unit-3"
                />
              </div>

              {/* File */}

              <div>
                <label className="block mb-2 font-bold">
                  Upload File
                </label>

                <input
                  type="file"
                  onChange={(e) =>
                    setFile(
                      e.target.files[0]
                    )
                  }
                />

                {file && (
                  <p className="mt-2 text-sm">
                    {file.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={primaryBtn}
              >
                {loading
                  ? "Uploading..."
                  : "Upload Resource"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UploadResource;