// components/Sports/RegistrationLookup.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../../utility/BaseUrl";

export default function RegistrationLookup() {
  const navigate = useNavigate();

  const [regId, setRegId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!regId.trim()) {
      setError("Please enter either Registration ID");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = `${baseUrl}/sports/registration/${regId.trim()}`;

      const response = await fetch(apiUrl);

      const result = await response.json();

      if (result.success) {
        navigate("/sports/registration/summary", {
          state: result.registration,
        });
      } else {
        setError(result.message || "Participant not found");
      }
    } catch (err) {
      setError(
        `Failed to fetch participant: ${err.message || "Please check your input."}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-6">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full mb-6 border border-white/30">
            <span className="text-green-400 text-xl">●</span>
            <span className="uppercase tracking-widest text-sm font-semibold text-[#1e3a8a]">
              Benue SUBEB Sports Event
            </span>
          </div>
          <h1 className="text-4xl font-bold text-[#1e3a8a] mb-3">
            Check Registration
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your Membership Registration ID to view details
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Registration ID Field */}
            <div>
              <label className="block font-medium mb-2 text-gray-700">
                Participants ID ( Member Registration ID)
              </label>
              <input
                type="text"
                value={regId}
                onChange={(e) => setRegId(e.target.value.toUpperCase())}
                placeholder="e.g. MEM-XXXX"
                className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Preferred method</p>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-2xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !regId.trim()}
              className="w-full bg-[#1e3a8a] hover:bg-blue-900 disabled:bg-gray-400 text-white py-5 rounded-3xl text-xl font-semibold transition-all mt-4"
            >
              {loading ? "Searching..." : "View Registration Details"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8">
            Contact your LGEA or SUBEB office if you can't find your
            registration
          </p>
        </div>
      </div>
    </div>
  );
}
