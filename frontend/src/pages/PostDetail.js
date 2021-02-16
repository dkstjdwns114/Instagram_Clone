import React, { Component } from "react";
import Backdrop from "../components/Backdrop/Backdrop";
import LikeModal from "../components/Modal/LikeModal";
import PostDetailView from "../components/PostDetail/PostDetailView";
import Spinner from "../components/Spinner/Spinner";

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
    isModal: false
  };

  componentDidMount() {
    this.fetchMedias();
  }

  fetchMedias() {
    this.setState({ isLoading: true });
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
            media_comment
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
        const media = resData.data.media;
        this.setState({
          comments: media.commentTexts,
          likeds: media.likeds,
          isLoading: false,
          creatorname: media.creator.username,
          media_caption: media.media_caption,
          media_url: media.media_url,
          date: media.date
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  likeHandler = () => {
    this.setState({
      isLiked: !this.state.isLiked
    });
  };

  saveHandler = () => {
    this.setState({
      isSaved: !this.state.isSaved
    });
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

  render() {
    return (
      <>
        {this.state.isModal && <Backdrop />}
        {this.state.isModal && (
          <LikeModal
            likes={this.state.likeds}
            onClose={this.modalCloseHandler}
          />
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <PostDetailView
            media_url={this.state.media_url}
            creator_name={this.state.creatorname}
            media_caption={this.state.media_caption}
            comments={this.state.comments}
            commentFocus={this.commentFocus}
            saveHandler={this.saveHandler}
            likeHandler={this.likeHandler}
            isLiked={this.state.isLiked}
            isSaved={this.state.isSaved}
            likeds={this.state.likeds}
            likeModal={this.likeModal}
          />
        )}
      </>
    );
  }
}

export default PostDetail;
