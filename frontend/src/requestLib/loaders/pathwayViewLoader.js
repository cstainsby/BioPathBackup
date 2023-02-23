import { getPathwayById } from "../apiRequests";

/**
 * Loader used by React-Router to supply a Pathway when page is loaded
 */
export async function pathwayViewLoader({ params }) {
  const pathway = await getPathwayById(params.pathwayId)
  return { pathway }
}