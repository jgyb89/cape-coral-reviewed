// lib/api.js

export async function getListingBySlug(slug) {
  const query = `
    query GetListingBySlug($id: ID!) {
      ccrlisting(id: $id, idType: SLUG) {
        id
        databaseId
        title
        content
        
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }

        seo {
          title
          metaDesc
          opengraphImage {
            sourceUrl
          }
        }
        
        directoryTypes {
          nodes {
            name
            slug
          }
        }
        
        listingdata {
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
          
          videoUrl
        }

        reviews {
          nodes {
            title
            content
            date
            author {
              node {
                name
              }
            }
            reviewFields {
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
    ? `, where: { taxQuery: { taxArray: [{ taxonomy: CCRDIRECTORYTYPE, field: SLUG, terms: ["${categorySlug}"] }] } }`
    : "";

  const query = `
    query GetListings {
      ccrlistings(first: 100${taxQuery}) {
        nodes {
          id
          databaseId
          title
          slug
          content
          
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }

          listingdata {
            addressStreet
            addressCity
            phoneNumber
            priceRange
          }
          directoryTypes {
            nodes {
              name
              slug
            }
          }
          reviews {
            nodes {
              reviewFields {
                starRating
              }
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

export async function updateUserFavorites(userId, favoriteIdsArray, authToken) {
  const mutation = `
    mutation UpdateUserFavorites($id: ID!, $favorites: [Int]) {
      updateUser(input: {
        id: $id, 
        favorite_listing: $favorites
      }) {
        user {
          id
          databaseId
          favorite_listing {
            nodes {
              databaseId
            }
          }
        }
      }
    }
  `;

  const variables = {
    id: userId,
    favorites: favoriteIdsArray,
  };

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      body: JSON.stringify({ query: mutation, variables }),
    });

    const json = await res.json();
    if (json.errors) {
      console.error("GraphQL Errors:", json.errors);
      throw new Error("Failed to update favorites");
    }
    return json.data.updateUser.user;
  } catch (error) {
    console.error("Error updating favorites:", error);
    return null;
  }
}
