
// ----------------------------------------------------------------------
// SignInModal
// ----------------------------------------------------------------------
const SignInModal = (props) => {
  return (
    <div className="modal fade" id="signInModal" tabIndex="-1" aria-labelledby="signInModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="signInModalLabel">Sign In</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            Put Oath or some other sign in method here
            
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Skip</button>
            <button type="button" className="btn btn-primary">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInModal;