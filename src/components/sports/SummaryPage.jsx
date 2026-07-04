// components/Sports/SummaryPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

export default function SummaryPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Received state in SummaryPage:", state);

    if (!state) {
      setError("No registration data received");
      setLoading(false);
      return;
    }

    let currentMember = null;

    // Case 1: Backend returned a single member directly
    if (state.member) {
      currentMember = {
        ...state.member,
        schoolName: state.schoolName || state.registration?.schoolName,
        schoolCode: state.schoolCode || state.registration?.schoolCode,
        eventName: state.eventName || state.registration?.eventName,
        regId:
          state.member[state.member.length - 1]?.memberRegId ||
          state.registration?.regId,
      };
    }
    // Case 2: Full registration object with members array (your current backend response)
    else if (
      state.registration &&
      state.registration.members &&
      state.registration.members.length > 0
    ) {
      // Take the last member (most recently added)
      const lastMember =
        state.registration.members[state.registration.members.length - 1];

      currentMember = {
        ...lastMember,
        schoolName: state.registration.schoolName,
        schoolCode: state.registration.schoolCode,
        eventName: state.registration.eventName,
        regId: state.members.memberRegId,
      };
    }
    // Case 3: Direct members array (fallback)
    else if (state.members && state.members.length > 0) {
      const lastMember = state.members[state.members.length - 1];
      currentMember = {
        ...lastMember,
        schoolName: state.schoolName,
        schoolCode: state.schoolCode,
        eventName: state.eventName,
        regId: state.members.memberRegId,
      };
    }

    if (currentMember) {
      setMember(currentMember);
    } else {
      setError("No member data found in the registration");
    }

    setLoading(false);
  }, [state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your registration details...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-6">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Unable to Load
          </h2>
          <p className="text-gray-600 mb-8">
            {error || "No member data available"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-[#1e3a8a] text-white rounded-2xl hover:bg-blue-900 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Full name
  const fullName =
    `${member.surname} ${member.firstname} ${member.othernames || ""}`.trim();

  // QR Code Data
  const qrData = {
    memberRegId: member.memberRegId,
    fullName: fullName,
    schoolName: member.schoolName,
    schoolCode: member.schoolCode,
    eventName: member.eventName,
    category: member.category,
  };

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 print:shadow-none print:p-0">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1e3a8a] mb-1">
            Registration Summary
          </h1>
          <p className="text-sm text-gray-600">
            Benue SUBEB Sporting Activity 2026
          </p>
        </div>

        {/* Passport Photo */}
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 bg-gray-100 rounded-2xl overflow-hidden border-2 border-white shadow-md">
            {member.passportPhoto?.url ?
              <img
                src={member.passportPhoto.url}
                alt="Passport"
                className="w-full h-full object-cover"
              />
            : <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                📸
              </div>
            }
          </div>
        </div>

        {/* Name and Category */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">{fullName}</h2>
          <p className="text-sm text-gray-600 mt-1 capitalize">
            {member.category} • {member.eventName}
          </p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-gray-50 rounded-2xl p-4">
          <div>
            <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">
              School
            </p>
            <p className="font-bold text-sm leading-tight">
              {member.schoolName}
            </p>
            <p className="text-[10px] text-gray-600">
              Code: {member.schoolCode}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wider">
              Member Reg ID
            </p>
            <p className="font-mono font-bold text-[#1e3a8a] text-sm break-all">
              {member.memberRegId}
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs text-gray-700">
          {member.age && (
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Age</span>
              <span className="font-bold">{member.age} years</span>
            </div>
          )}
          {member.gender && (
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Gender</span>
              <span className="font-bold capitalize">{member.gender}</span>
            </div>
          )}
          {member.designation && (
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Designation</span>
              <span className="font-bold">{member.designation}</span>
            </div>
          )}
          {member.sportingArea && (
            <div className="flex justify-between border-b pb-1">
              <span className="text-gray-500">Sporting Area</span>
              <span className="font-bold">{member.sportingArea}</span>
            </div>
          )}
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="text-center">
            <QRCodeSVG value={JSON.stringify(qrData)} size={160} level="H" />
            <p className="mt-3 text-[10px] text-gray-500">
              Scan for verification
              <br />
              ID:{" "}
              <span className="font-mono font-bold">{member.memberRegId}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 print:hidden">
          <button
            onClick={() => {
              window.print();
            }}
            className="w-full py-4 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-2"
          >
            🖨️ Print / Save as PDF
          </button>

          <button
            onClick={() => navigate("/sports")}
            className="w-full py-3 text-[#1e3a8a] font-semibold hover:bg-gray-100 rounded-xl transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
