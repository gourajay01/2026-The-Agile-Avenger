"use client";
import { useState, useEffect } from "react";
import { ClientSDK } from "@sitecore-marketplace-sdk/client";

export default function ContentGenerationGraphQLQuery({
  appContext,
  client,
  parentId,
  templateId,
  count
}: {
  appContext: any;
  client: ClientSDK | null;
  parentId: any;
  templateId: any;
  count: any;
}) {
  const [success, setSuccess] = useState(false);
  const makeGraphQLQuery = async () => {

    //const data = await generateAIContent();
    const data = {
      "blogs": [
        {
          "title": "Wandering Through the Streets of Lisbon",
          "content": "Lisbon’s pastel-colored buildings and cobblestone alleys are a dream for any traveler. I spent my days riding the iconic yellow trams and sipping espresso at riverside cafés. Don’t miss the view from Miradouro da Senhora do Monte at sunset! Tip: Wear comfortable shoes—those hills are no joke. Try a pastel de nata from a local bakery and take time to chat with friendly locals. Lisbon’s charm lies in its laid-back pace and hidden corners, so let yourself get a little lost. You’ll discover the city’s magic in the most unexpected places."
        },
        {
          "title": "Chasing Waterfalls in Iceland’s South Coast",
          "content": "Iceland’s south coast is a land of thundering waterfalls and dramatic landscapes. Seljalandsfoss lets you walk behind the cascade—bring a rain jacket! Skógafoss, just down the road, is equally breathtaking. I recommend renting a car for flexibility and stopping at small villages for fresh fish soup. The weather changes quickly, so pack layers and waterproof gear. Don’t rush—take time to soak in the scenery and snap plenty of photos. Each waterfall has its own story, and the journey between them is just as memorable as the destinations themselves."
        },
        {
          "title": "Exploring Tokyo’s Hidden Cafés",
          "content": "Tokyo is a city of contrasts, and its hidden cafés are a testament to its creativity. I stumbled upon a tiny matcha café in Nakameguro, where the owner shared stories over frothy green tea. Venture beyond Shibuya to neighborhoods like Shimokitazawa for quirky, cozy spots. Many cafés blend traditional Japanese aesthetics with modern twists. Tip: Bring cash, as some places don’t accept cards. Don’t be shy—ask locals for recommendations. These tucked-away gems are perfect for relaxing after a day of sightseeing and offer a unique taste of Tokyo’s vibrant culture."
        },
        {
          "title": "Sunset Sailing in Santorini",
          "content": "There’s nothing like watching the sun dip below Santorini’s caldera from a sailboat. The sky explodes in hues of orange and pink, and the sea glows with reflected light. I joined a small group tour that included swimming stops and a delicious Greek dinner onboard. Tip: Book in advance, especially during peak season. Bring a light jacket for the evening breeze and your camera for those postcard-perfect shots. Sailing around the island offers a fresh perspective and a sense of freedom you won’t soon forget. It’s a must-do for any Santorini adventure."
        },
        {
          "title": "Hiking the Cinque Terre Trails",
          "content": "The colorful villages of Cinque Terre are best explored on foot. I hiked the trail from Vernazza to Monterosso, passing terraced vineyards and breathtaking sea views. The path can be steep, so sturdy shoes and water are essential. Start early to avoid crowds and the midday sun. Along the way, stop for fresh focaccia and local lemon granita. Each village has its own charm—don’t rush your visit. The trails connect you to the heart of the Italian Riviera, where every turn reveals a new postcard-worthy scene. It’s a hiker’s paradise!"
        },
        {
          "title": "Safari Adventure in Kenya’s Maasai Mara",
          "content": "Waking up to the sounds of the savannah is an experience I’ll never forget. The Maasai Mara teems with wildlife—lions, elephants, and the great wildebeest migration. I joined a sunrise game drive with a knowledgeable guide who shared fascinating facts about the animals. Tip: Bring binoculars and a good camera. Dress in layers for chilly mornings and warm afternoons. Respect the wildlife and listen to your guide’s instructions. Staying in a tented camp added to the adventure. The Maasai Mara’s beauty and raw energy will leave you in awe."
        },
        {
          "title": "Cycling Through Amsterdam’s Canals",
          "content": "Amsterdam is best explored by bike! I rented a classic Dutch bicycle and pedaled along the city’s picturesque canals, stopping at flower markets and cozy cafés. The city is bike-friendly, but always watch for trams and pedestrians. Tip: Use a sturdy lock and park only in designated areas. Don’t miss the Jordaan district for its artsy vibe and delicious stroopwafels. Cycling lets you see the city like a local and discover hidden gems at your own pace. Embrace the freedom and enjoy the gentle rhythm of Amsterdam’s streets."
        },
        {
          "title": "Road Tripping the Great Ocean Road, Australia",
          "content": "The Great Ocean Road is a breathtaking drive along Australia’s southern coast. I started in Melbourne and made my way to the Twelve Apostles, stopping at surf towns and rainforests along the way. Tip: Take your time—there are plenty of scenic lookouts and walking trails. Pack snacks and a camera for spontaneous stops. The coastal views are stunning, especially at sunrise and sunset. Don’t forget to visit the koala colonies in Kennett River. This road trip is all about the journey, so roll down the windows and let the adventure unfold."
        },
        {
          "title": "Discovering Marrakech’s Vibrant Souks",
          "content": "Marrakech’s souks are a sensory overload—in the best way! I wandered through narrow alleys filled with colorful textiles, spices, and handcrafted treasures. Haggling is part of the fun, so don’t be shy. Tip: Keep small change handy and watch your belongings in crowded areas. Take breaks in hidden courtyards with mint tea and sweet pastries. The call to prayer echoing through the medina adds to the magic. Marrakech is a city that rewards curiosity, so let yourself get lost and embrace the vibrant chaos of the souks."
        },
        {
          "title": "Island Hopping in Croatia’s Dalmatian Coast",
          "content": "Croatia’s Dalmatian Coast is a paradise for island hoppers. I started in Split and took ferries to Hvar, Vis, and Korčula, each with its own unique charm. Tip: Buy ferry tickets in advance during summer. Rent a scooter to explore hidden beaches and local vineyards. The seafood is fresh and delicious—try the black risotto! Each island offers a mix of history, culture, and stunning scenery. Don’t rush—spend a few days on each to truly soak in the laid-back Mediterranean vibe. Island hopping here is pure bliss for any traveler."
        }
      ]
    };
    // setBlogs(data.blogs);
    console.log("Generate: ", data);
    // Don't check blogs.length here, it's still the old value!
    const blogs = data.blogs.slice(0, count); // Only use the first N blogs
    let mutations = "";

    blogs.forEach((blog, index) => {

      const safeName = blog.title.replace(/"/g, '\\"');
      const safeTitle = blog.title.replace(/[^a-zA-Z0-9 ]/g, '');
      const safeContent = blog.content.replace(/"/g, '\\"');

      mutations += `
        item${index + 1}: createItem(
          input: {
            database: "master"
            fields: [
              { name: "Title", value: "${safeName}" }
              { name: "Content", value: "${safeContent}" }
            ]
            language: "en"
            name: "${safeTitle}"
            parent: "${parentId}"
            templateId: "${templateId}"
          }
        ) {
          item {
            itemId
            path
          }
        }
      `;
    });
    console.log("Mutation: ", mutations);
    const graphQLQuery = {
      query: `mutation { ${mutations} }`,
    };

    const sitecoreContextId = appContext.resourceAccess?.[0]?.context.live;

    const response = await client?.mutate("xmc.authoring.graphql", {
      params: {
        query: {
          sitecoreContextId,
        },
        body: graphQLQuery,
      },
    });
    // Show success if response is OK (customize as needed)
    if (response) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Hide after 3 seconds
    }
    console.log(response);
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={makeGraphQLQuery}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
      >
        Content Generation
      </button>
      {success && (
        <div className="px-4 py-2 bg-green-100 text-green-800 rounded border border-green-300 transition">
          Blog items created successfully!
        </div>
      )}
    </div>
  );
}