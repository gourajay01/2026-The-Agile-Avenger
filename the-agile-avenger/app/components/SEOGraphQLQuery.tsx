// src/components/GraphQLQuery.tsx
import { useState } from "react";
import { ClientSDK } from "@sitecore-marketplace-sdk/client";

type Field = {
  name: string;
  value?: string;
};

type SitecoreItem = {
  name: string;
  path: string;
  itemId: string;
  fields?: {
    nodes?: Field[];
  };
  children?: {
    nodes?: SitecoreItem[];
  };
};
type SEOCheckResult = {
  name: string;
  itemId: string;
  path: string;
  missingFields: string[];
  children: SEOCheckResult[];
};
export function checkSEORecursive(item: SitecoreItem) {
  const requiredSEOFields = [
    "Title",
    "metadataTitle",
    "metadataDescription",
    "metadataKeywords",
  ];

  const fields = item.fields?.nodes || [];
  const missingFields: string[] = [];

  requiredSEOFields.forEach((seoField) => {
    const field = fields.find((f) => f.name === seoField);
    if (!field || !field.value || field.value.trim() === "") {
      missingFields.push(seoField);
    }
  });

  // Recursively check children
  const childrenResults: SEOCheckResult[] = item.children?.nodes
    ? item.children.nodes.map(checkSEORecursive)
    : [];

  return {
    name: item.name,
    itemId: item.itemId,
    path: item.path,
    missingFields,
    children: childrenResults,
  };
}

export default function SEOGraphQLQuery({
  appContext,
  client,
  parentId
}: {
  appContext: any;
  client: ClientSDK | null;
  parentId: any;
}) {
  const [data, setData] = useState<any>(null);

  const makeGraphQLQuery = async () => {
    const mutations = `query {
  item(
  where: { itemId: "${parentId}", language: "en", requirePresentation: true}
  ) {
    itemId
    name
    path
    field(name: "Title") {
      value
      fieldId
    }
    fields(excludeStandardFields: true) {
      nodes {
        name
        value
      }
    }
    children(requirePresentation:true) {
      nodes {
        itemId
        name
        path
        fields(excludeStandardFields: true) {
          nodes {
            name
            value
          }
        }
        # 3rd level children
        children(requirePresentation:true) {
          nodes {
            itemId
            name
            path
            fields(excludeStandardFields: true) {
              nodes {
                name
                value
              }
            }
            # 4th level children
            children(requirePresentation:true) {
              nodes {
                itemId
                name
                path
                fields(excludeStandardFields: true) {
                  nodes {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;

    const graphQLQuery = {
      query: mutations,
    };

    // Adjust this line to your actual context structure
    const sitecoreContextId = appContext?.resourceAccess?.[0]?.context?.live;

    const response = await client?.mutate("xmc.authoring.graphql", {
      params: {
        query: {
          sitecoreContextId,
        },
        body: graphQLQuery,
      },
    });

    if (response && response.data) {
      setData(response.data);
    }

    console.log(response);
  };

  return (
    <div>
      <div className="flex gap-4">

        <button
          onClick={makeGraphQLQuery}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Content Item Validation
        </button>
      </div>
      <table className="min-w-full border mt-4">
        <thead className="">
          <tr>
            <th className="border px-4 py-2 text-left">Item Name</th>
            <th className="border px-4 py-2 text-left">Item Id</th>
            <th className="border px-4 py-2 text-left">Path</th>
            <th className="border px-4 py-2 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {data?.data?.item?.children?.nodes?.map((child: any) => {
            const result = checkSEORecursive(child);

            return (
              <tr key={child.name}>
                <td className="border px-4 py-2">{result.name}</td>

                <td className="border px-4 py-2 text-sm">{result.itemId}</td>
                <td className="border px-4 py-2 text-sm">{result.path}</td>

                <td className="border px-4 py-2">
                  {result.missingFields.length === 0 ? (
                    <span className="text-green-600 font-medium">
                      All SEO fields present
                    </span>
                  ) : (
                    <span className="text-red-600">
                      Missing: {result.missingFields.join(", ")}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}