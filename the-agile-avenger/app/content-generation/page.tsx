"use client";
import { useMarketplaceClient } from "@/app/hooks/useMarketplaceClient";
import { ApplicationContext } from "@sitecore-marketplace-sdk/client";
import { useEffect, useState } from "react";
// src/pages/index.tsx
import ContentGenerationGraphQLQuery from "@/app/components/ContentGenerationGraphQLQuery";
import SEOGraphQLQuery from "@/app/components/SEOGraphQLQuery";
 
export default function App() {
  const { client, error, isInitialized, isLoading } = useMarketplaceClient();
  const [appContext, setAppContext] = useState<ApplicationContext>();
  const [activeTab, setActiveTab] = useState("content"); 
  const [parentId, setParentId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [count, setCount] = useState("");

  useEffect(() => {
    if (!error && isInitialized && client) {
      client.query("application.context")
        .then((res) => {
          setAppContext(res.data);
        })
        .catch((error) => {
          console.error("Error retrieving application.context:", error);
        });
    } else if (error) {
      console.error("Error initializing Marketplace client:", error);
    }
  }, [client, error, isInitialized]);

  if (isLoading) {
    return <div>Connecting to XM Cloud...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-xl shadow-lg p-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`flex-1 py-2 text-center font-medium transition-colors ${
            activeTab === "content"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("content")}
        >
          Content Generation
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium transition-colors ${
            activeTab === "seo"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-blue-600"
          }`}
          onClick={() => setActiveTab("seo")}
        >
          SEO Validation
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "content" && (
        <form
          className="space-y-5"
          onSubmit={e => {
            e.preventDefault();
            // Optionally trigger ContentGenerationGraphQLQuery logic here
          }}
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Parent Item ID
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="text"
              value={parentId}
              onChange={e => setParentId(e.target.value)}
              placeholder="Enter Parent Item ID"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Template ID
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="text"
              value={templateId}
              onChange={e => setTemplateId(e.target.value)}
              placeholder="Enter Template ID"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Number of Items
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="number"
              value={count}
              onChange={e => setCount(e.target.value)}
              placeholder="Enter a number of Items"
              autoComplete="off"
            />
          </div>
          {/* Pass values to your query component */}
          <ContentGenerationGraphQLQuery
            appContext={appContext}
            client={client}
            parentId={parentId}
            templateId={templateId}
            count={count}
          />
        </form>
      )}

      {activeTab === "seo" && (
        <div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Parent Item ID
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              type="text"
              value={parentId}
              onChange={e => setParentId(e.target.value)}
              placeholder="Enter Parent Item ID"
              autoComplete="off"
            />
          </div>
          <SEOGraphQLQuery appContext={appContext} client={client} parentId={parentId} />
        </div>
      )}
    </div>
  );
}