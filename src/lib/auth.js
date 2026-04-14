// src/lib/auth.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

/**
 * Logs in a user via WPGraphQL and sets an HTTPOnly cookie with the authToken.
 */
export async function loginUser(username, password) {
  const mutation = `
    mutation LoginUser($username: String!, $password: String!) {
      login(input: { username: $username, password: $password }) {
        authToken
        user {
          id
          name
          email
        }
      }
    }
  `;

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: { username, password },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    const { authToken } = json.data.login;

    // Set HTTPOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('authToken', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return json.data.login.user;
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
}

/**
 * Retrieves the current logged-in user's data.
 */
export async function getViewer() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    return null;
  }

  const query = `
    query GetViewer {
      viewer {
        id
        databaseId
        name
        email
        firstName
        lastName
        roles {
          nodes {
            name
          }
        }
        userData {
          phoneNumber
          websiteUrl
          emailVisibility
          favoriteListings {
            nodes {
              ... on Ccrlisting {
                databaseId
                title
                slug
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
                directoryTypes {
                  nodes {
                    slug
                  }
                }
                }
                }
                }
                }
                ccrreviews {
                nodes {
                id
                databaseId
                title
                content
                date
                reviewFields {
                starRating
                relatedListing {
                nodes {
                  ... on Ccrlisting {
                    databaseId
                    title
                    slug
                    directoryTypes {
                      nodes {
                        slug
                      }
                    }
                  }
                }
                }
                }
                }
                }

      }
    }
  `;

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });

    const json = await res.json();

    if (json.errors) {
      // Detect if the WPGraphQL token has expired
      const isExpired = json.errors.some(e => 
        e.extensions?.debugMessage === 'Expired token' || 
        e.message?.includes('Expired token')
      );

      if (isExpired) {
        // Instantly redirect to the logout route to destroy the dead cookie 
        // The logout route will then gracefully redirect them to the homepage
        redirect('/logout');
      }

      console.error('Viewer Query Error:', JSON.stringify(json.errors, null, 2));
      return null;
    }

    return json.data.viewer;
  } catch (error) {
    console.error('Fetch Viewer Error:', error);
    return null;
  }
}

/**
 * Clears the authToken cookie to sign out the user.
 */
export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('authToken');
}
