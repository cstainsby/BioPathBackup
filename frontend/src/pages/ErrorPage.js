import { useLocation } from 'react-router-dom';

function ErrorPage() {
    let location = useLocation();

    return (
        <div>
            <h2>Error, invalid path</h2>
            <p>
                No match for path
                <code>{location.pathname}</code>
            </p>
        </div>
    );
}

export default ErrorPage;
