import React from "react";
import {
  Newspaper,
  Globe,
  Download,
  Users,
  Award,
  TrendingUp,
} from "lucide-react";

export default function AboutUs() {
  const features = [
    {
      icon: <Newspaper className="w-8 h-8" />,
      title: "Dual Language Coverage",
      description:
        "Access comprehensive news in both Bangla and English from a single platform",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Wide Reach",
      description:
        "Connecting readers across Bangladesh and the world with credible journalism",
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "PDF Download",
      description:
        "Save articles as PDF for offline reading and sharing convenience",
    },
  ];

  const stats = [
    { number: "1M+", label: "Monthly Readers" },
    { number: "50+", label: "Journalists" },
    { number: "24/7", label: "News Updates" },
    { number: "2", label: "Languages" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Dhaka Chronicle
        </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Your trusted source for bilingual news coverage, bringing you the
          latest stories from Bangladesh and around the world in both Bangla and
          English.
        </p>
      </div>

      {/* Mission Statement */}
      <div className="mb-16 p-8 border-l-4 border-blue-600">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          Dhaka Chronicle is dedicated to delivering accurate, unbiased, and
          timely news to readers in their preferred language. We bridge the gap
          between Bangla and English-speaking audiences, ensuring everyone stays
          informed about local and global events that matter.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              {stat.number}
            </div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          What Sets Us Apart
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-4">
              <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Integrity</h3>
                <p className="text-gray-600">
                  We uphold the highest standards of journalistic ethics and
                  transparency in every story we publish.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-4">
              <Users className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
                <p className="text-gray-600">
                  Breaking language barriers to ensure news is accessible to all
                  Bangladeshi communities.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  Embracing modern technology to enhance your news reading
                  experience with features like PDF downloads.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-4">
              <Globe className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Global Perspective
                </h3>
                <p className="text-gray-600">
                  Connecting local stories with global context to give you a
                  comprehensive worldview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center p-8 border-2 border-blue-600 rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Join Our Growing Community
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Stay informed with Dhaka Chronicle's comprehensive coverage. Read news
          in your preferred language and download articles for later.
        </p>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          Explore Latest News
        </button>
      </div>
    </div>
  );
}
