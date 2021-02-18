import React from "react";

const modalBodyTextStyle = {
  fontSize: "14px",
  color: "#4a4747",
  fontFamily: "roboto",
  lineHeight: "23px",
  marginBottom: "0px",
  padding: "0px 15px 0px",
  height: "200px",
  overflowY: "scroll",
  textAlign: "justify"
};

const likeModal = (props) => (
  <div className="modal fade" id="myModal2" role="dialog">
    <div className="modal-dialog" style={{ maxWidth: "700px" }}>
      <div className="modal-content">
        <div
          className="modal-header"
          style={{
            background: " #0071bc",
            color: "#fff",
            textAlign: "center",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
            padding: "1px"
          }}
        >
          <h4
            className="modal-title"
            style={{ fontSize: "20px", fontFamily: "roboto" }}
          >
            좋아요
          </h4>
        </div>
        <div className="modal-body">
          <p style={modalBodyTextStyle}>
            {props.likes.map((like, idx) => {
              return (
                <div className="social-header" key={like.user.username}>
                  <a href="/gllcollege/" className="social-profile-img">
                    <img
                      src={like.user.profile_pic_url}
                      alt={like.user.username + "님의 프로필 사진"}
                    />
                  </a>
                  <div className="social-follow">
                    <a
                      title="gllcollege"
                      href="/gllcollege/"
                      className="social-name"
                    >
                      {like.user.username}
                    </a>
                  </div>
                </div>
              );
            })}
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-default"
            data-dismiss="modal"
            style={{
              marginLeft: "43%",
              marginTop: "20px",
              marginBottom: "20px"
            }}
            onClick={props.onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
);
export default likeModal;
