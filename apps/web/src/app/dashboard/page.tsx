"use client";

import Link from "next/link";

// Mock data for interviews
const interviews = [
  {
    id: 1,
    title: "System Design - Social Media Platform",
    description: "Design a scalable social media platform like Twitter",
    difficulty: "Hard",
    duration: "45 mins",
    topics: ["Microservices", "Database Design", "Caching"]
  },
  {
    id: 2,
    title: "System Design - Chat Application",
    description: "Build a real-time messaging system like WhatsApp",
    difficulty: "Medium",
    duration: "45 mins",
    topics: ["WebSockets", "Message Queues", "Load Balancing"]
  },
  {
    id: 3,
    title: "System Design - Video Streaming",
    description: "Design a video streaming platform like YouTube",
    difficulty: "Hard",
    duration: "60 mins",
    topics: ["CDN", "Video Encoding", "Scalability"]
  },
  {
    id: 4,
    title: "System Design - URL Shortener",
    description: "Create a URL shortening service like bit.ly",
    difficulty: "Easy",
    duration: "30 mins",
    topics: ["Database Design", "Caching", "Analytics"]
  },
  {
    id: 5,
    title: "System Design - E-commerce Platform",
    description: "Build a scalable e-commerce system like Amazon",
    difficulty: "Hard",
    duration: "60 mins",
    topics: ["Payment Systems", "Inventory Management", "Search"]
  },
  {
    id: 6,
    title: "System Design - Ride Sharing",
    description: "Design a ride-sharing service like Uber",
    difficulty: "Medium",
    duration: "45 mins",
    topics: ["GPS Tracking", "Matching Algorithm", "Real-time Updates"]
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Hard":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  }
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            System Design Interviews
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Choose an interview to practice your system design skills
          </p>
        </div>

        {/* Interview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {interview.title}
                </h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                    interview.difficulty
                  )}`}
                >
                  {interview.difficulty}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {interview.description}
              </p>

              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {interview.duration}
                </div>
                <div className="flex flex-wrap gap-1">
                  {interview.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/sandbox?interview=${interview.id}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 inline-block text-center"
              >
                Start Interview
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
