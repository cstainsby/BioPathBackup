// ----------------------------------------------------------------------
// HelpModal
// ----------------------------------------------------------------------
const HelpModal = (props) => {
  return (
    <div className="modal fade" id="helpModal" tabIndex="-1" aria-labelledby="helpModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="helpModalLabel">Help Not Implemented</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <h3>TODO</h3>
            {/* <img src={finger}></img> */}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Welp...</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpModal;