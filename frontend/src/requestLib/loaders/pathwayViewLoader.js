

import { getPathwayById } from "../requests.js"

/**
 * 
 */
export async function pathwayViewLoader({ params }) {
  const pathway = await getPathwayById(params.pathwayId)
  return { pathway }
}