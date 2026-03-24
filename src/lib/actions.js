// src/lib/actions.js
'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
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
          userData {
            phoneNumber
            websiteUrl
            emailVisibility
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

    revalidatePath('/dashboard', 'layout');

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

    revalidatePath('/dashboard/reviews');
    revalidatePath('/directory', 'layout');

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

    // Field name from WPGraphQL is now inside userData.favoriteListings
    const currentFavorites = viewer.userData?.favoriteListings?.nodes.map(n => n.databaseId) || [];
    
    // 2. Filter out the listingId to remove
    const updatedFavorites = currentFavorites.filter(id => id.toString() !== listingId.toString());

    // 3. Update the user's favoriteListings field (CamelCase for input)
    const mutation = `
    mutation UpdateUserFavorites($userId: ID!, $favorites: [Int]) {
      updateUser(input: { id: $userId, favoriteListings: $favorites }) {
        user {
          databaseId
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
          userId: viewer.id,
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

export async function toggleFavoriteListing(userId, newFavoritesArray) {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    return { success: false, message: 'Unauthorized. Please log in.' };
  }


  // Use 'favoriteListings' (CamelCase) for the input mapping
  const mutation = `
    mutation UpdateUserFavorites($userId: ID!, $favorites: [Int]) {
      updateUser(input: { id: $userId, favoriteListings: $favorites }) {
        user {
          databaseId
        }
      }
    }
  `;

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_WORDPRESS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        query: mutation, 
        variables: { userId: userId, favorites: newFavoritesArray } 
      }),
    });

    const json = await res.json();
    
    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      return { success: false, message: 'Failed to update favorites.' };
    }

    // Purge the server cache to ensure fresh data on refresh
    revalidatePath('/directory');
    revalidatePath('/dashboard/favorites');

    return { success: true };
  } catch (error) {
    console.error('Action Error:', error);
    return { success: false, message: 'Network error occurred.' };
  }
}

/**
 * Server Action to submit a user review.
 */
export async function submitUserReview(formData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    return { success: false, message: 'Unauthorized. Please log in to leave a review.' };
  }


  const mutation = `
    mutation CreateReview($input: CreateCcrreviewInput!) {
      createCcrreview(input: $input) {
        ccrreview {
          databaseId
          title
          content
          reviewFields {
            starRating
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
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            title: formData.title || `Review for Listing #${formData.listingId}`,
            content: formData.content,
            starRating: String(formData.rating),
            relatedListing: [Number.parseInt(formData.listingId, 10)], // Linking to listing
            status: 'PUBLISH'
          }
        }
      }),
    });

    const json = await res.json();

    if (json.errors) {
      console.error('GraphQL Review Errors:', json.errors);
      return { success: false, message: json.errors[0].message || 'Failed to submit review.' };
    }

    revalidatePath('/dashboard/reviews');
    revalidatePath(`/directory/[category]/${formData.listingSlug}`, 'page');
    revalidatePath('/directory', 'layout'); 
    return { success: true };
  } catch (error) {
    console.error('Submit Review Action Error:', error);
    return { success: false, message: 'Network error occurred while submitting review.' };
  }
}

/**
 * Server Action to update an existing user review.
 */
export async function updateUserReview(reviewId, formData) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    return { success: false, error: 'Not authenticated' };
  }

  const mutation = `
    mutation UpdateReview($input: UpdateCcrreviewInput!) {
      updateCcrreview(input: $input) {
        ccrreview {
          id
          content
          reviewFields {
            starRating
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
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: {
            id: reviewId,
            starRating: String(formData.rating),
            content: formData.content,
          },
        },
      }),
    });

    const json = await res.json();

    if (json.errors) {
      throw new Error(json.errors[0].message);
    }

    revalidatePath('/dashboard/reviews');
    revalidatePath('/directory', 'layout');

    return { success: true };
  } catch (error) {
    console.error('Update Review Error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action to submit a bug report to Gravity Forms.
 */
export async function submitBugReport(formData) {
  const mutation = `
    mutation SubmitBugReport($input: SubmitGfFormInput!) {
      submitGfForm(input: $input) {
        confirmation {
          message
        }
        errors {
          message
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
        variables: {
          input: {
            id: 10,
            fieldValues: [
              { id: 1, value: formData.name },
              { id: 4, value: formData.pageUrl },
              { id: 3, value: formData.description },
            ],
          },
        },
      }),
    });

    const json = await res.json();

    if (json.errors || (json.data?.submitGfForm?.errors && json.data.submitGfForm.errors.length > 0)) {
      const errorMsg = json.errors ? json.errors[0].message : json.data.submitGfForm.errors[0].message;
      throw new Error(errorMsg);
    }

    return { success: true };
  } catch (error) {
    console.error('Bug Report Submission Error:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Server Action to submit a new business listing to Gravity Forms (Form ID: 11).
 */
export async function submitListing(formData) {
  const mutation = `
    mutation SubmitListing($input: SubmitGfFormInput!) {
      submitGfForm(input: $input) {
        confirmation {
          message
        }
        errors {
          message
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
        variables: {
          input: {
            id: 11,
            fieldValues: [
              { id: 1, value: formData.businessName },
              { id: 3, value: formData.city },
              { id: 4, value: formData.state },
              { id: 5, value: formData.zipCode },
              { id: 7, value: formData.priceRange || '' },
              { id: 8, value: formData.phoneNumber },
              { id: 9, value: formData.businessEmail },
              { id: 10, value: formData.websiteUrl },
              { id: 11, value: formData.videoUrl },
              { id: 12, value: formData.socialUrl },
              { id: 13, value: formData.hoursMonday },
              { id: 14, value: formData.hoursWednesday },
              { id: 15, value: formData.hoursTuesday },
              { id: 16, value: formData.hoursThursday },
              { id: 17, value: formData.hoursSaturday },
              { id: 18, value: formData.hoursFriday },
              { id: 19, value: formData.hoursSunday },
              { id: 20, value: formData.businessDescription },
              { id: 21, value: formData.streetAddress },
              { id: 22, value: formData.directoryType },
              { id: 23, value: formData.businessTypeCategories },
            ],
          },
        },
      }),
    });

    const json = await res.json();

    if (json.errors || (json.data?.submitGfForm?.errors && json.data.submitGfForm.errors.length > 0)) {
      const errorMsg = json.errors ? json.errors[0].message : json.data.submitGfForm.errors[0].message;
      throw new Error(errorMsg);
    }

    revalidatePath('/directory', 'layout');

    return { success: true };
  } catch (error) {
    console.error('Submit Listing Error:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Server Action to handle business registration via Gravity Form ID: 7.
 */
export async function registerBusiness(fieldValues) {
  const mutation = `
    mutation RegisterBusiness($input: SubmitGfFormInput!) {
      submitGfForm(input: $input) {
        confirmation {
          message
        }
        errors {
          id
          message
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
        variables: {
          input: {
            id: 7,
            fieldValues: fieldValues,
          },
        },
      }),
    });

    const json = await res.json();

    if (json.errors || (json.data?.submitGfForm?.errors && json.data.submitGfForm.errors.length > 0)) {
      if (json.data?.submitGfForm?.errors?.length > 0) {
        const gfError = json.data.submitGfForm.errors[0];
        throw new Error(`Field ID ${gfError.id} failed: ${gfError.message}`);
      } else {
        throw new Error(json.errors[0].message);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Register Business Error:', error);
    return { success: false, message: error.message };
  }
}

