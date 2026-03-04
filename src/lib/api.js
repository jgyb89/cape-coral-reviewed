// lib/api.js

export async function getListingBySlug(slug) {
  const query = `
    query GetListingBySlug($id: ID!) {
      ccrlisting(id: $id, idType: SLUG) {
        title
        content
        
        seo {
          title
          metaDesc
          opengraphImage {
            sourceUrl
          }
        }
        
        ccrdirectorytypes {
          nodes {
            name
            slug
          }
        }
        
        addressStreet
        addressCity
        addressState
        addressZipCode
        phoneNumber
        businessEmail
        websiteUrl
        socialUrl
        priceRange
        
        hoursMonday
        hoursTuesday
        hoursWednesday
        hoursThursday
        hoursFriday
        hoursSaturday
        hoursSunday
        
        imageGallery {
          nodes {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        videoUrl

        # FIX: Querying the node directly from the field
        reviews {
          node {
            title
            content
            starRating
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { id: slug },
      }),
      next: { revalidate: 60 },
    });

    const json = await res.json();

    if (json.errors) {
      console.error("GraphQL API Errors (getListingBySlug):", json.errors);
      throw new Error("Failed to fetch listing data from GraphQL");
    }

    return json.data.ccrlisting;
  } catch (error) {
    console.error("Network or Fetch Error:", error);
    return null;
  }
}

export async function getListings(categorySlug = null) {
  const taxQuery = categorySlug
    ? `, where: { taxQuery: { taxArray: { taxonomy: CCRDIRECTORYTYPE, field: SLUG, terms: ["${categorySlug}"] } } }`
    : "";

  const query = `
    query GetListings {
      ccrlistings(first: 100${taxQuery}) {
        nodes {
          title
          slug
          content
          addressStreet
          addressCity
          phoneNumber
          priceRange
          
          # FIX: Wrapped imageGallery in nodes to match WPGraphQL connection structure
          imageGallery {
            nodes {
              sourceUrl
            }
          }
          
          ccrdirectorytypes {
            nodes {
              name
              slug
            }
          }
          
          # FIX: Querying the node directly from the field
          reviews {
            node {
              starRating
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 },
    });

    const json = await res.json();

    if (json.errors) {
      console.error("GraphQL API Errors (getListings):", json.errors);
      return [];
    }

    return json.data.ccrlistings?.nodes || [];
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}
