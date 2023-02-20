import { getPathways } from "../apiRequests";

/**
 * NOTE this function is stubbed out
 * user context probably will need to be imported here
 */
export async function splashPageLoader() {
  let recentWork = await getPathways();

  let userFeed = await getPathways();
  
  return {
    recentWork: recentWork,
    userFeed: userFeed
  }
}