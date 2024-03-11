"use client";

import { useState } from "react";

type EventLog = {
  timestamp: string;
  userId: number;
  eventType: string;
  originalLine: string;
};

export default function Home() {
  const [userId, setUserId] = useState("");
  const [eventType, setEventType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [events, setEvents] = useState<EventLog[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset errors
    setErrors({});

    // Validate form inputs
    const errors: { [key: string]: string } = {};

    if (userId && isNaN(Number(userId))) {
      errors.userId = "User ID must be a number";
    }

    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      errors.dateRange = "From date must be before or equal to To date";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const queryParams = new URLSearchParams();
    if (userId) queryParams.append("userId", userId);
    if (eventType) queryParams.append("eventType", eventType);
    if (fromDate) queryParams.append("fromDate", fromDate);
    if (toDate) queryParams.append("toDate", toDate);

    const res = await fetch(`http://localhost:3030/events/log?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      setEvents(data);
    } else {
      console.error("Failed to fetch events");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-black"
          />
          {errors.userId && <p className="text-red-500">{errors.userId}</p>}
        </div>
        <input
          type="text"
          placeholder="Event Type"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded text-black"
        />
        <div className="flex gap-4">
          <input
            type="date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-black"
          />
          <input
            type="date"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded text-black"
          />
        </div>
        {errors.dateRange && <p className="text-red-500">{errors.dateRange}</p>}
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded text-black">
          Fetch Events
        </button>
      </form>

      {events.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Events:</h2>
          <ul className="list-disc pl-4">
            {events.map((event, index) => (
              <li key={index} className="text-balance">
                {event.originalLine}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}