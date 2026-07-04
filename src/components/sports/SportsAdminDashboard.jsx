// components/Sports/SportsAdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../utility/BaseUrl.js";

export default function SportsAdminDashboard() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);
  const token = localStorage.getItem("token");

  const toggleExpandedRow = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    // Check for authenticated user in localStorage
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (!savedUser || savedUser.role !== "state_admin") {
        // For development/demo purposes, if no user is found,
        // we'll show a simulated login or just redirect.
        // The user mentioned a MongoDB collection, so we assume
        // they have a way to log in and set this in localStorage.
        setError("Unauthorized access. Only State Admins are allowed.");
        setLoading(false);
        // navigate("/login"); // Uncomment when login is implemented
        return;
      }

      // Normalize fullName: if it's an object {first, last}, convert to string
      if (savedUser.fullName && typeof savedUser.fullName === "object") {
        const { first = "", last = "" } = savedUser.fullName;
        savedUser.fullName = `${first} ${last}`.trim();
      }

      setUser(savedUser);
      fetchRegistrations();
    } catch {
      setError("Error loading user data");
      setLoading(false);
    }
  }, [navigate]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${baseUrl}/sports/registrationall`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setRegistrations(result.registrations);
      } else {
        setError(result.message || "Failed to fetch registrations");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Network error. Could not load registration data.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  const exportToCSV = () => {
    if (registrations.length === 0) return;

    // Define CSV headers based on registration fields
    const headers = [
      "Reg ID",
      "School Name",
      "School Code",
      "LGEA",
      "Event Name",
      "Category",
      "Participant Surname",
      "Participant Firstname",
      "ParticipantClass and Arm",
      "Age",
      "Gender",
      "Staff ID",
      "Designation",
      "Created At",
    ];

    // Flatten data for CSV
    const rows = registrations.flatMap((reg) =>
      reg.members.map((member) => [
        member.memberRegId,
        reg.schoolName,
        reg.schoolCode,
        reg.lgea,
        reg.eventName,
        member.category,
        member.surname,
        member.firstname,
        member.className && member.arm ?
          `${member.className} ${member.arm}`
        : "",
        member.age || "",
        member.gender || "",
        member.staffId || "",
        member.designation || "",
        formatDate(reg.submittedAt || reg.createdAt),
      ]),
    );

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `SUBEB_Sports_Registrations_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => navigate("/sports")}
            className="w-full py-3 bg-[#1e3a8a] text-white rounded-xl font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1e3a8a]">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage all sports festival registrations
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchRegistrations}
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition font-medium"
          >
            🔄 Refresh
          </button>
          <button
            onClick={exportToCSV}
            disabled={registrations.length === 0}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-bold transition shadow-lg shadow-green-100 flex items-center gap-2"
          >
            📥 Export to CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="px-4 py-4 sm:px-6 sm:py-5 font-bold">
                  Registration ID
                </th>
                <th className="px-4 py-4 sm:px-6 sm:py-5 font-bold">
                  School / LGEA
                </th>
                <th className="px-4 py-4 sm:px-6 sm:py-5 font-bold">
                  Event / Category
                </th>
                <th className="px-4 py-4 sm:px-6 sm:py-5 font-bold">Members</th>
                <th className="px-4 py-4 sm:px-6 sm:py-5 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registrations.length === 0 ?
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-16 sm:px-6 text-center text-gray-500 italic"
                  >
                    No registrations found in the database.
                  </td>
                </tr>
              : registrations.map((reg) => {
                  const isExpanded = expandedRows.includes(reg._id);
                  const participantCount = reg.members.filter(
                    (m) => m.category === "participants",
                  ).length;
                  const technicalCount = reg.members.filter(
                    (m) => m.category === "technical",
                  ).length;

                  return (
                    <React.Fragment key={reg._id}>
                      <tr className="hover:bg-blue-50/30 transition">
                        <td className="px-4 py-4 sm:px-6 sm:py-5">
                          <span className="font-mono font-bold text-[#1e3a8a]">
                            {reg.regId}
                          </span>
                        </td>
                        <td className="px-4 py-4 sm:px-6 sm:py-5">
                          <button
                            type="button"
                            onClick={() => toggleExpandedRow(reg._id)}
                            className="w-full text-left"
                          >
                            <div className="font-bold text-gray-800">
                              {reg.schoolName}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-tighter">
                              {reg.lgea} • CODE: {reg.schoolCode}
                            </div>
                          </button>
                        </td>
                        <td className="px-4 py-4 sm:px-6 sm:py-5">
                          <button
                            type="button"
                            onClick={() => toggleExpandedRow(reg._id)}
                            className="w-full text-left"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <div className="font-semibold text-gray-700">
                                  {reg.eventName}
                                </div>
                                <div className="text-xs text-blue-600 font-bold uppercase">
                                  Participants: {participantCount} • Technical:{" "}
                                  {technicalCount}
                                </div>
                              </div>
                              <span className="text-sm text-gray-400">
                                {isExpanded ? "▲" : "▼"}
                              </span>
                            </div>
                          </button>
                        </td>
                        <td className="px-4 py-4 sm:px-6 sm:py-5">
                          <div className="flex -space-x-2">
                            {reg.members.slice(0, 3).map((m, i) => (
                              <div
                                key={i}
                                className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#1e3a8a]"
                              >
                                {m.surname?.[0] || ""}
                                {m.firstname?.[0] || ""}
                              </div>
                            ))}
                            {reg.members.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                                +{reg.members.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {reg.members.length} members
                          </div>
                        </td>
                        <td className="px-4 py-4 sm:px-6 sm:py-5 text-sm text-gray-500">
                          {formatDate(reg.submittedAt || reg.createdAt)}
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-gray-50">
                          <td colSpan="5" className="px-4 py-4 sm:px-6 sm:py-5">
                            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
                              <div className="flex items-center justify-between mb-4 gap-4">
                                <div>
                                  <div className="text-sm text-gray-500 uppercase tracking-wider">
                                    Expanded members for
                                  </div>
                                  <div className="text-lg font-semibold text-gray-900">
                                    {reg.schoolName} — {reg.eventName}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  Click the school or event name to collapse
                                </div>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm border-collapse">
                                  <thead>
                                    <tr className="bg-gray-100 text-gray-600 uppercase tracking-wide">
                                      <th className="px-4 py-3">Name</th>
                                      <th className="px-4 py-3">Reg ID</th>
                                      <th className="px-4 py-3">Category</th>
                                      <th className="px-4 py-3">
                                        Age / Gender
                                      </th>
                                      <th className="px-4 py-3">
                                        Role / Details
                                      </th>
                                      <th className="px-4 py-3">Health</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {reg.members.map((member) => {
                                      const fullName =
                                        `${member.surname || ""} ${member.firstname || ""}${member.othernames ? ` ${member.othernames}` : ""}`.trim();
                                      const roleDetails =
                                        member.category === "technical" ?
                                          `Staff ID: ${member.staffId || "-"}${member.designation ? ` · ${member.designation}` : ""}${member.sportingArea ? ` · ${member.sportingArea}` : ""}`
                                        : `Class and Arm: ${member.className} ${member.arm || "-"}${member.classTeacher ? ` · Teacher: ${member.classTeacher}` : ""}${member.headTeacher ? ` · Head: ${member.headTeacher}` : ""}`;

                                      return (
                                        <tr
                                          key={member._id}
                                          className="hover:bg-blue-50/70 transition"
                                        >
                                          <td className="px-4 py-3 text-gray-800 font-medium">
                                            {fullName || "Unnamed Member"}
                                          </td>
                                          <td className="px-4 py-3 text-gray-600">
                                            {member.memberRegId || "-"}
                                          </td>
                                          <td className="px-4 py-3 text-gray-600 capitalize">
                                            {member.category || "-"}
                                          </td>
                                          <td className="px-4 py-3 text-gray-600">
                                            {member.age ?
                                              `${member.age} yrs`
                                            : "-"}{" "}
                                            {member.gender ?
                                              ` / ${member.gender}`
                                            : ""}
                                          </td>
                                          <td className="px-4 py-3 text-gray-600">
                                            {roleDetails}
                                          </td>
                                          <td className="px-4 py-3 text-gray-600">
                                            {member.healthConcern || "None"}
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
