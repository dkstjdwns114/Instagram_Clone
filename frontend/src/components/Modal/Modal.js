import React from "react";

import "./Modal.css";

const modal = (props) => (
  <div className="modal">
    <header className="modal__header">
      <h1>{props.title}</h1>
    </header>
    <section className="modal__content">{props.children}</section>
    {props.isComment && (
      <form>
        <input type="text" />
      </form>
    )}
    <section className="modal__actions">
      {props.canCancel && (
        <button className="warning-btn" onClick={props.onCancel}>
          Cancel
        </button>
      )}
      {props.canConfirm && (
        <button className="modal-btn" onClick={props.onConfirm}>
          {props.confirmText}
        </button>
      )}
    </section>
  </div>
);

export default modal;
