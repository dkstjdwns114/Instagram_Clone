import React, { useState, useEffect } from "react";

const PostDetailView = (props) => {
  const [commentareaElRef, setCommenttextElRef] = useState(null);
  const [token, setAccessToken] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let access_token = localStorage.getItem("access_token");
    setAccessToken(access_token);
    setComments(props.comments.reverse());
    setCommenttextElRef(React.createRef());
  }, []);

  const commentMediaHandler = (e) => {
    e.preventDefault();

    let text = commentareaElRef.current.value;

    if (text.trim().length === 0) {
      commentareaElRef.current.value = "";
      return;
    }

    const requestBody = {
      query: `
        mutation {
          createComment(commentInput: {mediaId: "${props.mediaId}", media_comment: "${text}"}){
            _id
            creator {
              username
              profile_pic_url
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
        let createCommentUsername = resData.data.createComment.creator.username;
        let createCommentUserProfile =
          resData.data.createComment.creator.profile_pic_url;
        setComments((state) => [
          {
            creator: {
              username: createCommentUsername,
              profile_pic_url: createCommentUserProfile
            },
            media_comment: text,
            date: new Date().getTime()
          },
          ...state
        ]);
        commentareaElRef.current.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const commentTimeSet = (date) => {
    let currentTime = new Date().getTime();
    let time = currentTime - Number(date);
    let gapTime = Math.floor(time / 1000);
    let txt;
    if (gapTime < 60) {
      txt = gapTime + "초 전";
    } else if (60 <= gapTime && gapTime < 3600) {
      txt = Math.floor(gapTime / 60) + "분 전";
    } else if (3600 <= gapTime && gapTime < 86400) {
      txt = Math.floor(gapTime / 3600) + "시간 전";
    } else if (86400 <= gapTime && gapTime < 604800) {
      txt = Math.floor(gapTime / 86400) + "일 전";
    } else {
      txt = props.convertTime(date);
    }

    return txt;
  };

  return (
    <article className="social-article">
      <div className="social-left-col">
        <div className="social-img-wrap">
          <img
            className="social-img"
            src={props.media_url}
            alt={props.media_url}
          />
        </div>
      </div>
      <div className="social-right-col">
        <div className="social-header">
          <a href="/gllcollege/" className="social-profile-img">
            <img
              src={props.creator_profile}
              alt={props.creator_name + "님의 프로필 사진"}
            />
          </a>
          <div className="social-follow">
            <a title="gllcollege" href="/gllcollege/" className="social-name">
              {props.creator_name}
            </a>
            <span className="SPAN_13">•</span>
            <button type="button">Follow</button>
          </div>
        </div>
        <div className="social-header">
          <span>{props.media_caption}</span>
        </div>
        <div className="social-comments-wrap">
          <div className="social-post">
            {comments.map((comment, idx) => {
              return (
                <div key={idx} className="social-header">
                  <a href="/gllcollege/" className="social-profile-img">
                    <img
                      src={comment.creator.profile_pic_url}
                      alt={comment.creator.username + "님의 프로필 사진"}
                    />
                  </a>
                  <div className="social-copy">
                    <span className="social-name">
                      {comment.creator.username}
                    </span>
                    <span className="social-post-copy">
                      {comment.media_comment}
                    </span>
                    <time>{commentTimeSet(comment.date)}</time>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="social-icons">
            <section className="icons-section">
              <button className="icons-button" onClick={props.likeHandler}>
                {!props.isLiked ? (
                  <span className="icon1"></span>
                ) : (
                  <span className="liked"></span>
                )}
              </button>
              <button className="icons-button" onClick={props.commentFocus}>
                <span className="icon2"></span>
              </button>
              <button className="icons-button" onClick={props.saveHandler}>
                {!props.isSaved ? (
                  <span className="icon4"></span>
                ) : (
                  <span className="saved"></span>
                )}
              </button>
            </section>
            <div className="likes-wrap" onClick={props.likeModal}>
              <span>{props.likeds.length}</span> likes
            </div>
          </div>
          <div className="social-date">
            <time>{props.date}</time>
          </div>
          <div className="comment-add">
            <form onSubmit={commentMediaHandler}>
              <input
                type="text"
                id="commentarea"
                placeholder="Add a comment..."
                ref={commentareaElRef}
              />
              <input type="submit" className="btn" value="SUBMIT" />
            </form>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostDetailView;
