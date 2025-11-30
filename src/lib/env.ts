/**
 * Centralized environment detection utilities
 *
 * Use this module to check the runtime environment consistently across the app.
 * This prevents bugs from inconsistent checks (e.g., forgetting VERCEL_ENV).
 */

/**
 * Returns true in development mode OR Vercel preview deployments.
 *
 * Use this for:
 * - Dev login credentials provider
 * - Bypassing userId checks for testing
 * - Showing debug UI elements
 *
 * Note: On Vercel, NODE_ENV is always "production" even for previews,
 * so we must also check VERCEL_ENV.
 */
export const isDevMode =
  process.env.NODE_ENV === "development" ||
  process.env.VERCEL_ENV === "preview";

/**
 * Returns true only in actual production (not preview deployments)
 */
export const isProduction =
  process.env.NODE_ENV === "production" &&
  process.env.VERCEL_ENV !== "preview";
