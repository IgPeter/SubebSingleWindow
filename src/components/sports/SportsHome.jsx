// components/Sports/SportsHome.jsx
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { sportsEvents } from "../../../data/sportsEvents";
import chairmanImage from "../../assets/images/mrsgraceadagba.jpg";

export default function SportsHome() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const eventsSectionRef = useRef(null);

  // Function to scroll smoothly to the events grid
  const scrollToEvents = () => {
    eventsSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section - Grand & Official */}
      <div className="relative min-h-[80vh] md:h-screen flex items-center justify-center overflow-hidden bg-[#1e3a8a] py-16 md:py-0">
        <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x1080/1e3a8a/ffffff?text=Benue+Sports+Stadium')] bg-cover bg-center opacity-30"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full">
          {/* SUBEB Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-white/30">
            <span className="text-green-400 text-xl">●</span>
            <span className="uppercase tracking-widest text-sm font-semibold">
              Benue State Universal Basic Education Board
            </span>
          </div>

          {/* BIGGER MAIN TITLE */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-2 tracking-tight">
            PARTICIPATE IN INTER-SCHOOL
            <br className="hidden sm:block" />
            SPORTS COMPETITIONS
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-blue-200 font-medium mb-6 sm:mb-8">
            Organised by Benue SUBEB
          </p>

          <p className="text-base sm:text-lg text-blue-100 max-w-xl mx-auto mb-8">
            Nurturing Talent • Building Character • Promoting Excellence in
            Basic Education
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              type="button"
              onClick={scrollToEvents}
              className="w-full sm:w-auto max-w-xs bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl text-lg sm:text-xl font-semibold transition-all shadow-lg"
            >
              Register Your School
            </button>
            <button
              type="button"
              onClick={scrollToEvents}
              className="w-full sm:w-auto max-w-xs border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg sm:text-xl font-medium transition-all"
            >
              View Past Events
            </button>
          </div>

          {/* Event Info */}
          <div className="mt-12 text-blue-200 text-sm sm:text-base flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8">
            <div>🏅 Over 50 Schools Expected</div>
            <div>📍 Venue: Makurdi Township Stadium</div>
            <div>🗓️ April – May 2026</div>
          </div>
        </div>
      </div>

      {/* Official Message */}
      <div className="max-w-5xl mx-auto px-6 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-[#1e3a8a]">
            A Message from the Executive Chairman
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Sports is an integral part of quality basic education. This festival
            will discover and nurture the next generation of champions while
            fostering discipline, teamwork and healthy competition among our
            pupils.
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="flex flex-col items-center">
            <img
              src={chairmanImage}
              alt="Executive Chairman"
              className="w-full md:w-1/3 h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Upcoming Events - Professional Grid */}
      <div ref={eventsSectionRef} className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-[#1e3a8a]">
                Upcoming Events
              </h2>
              <p className="text-gray-600 mt-2">
                Register before slots are filled
              </p>
            </div>
            <Link
              onClick={scrollToEvents}
              className="text-[#1e3a8a] font-medium hover:underline flex items-center gap-2"
            >
              View All Events →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {sportsEvents.map((event) => {
              const isSelected = selectedEvent?.id === event.id;

              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className={`group bg-white border-2 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer
                    ${
                      isSelected ?
                        "border-[#1e3a8a] shadow-xl scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {/* Icon Area */}
                  <div className="h-52 bg-gradient-to-br from-[#1e3a8a] to-blue-700 flex items-center justify-center text-7xl transition-transform group-hover:scale-110">
                    {event.name.toLowerCase().includes("football") && "⚽"}
                    {event.name.toLowerCase().includes("volleyball") && "🏐"}
                    {event.name.toLowerCase().includes("handball") && "🤾"}
                    {event.name.toLowerCase().includes("race") && "🏃‍♂️"}
                    {event.name.toLowerCase().includes("table tennis") && "🏓"}
                    {event.name.toLowerCase().includes("jump") && "🏃"}
                    {!event.name
                      .toLowerCase()
                      .match(
                        /football|volleyball|handball|race|sack|tug|javelin|chess|tennis|jump|shot|dance/,
                      ) && "🏅"}
                  </div>

                  <div className="p-8">
                    <h3 className="font-semibold text-2xl text-[#1e3a8a] mb-4">
                      {event.name}
                    </h3>

                    <div className="space-y-1 text-gray-600 mb-8">
                      <p>
                        Max Participants:{" "}
                        <span className="font-medium">
                          {event.maxParticipants}
                        </span>
                      </p>
                      {event.maxTechnical > 0 && (
                        <p>
                          Technical Team:{" "}
                          <span className="font-medium">
                            {event.maxTechnical}
                          </span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click from firing again
                        setSelectedEvent(event);
                      }}
                      className="block w-full text-center bg-[#1e3a8a] hover:bg-blue-900 text-white py-4 rounded-2xl font-semibold transition"
                    >
                      Select Event
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-[#1e3a8a] text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Develop the Whole Child Through Sports
          </h2>
          <p className="text-base sm:text-xl text-blue-200 mb-10 leading-relaxed">
            Participation builds confidence, teamwork, and leadership skills in
            our basic education pupils.
          </p>
          <Link
            to={selectedEvent ? `events/${selectedEvent.id}/register` : "#"}
            className={`inline-block w-full sm:inline-block sm:w-auto max-w-xs mx-auto px-8 py-5 rounded-3xl text-lg sm:text-2xl font-bold transition-all ${
              selectedEvent ?
                "bg-green-500 hover:bg-green-600"
              : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            Begin Registration →
          </Link>
        </div>
      </div>
    </div>
  );
}
