import React, { Component } from "react";
import Axios from "axios";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import TimelineList from "../components/Timeline/TimelineList/TimelineList";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";

import "./css/Common.css";
import "./css/Main.css";
import "./css/Reset.css";

import TimelineRight from "../components/Timeline/TimelineRight";

class TimelinePage extends Component {
  state = {
    creating: false,
    medias: [],
    isLeftLoading: true,
    isRightLoading: true,
    fileInputState: "",
    previewSource: "",
    isViewLikes: false,
    myData: "",
    imageSelected: "",
    imgPublicId: ""
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.imageElRef = React.createRef();
    this.captionElRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.context) {
        this.fetchMedias();
        this.fetchMyData();
      }
    }, 100);
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  viewLikesHandler = () => {
    this.setState({ isViewLikes: true });
  };

  cancelLikesHandler = () => {
    this.setState({ isViewLikes: false });
  };

  uploadData = async () => {
    const caption = this.captionElRef.current.value;
    this.setState({ creating: false });
    if (!this.state.previewSource || caption.length === 0) return;

    const requestBody = {
      query: `
          mutation CreateMedia($media_url: String!, $media_caption: String!) {
            createMedia(mediaInput: {media_url: $media_url, media_caption: $media_caption}) {
              _id
              media_url
              media_caption
              date
              creator {
                _id
                username
                profile_pic_url
              }
            }
          }
        `,
      variables: {
        media_url: this.state.imgPublicId,
        media_caption: caption
      }
    };

    const token = this.context.token;

    fetch("/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        const createMedia = resData.data.createMedia;
        this.setState((prevState) => {
          const updatedMedias = [...prevState.medias];
          updatedMedias.unshift({
            _id: createMedia._id,
            media_url: createMedia.media_url,
            media_caption: createMedia.media_caption,
            date: createMedia.date,
            creator: {
              _id: this.context.userId,
              username: createMedia.creator.username,
              profile_pic_url: createMedia.creator.profile_pic_url
            },
            commentTexts: [],
            likeds: []
          });
          return { medias: updatedMedias };
        });
        this.setState({
          previewSource: "",
          imageSelected: "",
          imgPublicId: ""
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({
      creating: false,
      previewSource: ""
    });
    this.captionElRef.current.value = "";
  };

  handleFileInputChange = (e) => {
    const file = e.target.files[0];
    this.setState({ imageSelected: file });
    this.previewFile(file);
  };

  previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({ previewSource: reader.result });
    };
  };

  modalConfirmHandler = async () => {
    const formData = new FormData();
    formData.append("file", this.state.imageSelected);
    formData.append("upload_preset", "anstagram");
    try {
      Axios.post(
        "https://api.cloudinary.com/v1_1/anstagram123/image/upload",
        formData
      ).then((response) => {
        console.log(response.data);
        this.setState({
          imgPublicId: response.data.public_id
        });
        this.uploadData();
      });
    } catch (err) {
      console.error(err);
    }
  };

  fetchMedias() {
    this.setState({ isLeftLoading: true });

    const requestBody = {
      query: `
          query {
            timelineMedia {
              _id
              media_url
              media_caption
              date
              creator {
                _id
                username
                profile_pic_url
              }
              commentTexts {
                _id
                media_comment
                date
                creator {
                  username
                  profile_pic_url
                }
              }
              likeds {
                user {
                  username
                  profile_pic_url
                }
              }
            }
          }
        `
    };

    fetch("/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + this.context.token
      }
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        const medias = resData.data.timelineMedia.reverse();
        this.setState({
          medias: medias,
          isLeftLoading: false
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLeftLoading: false });
      });
  }

  fetchMyData() {
    this.setState({ isRightLoading: true });
    const requestBody = {
      query: `
        query {
          timelineMyData(userId: "${this.context.userId}"){
            _id
            username
            full_name
            profile_pic_url
          }
        }
      `
    };

    fetch("/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        this.setState({ myData: resData.data.timelineMyData });
        this.setState({ isRightLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isRightLoading: false });
      });
  }

  render() {
    return (
      <>
        <input
          type="button"
          id="create-media"
          name="create-media"
          onClick={this.startCreateEventHandler}
          value="creating"
          style={{ display: "none" }}
        />
        {this.context.token && this.state.creating && (
          <Modal
            title="Add Post"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText={this.context.token ? "Upload" : "Confirm"}
          >
            <form>
              <div className="form-create-control">
                <label htmlFor="image">사진</label>
                <input
                  type="file"
                  id="image"
                  ref={this.imageElRef}
                  onChange={this.handleFileInputChange}
                />
                {this.state.previewSource && (
                  <img
                    src={this.state.previewSource}
                    alt="chosen"
                    style={{
                      maxWidth: "448px",
                      maxHeight: "448px",
                      display: "block",
                      margin: "0 auto",
                      marginTop: "10px"
                    }}
                  />
                )}
              </div>
              <div className="form-create-control">
                <label htmlFor="caption">설명</label>
                <textarea id="caption" rows="4" ref={this.captionElRef} />
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && this.state.creating && <Backdrop />}
        {this.state.isViewLikes && <Backdrop />}
        {this.state.isRightLoading || this.state.isLeftLoading ? (
          <Spinner />
        ) : (
          <>
            <div className="main">
              <div className="container">
                <TimelineList
                  medias={this.state.medias}
                  authUserId={this.context.userId}
                  isLikeView={this.viewLikesHandler}
                  cancelIsLikeView={this.cancelLikesHandler}
                  contextToken={this.context.token}
                />
                {this.context.token && (
                  <TimelineRight myData={this.state.myData} />
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}

export default TimelinePage;
