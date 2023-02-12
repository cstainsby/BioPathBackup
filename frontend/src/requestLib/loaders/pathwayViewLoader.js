

import { getPathwayById } from "../apiRequests";

/**
 * 
 */
export async function pathwayViewLoader({ params }) {
  const pathway = await getPathwayById(params.pathwayId)
  return { pathway }
}