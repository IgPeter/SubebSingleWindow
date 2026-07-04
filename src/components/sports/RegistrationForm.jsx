// components/Sports/RegistrationForm.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sportsEvents } from "../../../data/sportsEvents";
import { baseUrl } from "../../utility/BaseUrl.js";
import { Input } from "postcss";

export default function RegistrationForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = sportsEvents.find((e) => e.id === parseInt(id));

  const [activeTab, setActiveTab] = useState("participants");

  // Common fields
  const [schoolName, setSchoolName] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [lgea, setLgea] = useState("");
  const [educationSecretary, setEducationSecretary] = useState("");

  // Members
  const [participants, setParticipants] = useState([]);
  const [technicalTeam, setTechnicalTeam] = useState([]);

  const [passportFiles, setPassportFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!event) {
    return (
      <div className="text-center py-20 text-red-600 text-xl">
        Event not found
      </div>
    );
  }

  const isParticipantsTab = activeTab === "participants";
  const currentMembers = isParticipantsTab ? participants : technicalTeam;
  const setCurrentMembers =
    isParticipantsTab ? setParticipants : setTechnicalTeam;

  const maxMembers =
    isParticipantsTab ? event.maxParticipants : event.maxTechnical || 0;

  const addMember = () => {
    if (currentMembers.length >= maxMembers) return;

    const newMember =
      isParticipantsTab ?
        {
          surname: "",
          firstname: "",
          othernames: "",
          age: "",
          gender: "",
          className: "",
          arm: "",
          classTeacher: "",
          headTeacher: "",
          healthConcern: "",
        }
      : {
          surname: "",
          firstname: "",
          othernames: "",
          staffId: "",
          designation: "",
          sportingArea: "",
        };

    setCurrentMembers([...currentMembers, newMember]);
  };

  const removeMember = (index) => {
    const updated = [...currentMembers];
    updated.splice(index, 1);
    setCurrentMembers(updated);
  };

  const updateMember = (index, field, value) => {
    if (field === "gender") {
      console.log(`Updating gender for member ${index}:`, value);
    }
    const updated = [...currentMembers];
    updated[index][field] = value;
    setCurrentMembers(updated);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPassportFiles((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentMembers.length === 0) {
      alert(
        `Please add at least one ${isParticipantsTab ? "learner" : "technical team member"}`,
      );
      return;
    }

    // Validate that all participants have gender selected
    if (isParticipantsTab) {
      const missingGender = currentMembers.some((member) => !member.gender);
      if (missingGender) {
        alert("Please select gender for all participants");
        return;
      }
    }

    if (!schoolCode.trim()) {
      alert("School Code is required");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    // Common fields
    formData.append("eventId", event.id);
    formData.append("category", activeTab);
    formData.append("schoolName", schoolName);
    formData.append("schoolCode", schoolCode || "");
    formData.append("lgea", lgea);
    formData.append("educationSecretary", educationSecretary || "");

    // Members
    console.log("Current members being sent:", currentMembers);
    formData.append("members", JSON.stringify(currentMembers));

    // Passport photos
    passportFiles.forEach((file) => {
      formData.append("passportPhotos", file);
    });

    try {
      const response = await fetch(`${baseUrl}/sports/register`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        navigate("summary", {
          state: {
            ...result.registration,
            eventName: event.name,
          },
        });
      } else {
        alert(result.message || "Failed to submit registration");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
      <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-10">
        <h1 className="text-4xl font-bold text-[#1e3a8a] mb-2">{event.name}</h1>
        <p className="text-green-600 font-semibold mb-10">
          Maximum {isParticipantsTab ? "Participants" : "Technical Team"}:{" "}
          {maxMembers}
        </p>

        {/* Tabs */}
        <div className="flex border-b mb-10">
          <button
            onClick={() => setActiveTab("participants")}
            className={`flex-1 py-5 font-semibold text-lg transition-all ${
              isParticipantsTab ?
                "border-b-4 border-[#1e3a8a] text-[#1e3a8a]"
              : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Participants (Learners)
          </button>
          {event.maxTechnical > 0 && (
            <button
              onClick={() => setActiveTab("technical")}
              className={`flex-1 py-5 font-semibold text-lg transition-all ${
                !isParticipantsTab ?
                  "border-b-4 border-[#1e3a8a] text-[#1e3a8a]"
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Technical Team
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* School Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">
                Name of School <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full border rounded-2xl px-5 py-4"
                placeholder="Enter name of school"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-2">School Code</label>
              <input
                type="text"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value)}
                className="w-full border rounded-2xl px-5 py-4"
                placeholder="Enter school code"
                required
              />
            </div>
            {isParticipantsTab && (
              <div>
                <label className="block font-medium mb-2">
                  Education Secretary
                </label>
                <input
                  type="text"
                  value={educationSecretary}
                  onChange={(e) => setEducationSecretary(e.target.value)}
                  className="w-full border rounded-2xl px-5 py-4"
                  placeholder="Enter education secretary name"
                />
              </div>
            )}

            <div className="grid md:grid-cols-1 gap-6">
              <div>
                <label className="block font-medium mb-2">
                  LGEA <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lgea}
                  onChange={(e) => setLgea(e.target.value)}
                  className="w-full border rounded-2xl px-8 py-4"
                  placeholder="Local Government"
                  required
                />
              </div>
            </div>
          </div>

          {/* Members Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-xl">
                {isParticipantsTab ?
                  "Learners / Participants"
                : "Technical Team Members"}
                <span className="ml-3 text-gray-500">
                  ({currentMembers.length} / {maxMembers})
                </span>
              </h3>
              <button
                type="button"
                onClick={addMember}
                disabled={currentMembers.length >= maxMembers}
                className="bg-green-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-2xl text-sm font-medium"
              >
                + Add {isParticipantsTab ? "Learner" : "Member"}
              </button>
            </div>

            {currentMembers.length === 0 && (
              <p className="text-gray-500 italic text-center py-8 border border-dashed rounded-2xl">
                Click "+ Add {isParticipantsTab ? "Learner" : "Member"}" to
                begin
              </p>
            )}

            {currentMembers.map((member, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-6 mb-6 bg-gray-50"
              >
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Surname <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={member.surname}
                      onChange={(e) =>
                        updateMember(index, "surname", e.target.value)
                      }
                      className="w-full border rounded-xl px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={member.firstname}
                      onChange={(e) =>
                        updateMember(index, "firstname", e.target.value)
                      }
                      className="w-full border rounded-xl px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Other Names
                    </label>
                    <input
                      type="text"
                      value={member.othernames}
                      onChange={(e) =>
                        updateMember(index, "othernames", e.target.value)
                      }
                      className="w-full border rounded-xl px-4 py-3"
                    />
                  </div>
                </div>

                {/* Participants Fields */}
                {isParticipantsTab && (
                  <div className="grid md:grid-cols-2 gap-4 mt-5">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Age <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={member.age}
                        onChange={(e) =>
                          updateMember(index, "age", e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Gender
                      </label>
                      <select
                        value={member.gender}
                        onChange={(e) =>
                          updateMember(index, "gender", e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-medium mb-2">
                        Class <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.className}
                        onChange={(e) =>
                          updateMember(index, "className", e.target.value)
                        }
                        className="w-full border rounded-2xl px-5 py-4"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">Arm</label>
                      <input
                        type="text"
                        value={member.arm}
                        onChange={(e) =>
                          updateMember(index, "arm", e.target.value)
                        }
                        className="w-full border rounded-2xl px-5 py-4"
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">
                        Class Teacher <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.classTeacher}
                        onChange={(e) =>
                          updateMember(index, "classTeacher", e.target.value)
                        }
                        className="w-full border rounded-2xl px-5 py-4"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">
                        Head Teacher <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.headTeacher}
                        onChange={(e) =>
                          updateMember(index, "headTeacher", e.target.value)
                        }
                        className="w-full border rounded-2xl px-5 py-4"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-2">
                        Any Health Concern?
                      </label>
                      <textarea
                        value={member.healthConcern}
                        onChange={(e) =>
                          updateMember(index, "healthConcern", e.target.value)
                        }
                        className="w-full border rounded-2xl px-5 py-4 h-24"
                        placeholder="e.g. Asthma, Allergy, etc."
                      />
                    </div>
                  </div>
                )}

                {/* Technical Team Fields */}
                {!isParticipantsTab && (
                  <div className="grid md:grid-cols-3 gap-4 mt-5">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Staff ID
                      </label>
                      <input
                        type="text"
                        value={member.staffId || ""}
                        onChange={(e) =>
                          updateMember(index, "staffId", e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Current Designation{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={member.designation || ""}
                        onChange={(e) =>
                          updateMember(index, "designation", e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Sporting Area
                      </label>
                      <input
                        type="text"
                        value={member.sportingArea || ""}
                        onChange={(e) =>
                          updateMember(index, "sportingArea", e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3"
                      />
                    </div>
                  </div>
                )}

                {/* Passport Upload */}
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">
                    Upload Passport Photograph
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="mt-4 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove {isParticipantsTab ? "Learner" : "Member"}
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || currentMembers.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-6 rounded-3xl text-2xl font-semibold transition-all"
          >
            {loading ?
              "Submitting to SUBEB..."
            : `Submit ${isParticipantsTab ? "Participants" : "Technical Team"} Registration`
            }
          </button>
        </form>
      </div>
    </div>
  );
}
