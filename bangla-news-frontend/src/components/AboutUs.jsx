import React, { useEffect, useState } from "react";
import {
  Newspaper,
  Globe,
  Download,
  Users,
  Award,
  TrendingUp,
  Target,
  Heart,
  Zap,
  Shield,
} from "lucide-react";

export default function AboutUs() {
  // Icon mapping object
  const iconMap = {
    Newspaper,
    Globe,
    Download,
    Users,
    Award,
    TrendingUp,
    Target,
    Heart,
    Zap,
    Shield,
  };

  const [siteTexts, setSiteTexts] = useState({});
  useEffect(() => {
    fetch("http://localhost:4000/news/site-config")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.texts) {
          setSiteTexts(data.texts);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch site config:", err);
      });
  }, []);

  // Get icon component by name
  const getIcon = (iconName, className) => {
    const IconComponent = iconMap[iconName] || Newspaper;
    return <IconComponent className={className} />;
  };

  const features = [
    {
      icon: siteTexts?.aboutFeature1Icon || "Newspaper",
      title: siteTexts?.aboutFeature1Title || "Dual Language Coverage",
      description:
        siteTexts?.aboutFeature1Desc ||
        "Access comprehensive news in both Bangla and English from a single platform",
    },
    {
      icon: siteTexts?.aboutFeature2Icon || "Globe",
      title: siteTexts?.aboutFeature2Title || "Wide Reach",
      description:
        siteTexts?.aboutFeature2Desc ||
        "Connecting readers across Bangladesh and the world with credible journalism",
    },
    {
      icon: siteTexts?.aboutFeature3Icon || "Download",
      title: siteTexts?.aboutFeature3Title || "PDF Download",
      description:
        siteTexts?.aboutFeature3Desc ||
        "Save articles as PDF for offline reading and sharing convenience",
    },
  ];

  const stats = [
    {
      number: siteTexts?.aboutStat1Number || "1M+",
      label: siteTexts?.aboutStat1Label || "Monthly Readers",
    },
    {
      number: siteTexts?.aboutStat2Number || "50+",
      label: siteTexts?.aboutStat2Label || "Journalists",
    },
    {
      number: siteTexts?.aboutStat3Number || "24/7",
      label: siteTexts?.aboutStat3Label || "News Updates",
    },
    {
      number: siteTexts?.aboutStat4Number || "2",
      label: siteTexts?.aboutStat4Label || "Languages",
    },
  ];

  const coreValues = [
    {
      icon: siteTexts?.aboutValue1Icon || "Award",
      title: siteTexts?.aboutValue1Title || "Integrity",
      description:
        siteTexts?.aboutValue1Desc ||
        "We uphold the highest standards of journalistic ethics and transparency in every story we publish.",
    },
    {
      icon: siteTexts?.aboutValue2Icon || "Users",
      title: siteTexts?.aboutValue2Title || "Inclusivity",
      description:
        siteTexts?.aboutValue2Desc ||
        "Breaking language barriers to ensure news is accessible to all Bangladeshi communities.",
    },
    {
      icon: siteTexts?.aboutValue3Icon || "TrendingUp",
      title: siteTexts?.aboutValue3Title || "Innovation",
      description:
        siteTexts?.aboutValue3Desc ||
        "Embracing modern technology to enhance your news reading experience with features like PDF downloads.",
    },
    {
      icon: siteTexts?.aboutValue4Icon || "Globe",
      title: siteTexts?.aboutValue4Title || "Global Perspective",
      description:
        siteTexts?.aboutValue4Desc ||
        "Connecting local stories with global context to give you a comprehensive worldview.",
    },
  ];

  console.log(siteTexts);

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {siteTexts?.aboutPageTitle || "About Dhaka Chronicle"}
        </h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          {siteTexts?.aboutPageSubtitle ||
            "Your trusted source for bilingual news coverage, bringing you the latest stories from Bangladesh and around the world in both Bangla and English."}
        </p>
      </div>

      {/* Mission Statement */}
      <div className="mb-16 p-8 border-l-4 border-blue-600">
        <h2 className="text-2xl font-bold mb-4">
          {siteTexts?.aboutMissionTitle || "Our Mission"}
        </h2>
        <p className="text-gray-700 leading-relaxed text-lg">
          {siteTexts?.aboutMissionDesc ||
            "Dhaka Chronicle is dedicated to delivering accurate, unbiased, and timely news to readers in their preferred language. We bridge the gap between Bangla and English-speaking audiences, ensuring everyone stays informed about local and global events that matter."}
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
          {siteTexts?.aboutFeaturesTitle || "What Sets Us Apart"}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                {getIcon(feature.icon, "w-8 h-8")}
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
          {siteTexts?.aboutValuesTitle || "Our Core Values"}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {coreValues.map((value, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-4">
                <div className="text-blue-600 flex-shrink-0 mt-1">
                  {getIcon(value.icon, "w-6 h-6")}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center p-8 border-2 border-blue-600 rounded-lg">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          {siteTexts?.aboutCtaTitle || "Join Our Growing Community"}
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          {siteTexts?.aboutCtaDesc ||
            "Stay informed with Dhaka Chronicle's comprehensive coverage. Read news in your preferred language and download articles for later."}
        </p>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          {siteTexts?.aboutCtaButton || "Explore Latest News"}
        </button>
      </div>
    </div>
  );
}
