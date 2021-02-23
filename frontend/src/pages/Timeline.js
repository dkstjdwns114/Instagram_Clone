import React, { Component } from "react";

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
    isLeftLoading: false,
    isRightLoading: false,
    fileInputState: "",
    previewSource: "",
    isGetImage: undefined,
    imageUrl: "",
    prevIsGetImage: "",
    isViewLikes: false,
    myData: ""
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.imageElRef = React.createRef();
    this.captionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchMedias();
    setTimeout(() => {
      if (this.context) {
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

  loadImage = async () => {
    try {
      while (
        this.state.isGetImage === undefined ||
        this.state.isGetImage === this.state.prevIsGetImage
      ) {
        const res = await fetch("/api/image");
        const data = await res.json();
        this.setState({ isGetImage: data.public_id });
      }
      return this.state.isGetImage;
    } catch (error) {
      console.error(error);
    }
  };

  modalConfirmHandler = async () => {
    const caption = this.captionElRef.current.value;
    if (!this.state.previewSource || caption.length === 0) return;

    this.setState({ creating: false });
    this.uploadImage(this.state.previewSource);

    await this.loadImage()
      .then((res) => {
        this.setState({ imageUrl: res });
      })
      .catch((error) => {
        console.log(error);
      });

    if (this.state.imageUrl === undefined) {
      await this.loadImage()
        .then((res) => {
          this.setState({ imageUrl: res });
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
        media_url: this.state.imageUrl,
        media_caption: caption
      }
    };

    const token = this.context.token;

    fetch("http://localhost:8000/graphql", {
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
        this.setState((prevState) => {
          const updatedMedias = [...prevState.medias];
          updatedMedias.unshift({
            _id: resData.data.createMedia._id,
            media_url: resData.data.createMedia.media_url,
            media_caption: resData.data.createMedia.media_caption,
            date: resData.data.createMedia.date,
            creator: {
              _id: this.context.userId,
              username: resData.data.createMedia.creator.username,
              profile_pic_url: resData.data.createMedia.creator.profile_pic_url
            },
            commentTexts: [],
            likeds: []
          });
          return { medias: updatedMedias };
        });
        this.setState({
          prevIsGetImage: resData.data.createMedia.media_url
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
    this.previewFile(file);
  };

  previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({ previewSource: reader.result });
    };
  };

  uploadImage = async (base64EncodedImage) => {
    try {
      await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        body: JSON.stringify({ data: base64EncodedImage }),
        headers: { "Content-type": "application/json" }
      });
      this.setState({ previewSource: "" });
    } catch (err) {
      console.error(err);
    }
  };

  fetchMedias() {
    this.setState({ isLeftLoading: true });
    const requestBody = {
      query: `
        query {
          medias {
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

    fetch("http://localhost:8000/graphql", {
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
        const medias = resData.data.medias.reverse();
        this.setState({
          medias: medias,
          isLeftLoading: false,
          prevIsGetImage: medias[0].media_url
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

    fetch("http://localhost:8000/graphql", {
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
                />
                {this.state.myData !== "" && (
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
