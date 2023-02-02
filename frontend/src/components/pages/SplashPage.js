
import { Link } from "react-router-dom";


/**
 * This splash page should be the first page the user hits when opening the home page (the root route)
 * @returns A Splash page component
 */
const SplashPage = () => {
  return (
    <div id="SplashPage">
      <h1>Biopath</h1>
      <p>A Biochemistry Interactive Learning Tool</p>
      <Link to={"/pathway"} type="button" className="btn btn-primary btn-lg">
        To Your Editor
      </Link>
    </div>
  )
}

export default SplashPage;