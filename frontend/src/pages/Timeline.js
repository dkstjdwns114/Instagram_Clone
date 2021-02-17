import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import TimelineList from "../components/Timeline/TimelineList/TimelineList";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import "./Timeline.css";

class TimelinePage extends Component {
  state = {
    creating: false,
    medias: [],
    isLoading: false,
    selectedLikeMedia: null,
    selectedCommentMedia: null
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.imagesElRef = React.createRef();
    this.captionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchMedias();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const images = this.imagesElRef.current.value;
    const caption = this.captionElRef.current.value;

    if (images.trim().length === 0) {
      return;
    }

    const post = { images, caption };
    console.log(post);

    const requestBody = {
      query: `
        mutation {
          createMedia(mediaInput: {media_url: "${images}", media_caption: "${caption}"}) {
            _id
            media_url
            media_caption
            date
            creator {
              _id
              username
            }
          }
        }
      `
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
        this.setState((prevState) => {
          const updatedMedias = [...prevState.medias];
          updatedMedias.push({
            _id: resData.data.createMedia._id,
            media_url: resData.data.createMedia.media_url,
            media_caption: resData.data.createMedia.media_caption,
            date: resData.data.createMedia.date,
            creator: {
              _id: this.context.userId,
              username: resData.data.createMedia.creator.username
            },
            commentTexts: [],
            likeds: []
          });
          return { medias: updatedMedias };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({
      creating: false,
      selectedLikeMedia: null,
      selectedCommentMedia: null
    });
  };

  fetchMedias() {
    this.setState({ isLoading: true });
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
            }
            commentTexts {
              _id
              media_comment
              date
              creator {
                username
              }
            }
            likeds {
              user {
                username
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
        const medias = resData.data.medias;
        this.setState({ medias: medias, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  showLikeDetailHandler = (mediaId) => {
    this.setState((prevState) => {
      const selectedLikeMedia = prevState.medias.find((e) => e._id === mediaId);
      return { selectedLikeMedia: selectedLikeMedia };
    });
  };

  showCommentDetailHandler = (mediaId) => {
    this.setState((prevState) => {
      const selectedCommentMedia = prevState.medias.find(
        (e) => e._id === mediaId
      );
      return { selectedCommentMedia: selectedCommentMedia };
    });
  };

  saveMediaHandler = () => {};

  likeMediaHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedLikeMedia: null });
      return;
    }
    const requestBody = {
      query: `
        mutation {
          likedMedia(mediaId: "${this.state.selectedLikeMedia._id}") {
            _id
          }
        }
      `
    };

    fetch("http://localhost:8000/graphql", {
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
        this.setState({ selectedLikeMedia: null });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <>
        {this.state.creating && <Backdrop />}
        {this.state.creating && (
          <Modal
            title="Add Post"
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.modalConfirmHandler}
            confirmText={this.context.token ? "Save" : "Confirm"}
          >
            <form>
              <div className="form-control">
                <label htmlFor="images">사진</label>
                <input type="text" id="images" ref={this.imagesElRef} />
              </div>
              <div className="form-control">
                <label htmlFor="caption">설명</label>
                <textarea id="caption" rows="4" ref={this.captionElRef} />
              </div>
            </form>
          </Modal>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>게시물을 작성해보세요!!</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              게시물 작성
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <TimelineList
            medias={this.state.medias}
            authUserId={this.context.userId}
            onLikeDetail={this.showLikeDetailHandler}
            onCommentDetail={this.showCommentDetailHandler}
          />
        )}
      </>
    );
  }
}

export default TimelinePage;
