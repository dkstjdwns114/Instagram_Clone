import React, { Component } from "react";
import Backdrop from "../components/Backdrop/Backdrop";
import LikeModal from "../components/Modal/LikeModal";
import PostDetailView from "../components/PostDetail/PostDetailView";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";

import "./PostDetail.css";

class PostDetail extends Component {
  state = {
    mediaId: this.props.match.params.id,
    comments: [],
    likeds: [],
    creatorname: null,
    isLoading: false,
    isLiked: false,
    isSaved: false,
    media_caption: null,
    media_url: null,
    date: null,
    isModal: false,
    likedId: null,
    savedId: null
  };

  static contextType = AuthContext;

  componentDidMount() {
    this.fetchMedias();
  }

  fetchMedias() {
    this.setState({ isLoading: true });
    let userId = localStorage.getItem("userId");
    const requestBody = {
      query: `
      query {
        media(mediaId: "${this.state.mediaId}"){
          _id
          media_url
          media_caption
          date
          creator {
            username
          }
          commentTexts {
            creator {
              username
            }
            date
            media_comment
          }
          likeds {
            user {
              username
            }
          }
        }
        isLike(mediaId: "${this.state.mediaId}", userId: "${userId}"){
          _id
        }
        isSave(mediaId: "${this.state.mediaId}", userId: "${userId}"){
          _id
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
        const media = resData.data.media;
        this.setState({
          comments: media.commentTexts,
          likeds: media.likeds,
          isLoading: false,
          creatorname: media.creator.username,
          media_caption: media.media_caption,
          media_url: media.media_url,
          date: media.date,
          isLiked: resData.data.isLike,
          isSaved: resData.data.isSave
        });
        if (resData.data.isLike) {
          this.setState({ likedId: resData.data.isLike._id });
        }
        if (resData.data.isSave) {
          this.setState({ savedId: resData.data.isSave._id });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  getLikedId = () => {
    let userId = localStorage.getItem("userId");
    const requestBody = {
      query: `
        query {
          isLike(mediaId: "${this.state.mediaId}", userId: "${userId}"){
            _id
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
        if (resData.data.isLike) {
          this.setState({ likedId: resData.data.isLike._id });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getSavedId = () => {
    let userId = localStorage.getItem("userId");
    const requestBody = {
      query: `
        query {
          isSave(mediaId: "${this.state.mediaId}", userId: "${userId}"){
            _id
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
        this.setState({ savedId: resData.data.isSave._id });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  likeMediaHandler = () => {
    this.setState({
      isLiked: !this.state.isLiked
    });
    if (!this.state.isLiked) {
      const requestBody = {
        query: `
          mutation {
            likedMedia(mediaId: "${this.state.mediaId}") {
              _id
              user {
                username
              }
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
          this.setState({ likedId: resData.data.likedMedia._id });
          this.setState((prevState) => {
            const updatedLikeds = [...prevState.likeds];
            updatedLikeds.push({
              user: {
                username: resData.data.likedMedia.user.username
              }
            });
            return { likeds: updatedLikeds };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.getLikedId();
      const requestBody = {
        query: `
          mutation {
            cancelLiked(likedId: "${this.state.likedId}"){
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
          this.setState((prevState) => {
            const currentLikeds = [...prevState.likeds];
            currentLikeds.pop();
            return { likeds: currentLikeds };
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  saveMediaHandler = () => {
    this.setState({
      isSaved: !this.state.isSaved
    });
    if (!this.state.isSaved) {
      const requestBody = {
        query: `
          mutation {
            savedMedia(mediaId: "${this.state.mediaId}") {
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
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      this.getSavedId();
      const requestBody = {
        query: `
          mutation {
            cancelSaved(savedId: "${this.state.savedId}"){
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
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  commentFocus = () => {
    document.getElementById("commentarea").focus();
  };

  likeModal = () => {
    this.setState({ isModal: true });
  };

  modalCloseHandler = () => {
    this.setState({ isModal: false });
  };

  convertTime = (date) => {
    let s;
    let timestamp = date * 1;
    let d = new Date(timestamp);
    let now = new Date();

    d.getFullYear() === now.getFullYear()
      ? (s =
          this.leadingZeros(d.getMonth() + 1, 2) +
          "월 " +
          this.leadingZeros(d.getDate(), 2) +
          "일")
      : (s =
          this.leadingZeros(d.getFullYear(), 4) +
          "년 " +
          this.leadingZeros(d.getMonth() + 1, 2) +
          "월 " +
          this.leadingZeros(d.getDate(), 2) +
          "일");

    return s;
  };

  leadingZeros = (n, digits) => {
    let zero = "";
    n = n.toString();

    if (n.length < digits) {
      for (let i = 0; i < digits - n.length; i++) zero += "0";
    }
    return zero + n;
  };
  render() {
    return (
      <>
        {this.state.isModal && (
          <LikeModal
            likes={this.state.likeds}
            onClose={this.modalCloseHandler}
          />
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <>
            <PostDetailView
              media_url={this.state.media_url}
              creator_name={this.state.creatorname}
              media_caption={this.state.media_caption}
              comments={this.state.comments}
              commentFocus={this.commentFocus}
              saveHandler={this.saveMediaHandler}
              likeHandler={this.likeMediaHandler}
              isLiked={this.state.isLiked}
              isSaved={this.state.isSaved}
              likeds={this.state.likeds}
              likeModal={this.likeModal}
              date={this.convertTime(this.state.date)}
              mediaId={this.state.mediaId}
              contextToken={this.context.token}
              convertTime={this.convertTime}
            />
            {this.state.isModal && <Backdrop />}
          </>
        )}
      </>
    );
  }
}

export default PostDetail;
