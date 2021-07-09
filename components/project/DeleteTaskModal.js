import React from 'react'
import ReactDOM from 'react-dom'

const Modal = ({ isShowing, hide }) =>
  isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div
            className="modal-wrapper"
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
          >
            <div className="modal">
              <div className="modal-header">
                <button
                  type="button"
                  className="modal-close-button"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={hide}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <p>Are you sure, you want to delete a task?</p>
            </div>
            <button>Delete</button>
            <button>Cancel</button>
          </div>
        </React.Fragment>,
        document.body
      )
    : null

export default Modal
