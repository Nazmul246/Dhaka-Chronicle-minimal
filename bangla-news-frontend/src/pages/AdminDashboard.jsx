import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiRss,
  FiHome,
  FiInfo,
  FiTag,
  FiMail,
  FiLayout,
  FiLogOut,
  FiEye,
  FiMenu,
  FiX,
} from "react-icons/fi";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("rss");
  const [rssFeeds, setRssFeeds] = useState({});
  const [siteTexts, setSiteTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const menuItems = [
    { id: "rss", label: "RSS Feeds", icon: FiRss },
    { id: "homepage", label: "Homepage Contents", icon: FiHome },
    { id: "about", label: "About Us", icon: FiInfo },
    { id: "categories", label: "Category Rename", icon: FiTag },
    { id: "footer", label: "Footer", icon: FiLayout },
    { id: "contact", label: "Contact Us", icon: FiMail },
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:translate-x-0 lg:static inset-y-0 left-0 z-50 w-80 bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-transform duration-300 ease-in-out `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl">
              DC
            </div>
            <div>
              <h1 className="text-lg font-bold">Dhaka Chronicle</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="mb-4">
            <p className="text-xs text-slate-400 uppercase font-semibold px-4 mb-2">
              Management
            </p>
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-700/50"
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Account Section */}
          <div className="mt-8">
            <p className="text-xs text-slate-400 uppercase font-semibold px-4 mb-2">
              Account
            </p>
            <button
              onClick={() => window.open("/", "_blank")}
              className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-slate-300 hover:bg-slate-700/50 transition-all"
            >
              <FiEye size={20} />
              <span className="text-sm font-medium">View Site</span>
            </button>
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-all"
            >
              <FiLogOut size={20} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600"
              >
                <FiMenu size={24} />
              </button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Dhaka Chronicle Vault
                </h2>
                <p className="text-sm text-gray-600">
                  Welcome, {localStorage.getItem("adminUsername")}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Message Alert */}
        {message.text && (
          <div className="px-6 pt-4">
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

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* RSS Feeds Tab */}
          {activeTab === "rss" && (
            <div className="space-y-6">
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
                    className="cursor-pointer px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                  >
                    {saving ? "Adding..." : "Add RSS Feed"}
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Current RSS Feeds
                </h2>
                <div className="space-y-6">
                  {categories.map((cat) => (
                    <div
                      key={cat.key}
                      className="border-b pb-4 last:border-b-0"
                    >
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
                              className="cursor-pointer ml-4 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition disabled:opacity-50"
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

          {/* Homepage Contents Tab */}
          {activeTab === "homepage" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Edit Homepage Contents
              </h2>
              <form onSubmit={handleUpdateSiteTexts} className="space-y-6">
                {/* Main Heading */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Homepage Main Heading
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
                    placeholder="e.g., All the News from Bangladesh"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                {/* Animation Texts Section */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Animated Typing Texts
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        1. Animation Text 1
                      </label>
                      <input
                        type="text"
                        value={siteTexts.animationText1 || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            animationText1: e.target.value,
                          })
                        }
                        placeholder="e.g., One Place, Any Time."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        2. Animation Text 2
                      </label>
                      <input
                        type="text"
                        value={siteTexts.animationText2 || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            animationText2: e.target.value,
                          })
                        }
                        placeholder="e.g., Real-time Breaking News."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        3. Animation Text 3
                      </label>
                      <input
                        type="text"
                        value={siteTexts.animationText3 || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            animationText3: e.target.value,
                          })
                        }
                        placeholder="e.g., Your Daily Bangla Digest."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Featured Section */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Featured Section (Below Hero)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        1. Feature 1
                      </label>
                      <input
                        type="text"
                        value={siteTexts.feature1 || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            feature1: e.target.value,
                          })
                        }
                        placeholder="e.g., 20+ Top News-portal"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        2. Feature 2
                      </label>
                      <input
                        type="text"
                        value={siteTexts.feature2 || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            feature2: e.target.value,
                          })
                        }
                        placeholder="e.g., Live Breaking Updates"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        3. Feature 3
                      </label>
                      <input
                        type="text"
                        value={siteTexts.feature3 || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            feature3: e.target.value,
                          })
                        }
                        placeholder="e.g., Pure Bangla News"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        4. Feature 4
                      </label>
                      <input
                        type="text"
                        value={siteTexts.feature4 || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            feature4: e.target.value,
                          })
                        }
                        placeholder="e.g., Updated Every Hour"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* About Us Tab */}
          {activeTab === "about" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Edit About Us Page
              </h2>
              <form onSubmit={handleUpdateSiteTexts} className="space-y-6">
                {/* Header Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Header Section
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Title
                      </label>
                      <input
                        type="text"
                        value={siteTexts.aboutPageTitle || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutPageTitle: e.target.value,
                          })
                        }
                        placeholder="About Dhaka Chronicle"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Subtitle
                      </label>
                      <textarea
                        value={siteTexts.aboutPageSubtitle || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutPageSubtitle: e.target.value,
                          })
                        }
                        rows="3"
                        placeholder="Your trusted source for bilingual news coverage..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Mission Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Mission Section
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mission Title
                      </label>
                      <input
                        type="text"
                        value={siteTexts.aboutMissionTitle || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutMissionTitle: e.target.value,
                          })
                        }
                        placeholder="Our Mission"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mission Description
                      </label>
                      <textarea
                        value={siteTexts.aboutMissionDesc || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutMissionDesc: e.target.value,
                          })
                        }
                        rows="4"
                        placeholder="Dhaka Chronicle is dedicated to delivering accurate, unbiased..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Statistics Section
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Stat 1 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Stat 1 - Number
                      </label>
                      <input
                        type="text"
                        value={siteTexts.aboutStat1Number || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutStat1Number: e.target.value,
                          })
                        }
                        placeholder="1M+"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <input
                        type="text"
                        value={siteTexts.aboutStat1Label || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutStat1Label: e.target.value,
                          })
                        }
                        placeholder="Monthly Readers"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Stat 2 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Stat 2 - Number
                      </label>
                      <input
                        type="text"
                        value={siteTexts.aboutStat2Number || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutStat2Number: e.target.value,
                          })
                        }
                        placeholder="50+"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <input
                        type="text"
                        value={siteTexts.aboutStat2Label || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutStat2Label: e.target.value,
                          })
                        }
                        placeholder="Journalists"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Stat 3 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Stat 3 - Number
                      </label>
                      <input
                        type="text"
                        value={siteTexts.aboutStat3Number || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutStat3Number: e.target.value,
                          })
                        }
                        placeholder="24/7"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <input
                        type="text"
                        value={siteTexts.aboutStat3Label || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutStat3Label: e.target.value,
                          })
                        }
                        placeholder="News Updates"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Stat 4 */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Stat 4 - Number
                      </label>
                      <input
                        type="text"
                        value={siteTexts.aboutStat4Number || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutStat4Number: e.target.value,
                          })
                        }
                        placeholder="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <input
                        type="text"
                        value={siteTexts.aboutStat4Label || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutStat4Label: e.target.value,
                          })
                        }
                        placeholder="Languages"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Features Section
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={siteTexts.aboutFeaturesTitle || ""}
                      onChange={(e) =>
                        setSiteTexts({
                          ...siteTexts,
                          aboutFeaturesTitle: e.target.value,
                        })
                      }
                      placeholder="What Sets Us Apart"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="space-y-6">
                    {/* Feature 1 */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-800">Feature 1</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon Name
                        </label>
                        <select
                          value={siteTexts.aboutFeature1Icon || "Newspaper"}
                          onChange={(e) =>
                            setSiteTexts({
                              ...siteTexts,
                              aboutFeature1Icon: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="Newspaper">Newspaper</option>
                          <option value="Globe">Globe</option>
                          <option value="Download">Download</option>
                          <option value="Users">Users</option>
                          <option value="Award">Award</option>
                          <option value="TrendingUp">TrendingUp</option>
                          <option value="Target">Target</option>
                          <option value="Heart">Heart</option>
                          <option value="Zap">Zap</option>
                          <option value="Shield">Shield</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={siteTexts.aboutFeature1Title || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutFeature1Title: e.target.value,
                          })
                        }
                        placeholder="Feature Title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <textarea
                        value={siteTexts.aboutFeature1Desc || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutFeature1Desc: e.target.value,
                          })
                        }
                        rows="2"
                        placeholder="Feature Description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-800">Feature 2</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon Name
                        </label>
                        <select
                          value={siteTexts.aboutFeature2Icon || "Globe"}
                          onChange={(e) =>
                            setSiteTexts({
                              ...siteTexts,
                              aboutFeature2Icon: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="Newspaper">Newspaper</option>
                          <option value="Globe">Globe</option>
                          <option value="Download">Download</option>
                          <option value="Users">Users</option>
                          <option value="Award">Award</option>
                          <option value="TrendingUp">TrendingUp</option>
                          <option value="Target">Target</option>
                          <option value="Heart">Heart</option>
                          <option value="Zap">Zap</option>
                          <option value="Shield">Shield</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={siteTexts.aboutFeature2Title || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutFeature2Title: e.target.value,
                          })
                        }
                        placeholder="Feature Title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <textarea
                        value={siteTexts.aboutFeature2Desc || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutFeature2Desc: e.target.value,
                          })
                        }
                        rows="2"
                        placeholder="Feature Description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-800">Feature 3</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon Name
                        </label>
                        <select
                          value={siteTexts.aboutFeature3Icon || "Download"}
                          onChange={(e) =>
                            setSiteTexts({
                              ...siteTexts,
                              aboutFeature3Icon: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="Newspaper">Newspaper</option>
                          <option value="Globe">Globe</option>
                          <option value="Download">Download</option>
                          <option value="Users">Users</option>
                          <option value="Award">Award</option>
                          <option value="TrendingUp">TrendingUp</option>
                          <option value="Target">Target</option>
                          <option value="Heart">Heart</option>
                          <option value="Zap">Zap</option>
                          <option value="Shield">Shield</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={siteTexts.aboutFeature3Title || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutFeature3Title: e.target.value,
                          })
                        }
                        placeholder="Feature Title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <textarea
                        value={siteTexts.aboutFeature3Desc || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutFeature3Desc: e.target.value,
                          })
                        }
                        rows="2"
                        placeholder="Feature Description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Core Values Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Core Values Section
                  </h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={siteTexts.aboutValuesTitle || ""}
                      onChange={(e) =>
                        setSiteTexts({
                          ...siteTexts,
                          aboutValuesTitle: e.target.value,
                        })
                      }
                      placeholder="Our Core Values"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="space-y-6">
                    {/* Value 1 */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-800">Value 1</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon Name
                        </label>
                        <select
                          value={siteTexts.aboutValue1Icon || "Award"}
                          onChange={(e) =>
                            setSiteTexts({
                              ...siteTexts,
                              aboutValue1Icon: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="Newspaper">Newspaper</option>
                          <option value="Globe">Globe</option>
                          <option value="Download">Download</option>
                          <option value="Users">Users</option>
                          <option value="Award">Award</option>
                          <option value="TrendingUp">TrendingUp</option>
                          <option value="Target">Target</option>
                          <option value="Heart">Heart</option>
                          <option value="Zap">Zap</option>
                          <option value="Shield">Shield</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={siteTexts.aboutValue1Title || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutValue1Title: e.target.value,
                          })
                        }
                        placeholder="Value Title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <textarea
                        value={siteTexts.aboutValue1Desc || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutValue1Desc: e.target.value,
                          })
                        }
                        rows="2"
                        placeholder="Value Description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Value 2 */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-800">Value 2</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon Name
                        </label>
                        <select
                          value={siteTexts.aboutValue2Icon || "Users"}
                          onChange={(e) =>
                            setSiteTexts({
                              ...siteTexts,
                              aboutValue2Icon: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="Newspaper">Newspaper</option>
                          <option value="Globe">Globe</option>
                          <option value="Download">Download</option>
                          <option value="Users">Users</option>
                          <option value="Award">Award</option>
                          <option value="TrendingUp">TrendingUp</option>
                          <option value="Target">Target</option>
                          <option value="Heart">Heart</option>
                          <option value="Zap">Zap</option>
                          <option value="Shield">Shield</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={siteTexts.aboutValue2Title || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutValue2Title: e.target.value,
                          })
                        }
                        placeholder="Value Title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <textarea
                        value={siteTexts.aboutValue2Desc || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutValue2Desc: e.target.value,
                          })
                        }
                        rows="2"
                        placeholder="Value Description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Value 3 */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-800">Value 3</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon Name
                        </label>
                        <select
                          value={siteTexts.aboutValue3Icon || "TrendingUp"}
                          onChange={(e) =>
                            setSiteTexts({
                              ...siteTexts,
                              aboutValue3Icon: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="Newspaper">Newspaper</option>
                          <option value="Globe">Globe</option>
                          <option value="Download">Download</option>
                          <option value="Users">Users</option>
                          <option value="Award">Award</option>
                          <option value="TrendingUp">TrendingUp</option>
                          <option value="Target">Target</option>
                          <option value="Heart">Heart</option>
                          <option value="Zap">Zap</option>
                          <option value="Shield">Shield</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={siteTexts.aboutValue3Title || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutValue3Title: e.target.value,
                          })
                        }
                        placeholder="Value Title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <textarea
                        value={siteTexts.aboutValue3Desc || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutValue3Desc: e.target.value,
                          })
                        }
                        rows="2"
                        placeholder="Value Description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    {/* Value 4 */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <h4 className="font-medium text-gray-800">Value 4</h4>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon Name
                        </label>
                        <select
                          value={siteTexts.aboutValue4Icon || "Globe"}
                          onChange={(e) =>
                            setSiteTexts({
                              ...siteTexts,
                              aboutValue4Icon: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="Newspaper">Newspaper</option>
                          <option value="Globe">Globe</option>
                          <option value="Download">Download</option>
                          <option value="Users">Users</option>
                          <option value="Award">Award</option>
                          <option value="TrendingUp">TrendingUp</option>
                          <option value="Target">Target</option>
                          <option value="Heart">Heart</option>
                          <option value="Zap">Zap</option>
                          <option value="Shield">Shield</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={siteTexts.aboutValue4Title || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutValue4Title: e.target.value,
                          })
                        }
                        placeholder="Value Title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <textarea
                        value={siteTexts.aboutValue4Desc || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutValue4Desc: e.target.value,
                          })
                        }
                        rows="2"
                        placeholder="Value Description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* CTA Section */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Call-to-Action Section
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CTA Title
                      </label>
                      <input
                        type="text"
                        value={siteTexts.aboutCtaTitle || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutCtaTitle: e.target.value,
                          })
                        }
                        placeholder="Join Our Growing Community"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CTA Description
                      </label>
                      <textarea
                        value={siteTexts.aboutCtaDesc || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutCtaDesc: e.target.value,
                          })
                        }
                        rows="2"
                        placeholder="Stay informed with Dhaka Chronicle's comprehensive coverage..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={siteTexts.aboutCtaButton || ""}
                        onChange={(e) =>
                          setSiteTexts({
                            ...siteTexts,
                            aboutCtaButton: e.target.value,
                          })
                        }
                        placeholder="Explore Latest News"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* Category Rename Tab */}
          {activeTab === "categories" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Rename Categories
              </h2>
              <form onSubmit={handleUpdateSiteTexts} className="space-y-6">
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
                        placeholder={`e.g., 🎬 Entertainment`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  ))}
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

          {/* Footer Tab */}
          {activeTab === "footer" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Edit Footer Content
              </h2>
              <form onSubmit={handleUpdateSiteTexts} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Title
                  </label>
                  <input
                    type="text"
                    value={siteTexts.footerTitle || ""}
                    onChange={(e) =>
                      setSiteTexts({
                        ...siteTexts,
                        footerTitle: e.target.value,
                      })
                    }
                    placeholder="Dhaka Chronicle Vault"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Description
                  </label>
                  <textarea
                    value={siteTexts.footerDescription || ""}
                    onChange={(e) =>
                      setSiteTexts({
                        ...siteTexts,
                        footerDescription: e.target.value,
                      })
                    }
                    rows="3"
                    placeholder="Write Your Footer Description Here..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="cursor-pointer px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* Contact Us Tab */}
          {activeTab === "contact" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Edit Contact Information
              </h2>
              <form onSubmit={handleUpdateSiteTexts} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={siteTexts.contactEmail || ""}
                      onChange={(e) =>
                        setSiteTexts({
                          ...siteTexts,
                          contactEmail: e.target.value,
                        })
                      }
                      placeholder="contact@dhakachronicle.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={siteTexts.contactPhone || ""}
                      onChange={(e) =>
                        setSiteTexts({
                          ...siteTexts,
                          contactPhone: e.target.value,
                        })
                      }
                      placeholder="+880 1234 567890"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Address
                  </label>
                  <textarea
                    value={siteTexts.contactAddress || ""}
                    onChange={(e) =>
                      setSiteTexts({
                        ...siteTexts,
                        contactAddress: e.target.value,
                      })
                    }
                    rows="3"
                    placeholder="Dhaka, Bangladesh"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
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
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
