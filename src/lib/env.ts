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
 *
 * This is a function (not a constant) to ensure it's evaluated at runtime,
 * which is necessary for server-side code in Next.js.
 */
export function isDevMode(): boolean {
  const result =
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview";

  // Log once per cold start to aid debugging on preview deploys
  if (result && !isDevMode._logged) {
    console.log("[ENV] Dev mode active", {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
    });
    isDevMode._logged = true;
  }

  return result;
}
// Track if we've logged to avoid spamming
isDevMode._logged = false;

/**
 * Returns true only in actual production (not preview deployments)
 */
export function isProduction(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.VERCEL_ENV !== "preview"
  );
}
