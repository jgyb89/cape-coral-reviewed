// src/lib/actions.js
'use server';

import { cookies } from 'next/headers';
import { loginUser, getViewer } from './auth';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

/**
 * Server Action to handle user login.
 * This wraps the loginUser utility so it can be called from Client Components.
 */
export async function handleLogin(username, password) {
  try {
    const user = await loginUser(username, password);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Server Action to update the user's profile.
 */
export async function updateUserProfile(formData) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    return { success: false, error: 'Not authenticated' };
  }

  const mutation = `
    mutation UpdateUserProfile($input: UpdateUserInput!) {
      updateUser(input: $input) {
        user {
          id
          firstName
          lastName
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
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            id: formData.id,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            websiteUrl: formData.websiteUrl,
            emailVisibility: formData.emailVisibility,
          },
        },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    return { success: true, user: json.data.updateUser.user };
  } catch (error) {
    console.error('Update Profile Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action to delete a user's review.
 */
export async function deleteUserReview(reviewId) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    return { success: false, error: 'Not authenticated' };
  }

  const mutation = `
    mutation DeleteReview($id: ID!) {
      deleteCcrreview(input: { id: $id }) {
        deletedId
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
      body: JSON.stringify({
        query: mutation,
        variables: { id: reviewId },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    return { success: true };
  } catch (error) {
    console.error('Delete Review Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action to remove a listing from user's favorites.
 */
export async function removeFavoriteListing(listingId) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    // 1. Fetch current favorites
    const viewer = await getViewer();
    if (!viewer) throw new Error('Could not fetch viewer data');

    const currentFavorites = viewer.favorite_listings?.nodes.map(n => n.databaseId) || [];
    
    // 2. Filter out the listingId to remove
    // listingId coming from client might be GraphQL ID or Database ID, 
    // we assume it's the databaseId for the Pods relationship update.
    const updatedFavorites = currentFavorites.filter(id => id.toString() !== listingId.toString());

    // 3. Update the user's favorite_listings field
    const mutation = `
      mutation UpdateUserFavorites($id: ID!, $favorites: [ID]) {
        updateUser(input: { id: $id, favorite_listings: $favorites }) {
          user {
            id
          }
        }
      }
    `;

    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          id: viewer.id,
          favorites: updatedFavorites,
        },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    return { success: true };
  } catch (error) {
    console.error('Remove Favorite Error:', error);
    return { success: false, error: error.message };
  }
}
