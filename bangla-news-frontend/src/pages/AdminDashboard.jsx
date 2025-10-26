import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("rss");
  const [rssFeeds, setRssFeeds] = useState({});
  const [siteTexts, setSiteTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form states
  const [selectedCategory, setSelectedCategory] = useState("binodon");
  const [newFeedUrl, setNewFeedUrl] = useState("");

  const navigate = useNavigate();

  const categories = [
    { key: "binodon", label: "Binodon (Entertainment)" },
    { key: "kheladhula", label: "Kheladhula (Sports)" },
    { key: "topnews", label: "Top News" },
    { key: "rajniti", label: "Rajniti (Politics)" },
    { key: "orthoniti", label: "Orthoniti (Economy)" },
    { key: "projukti", label: "Projukti (Technology)" },
    { key: "aantorjatik", label: "Aantorjatik (International)" },
    { key: "swasthya", label: "Swasthya (Health)" },
  ];

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (!isLoggedIn) {
      navigate("/admin/login");
    }
  }, [navigate]);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [feedsRes, textsRes] = await Promise.all([
        fetch("http://localhost:4000/admin/rss-feeds"),
        fetch("http://localhost:4000/admin/site-texts"),
      ]);

      const feedsData = await feedsRes.json();
      const textsData = await textsRes.json();

      if (feedsData.success) setRssFeeds(feedsData.feeds);
      if (textsData.success) setSiteTexts(textsData.texts);
    } catch (error) {
      showMessage("error", "Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const handleAddFeed = async (e) => {
    e.preventDefault();
    if (!newFeedUrl.trim()) return;

    setSaving(true);
    try {
      const response = await fetch(
        "http://localhost:4000/admin/rss-feeds/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: selectedCategory,
            feedUrl: newFeedUrl.trim(),
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setRssFeeds({ ...rssFeeds, [selectedCategory]: data.feeds });
        setNewFeedUrl("");
        showMessage("success", "RSS feed added successfully!");
      } else {
        showMessage("error", data.message);
      }
    } catch (error) {
      showMessage("error", "Failed to add RSS feed");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFeed = async (category, feedUrl) => {
    if (!confirm("Are you sure you want to remove this RSS feed?")) return;

    setSaving(true);
    try {
      const response = await fetch(
        "http://localhost:4000/admin/rss-feeds/remove",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category, feedUrl }),
        }
      );

      const data = await response.json();
      if (data.success) {
        setRssFeeds({ ...rssFeeds, [category]: data.feeds });
        showMessage("success", "RSS feed removed successfully!");
      } else {
        showMessage("error", data.message);
      }
    } catch (error) {
      showMessage("error", "Failed to remove RSS feed");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSiteTexts = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("http://localhost:4000/admin/site-texts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteTexts }),
      });

      const data = await response.json();
      if (data.success) {
        showMessage("success", "Site texts updated successfully!");
      } else {
        showMessage("error", data.message);
      }
    } catch (error) {
      showMessage("error", "Failed to update site texts");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminUsername");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome, {localStorage.getItem("adminUsername")}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Message Alert */}
      {message.text && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("rss")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "rss"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              RSS Feeds Management
            </button>
            <button
              onClick={() => setActiveTab("texts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                activeTab === "texts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Site Texts
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "rss" && (
          <div className="space-y-6">
            {/* Add RSS Feed Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add New RSS Feed
              </h2>
              <form onSubmit={handleAddFeed} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.key} value={cat.key}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RSS Feed URL
                    </label>
                    <input
                      type="url"
                      value={newFeedUrl}
                      onChange={(e) => setNewFeedUrl(e.target.value)}
                      placeholder="https://example.com/feed/rss.xml"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {saving ? "Adding..." : "Add RSS Feed"}
                </button>
              </form>
            </div>

            {/* RSS Feeds List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Current RSS Feeds
              </h2>
              <div className="space-y-6">
                {categories.map((cat) => (
                  <div key={cat.key} className="border-b pb-4 last:border-b-0">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                      {cat.label} ({rssFeeds[cat.key]?.length || 0} feeds)
                    </h3>
                    <div className="space-y-2">
                      {rssFeeds[cat.key]?.map((feedUrl, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                        >
                          <span className="text-sm text-gray-700 break-all flex-1">
                            {feedUrl}
                          </span>
                          <button
                            onClick={() => handleRemoveFeed(cat.key, feedUrl)}
                            disabled={saving}
                            className="ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {(!rssFeeds[cat.key] ||
                        rssFeeds[cat.key].length === 0) && (
                        <p className="text-sm text-gray-500 italic">
                          No RSS feeds added yet
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "texts" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Edit Site Texts
            </h2>
            <form onSubmit={handleUpdateSiteTexts} className="space-y-6">
              {/* Homepage Heading */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Homepage Heading
                </label>
                <input
                  type="text"
                  value={siteTexts.homepageHeading || ""}
                  onChange={(e) =>
                    setSiteTexts({
                      ...siteTexts,
                      homepageHeading: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* About Us */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Us Text
                </label>
                <textarea
                  value={siteTexts.aboutUs || ""}
                  onChange={(e) =>
                    setSiteTexts({ ...siteTexts, aboutUs: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              {/* Category Names */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Category Display Names
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {cat.label}
                      </label>
                      <input
                        type="text"
                        value={siteTexts.categoryNames?.[cat.key] || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            categoryNames: {
                              ...siteTexts.categoryNames,
                              [cat.key]: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
