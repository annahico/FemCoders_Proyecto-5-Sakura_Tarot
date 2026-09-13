// Base URL for the users/readings backend (json-server in local dev).
// In production, set VITE_API_URL in the hosting provider's env vars to a
// publicly reachable backend — localhost:3000 only exists on a developer's
// own machine, so it can never work for visitors of the deployed site.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
