import { getPathways } from "../requests.js"

/**
 * 
 */
export async function splashPageLoader() {
  const pathways = await getPathways();
  return { pathways }
}