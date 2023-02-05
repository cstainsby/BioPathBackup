

import { getPathwayById } from "../requests.js"

/**
 * 
 */
export async function pathwayViewLoader(id) {
  const pathway = await getPathwayById(id)
  return { pathway }
}