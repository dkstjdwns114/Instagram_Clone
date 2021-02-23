import React from "react";

const modalBodyTextStyle = {
  display: "inline-block",
  fontSize: "14px",
  color: "#4a4747",
  fontFamily: "roboto",
  lineHeight: "23px",
  marginBottom: "0px",
  padding: "0px 15px 0px",
  height: "200px",
  overflowY: "scroll",
  textAlign: "justify",
  width: "430px"
};

const followModal = (props) => (
  <div className="like-modal fade" id="myModal2" role="dialog">
    <div className="modal-dialog" style={{ width: "430px" }}>
      <div className="modal-content">
        <div
          className="modal-header"
          style={{
            textAlign: "center",
            padding: "1px",
            width: "430px",
            paddingTop: "10px",
            paddingBottom: "10px",
            borderBottom: "0.5px solid #dee2e6"
          }}
        >
          <h4 className="modal-title" style={{ fontSize: "20px" }}>
            {props.title}
          </h4>
        </div>
        <div className="modal-body">
          <span style={modalBodyTextStyle}>
            <ul className="profile follow_list">
              {props.users.map((user, idx) => {
                return (
                  <li key={user.username}>
                    <img
                      src={user.profile_pic_url}
                      alt={user.username + "님의 프로필 사진"}
                      className="profile_img"
                    />
                    <div className="pofile_info">
                      <p className="profile_id">{user.username}</p>
                    </div>
                    <div className="follow_btn" style={{ paddingLeft: "63%" }}>
                      <button type="button" className="btn">
                        <span>팔로우</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </span>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-default"
            data-dismiss="modal"
            style={{
              marginLeft: "43%",
              marginTop: "20px",
              marginBottom: "20px",
              padding: "10px",
              color: "#dc3545",
              backgroundColor: "transparent"
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
export default followModal;
