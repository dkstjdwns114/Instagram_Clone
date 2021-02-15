import React, { Component } from "react";
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
    date: null
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
        console.log(media);
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

  render() {
    console.log(this.state.creatorname);
    return (
      <>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <article className="social-article">
            <div className="social-left-col">
              <div className="social-img-wrap">
                <img
                  className="social-img"
                  src={this.state.media_url}
                  alt={this.state.media_url}
                />
              </div>
            </div>
            <div className="social-right-col">
              <div className="social-header">
                <a href="/gllcollege/" className="social-profile-img">
                  <img
                    src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s320x320/131994802_214284176856542_767716126641019031_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=PDorBUdEWtwAX9sYsr4&tp=1&oh=cf29f6436cf30c756daf0b3772249b4e&oe=60534882"
                    alt="gllcollege's profile picture"
                  />
                </a>
                <div className="social-follow">
                  <a
                    title="gllcollege"
                    href="/gllcollege/"
                    className="social-name"
                  >
                    {this.state.creatorname}
                  </a>
                  <span className="SPAN_13">•</span>
                  <button type="button">Follow</button>
                </div>
              </div>
              <div className="social-header">
                <span>{this.state.media_caption}</span>
              </div>
              <div className="social-comments-wrap">
                <div className="social-post">
                  {this.state.comments.map((comment, idx) => {
                    return (
                      <div key={idx} className="social-header">
                        <a href="/gllcollege/" className="social-profile-img">
                          <img
                            src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s320x320/93220711_3143709632340205_7652637101535526912_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=Jw8owoE_3kEAX8tlHZD&tp=1&oh=d398d00901eda38513c1bf88ab571022&oe=6052768E"
                            alt="gllcollege's profile picture"
                          />
                        </a>
                        <div className="social-copy">
                          <span className="social-name">
                            {comment.creator.username}
                          </span>
                          <span className="social-post-copy">
                            {comment.media_comment}
                          </span>
                          <time>123123</time>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="social-icons">
                  <section className="icons-section">
                    <button className="icons-button" onClick={this.likeHandler}>
                      {!this.state.isLiked ? (
                        <span className="icon1"></span>
                      ) : (
                        <span className="liked"></span>
                      )}
                    </button>
                    <button
                      className="icons-button"
                      onClick={this.commentFocus}
                    >
                      <span className="icon2"></span>
                    </button>
                    <button className="icons-button" onClick={this.saveHandler}>
                      {!this.state.isSaved ? (
                        <span className="icon4"></span>
                      ) : (
                        <span className="saved"></span>
                      )}
                    </button>
                  </section>
                  <div className="likes-wrap">
                    <span>16</span> likes
                  </div>
                </div>
                <div className="social-date">
                  <time>April 18</time>
                </div>
                <div className="comment-add">
                  <form>
                    <input
                      type="text"
                      id="commentarea"
                      placeholder="Add a comment..."
                    />
                    <input type="button" className="btn" value="SUBMIT" />
                  </form>
                </div>
              </div>
            </div>
          </article>
        )}
      </>
    );
  }
}

export default PostDetail;
