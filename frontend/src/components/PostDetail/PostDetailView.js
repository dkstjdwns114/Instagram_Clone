import React, { useState, useEffect } from "react";
import { Image } from "cloudinary-react";
import { Link } from "react-router-dom";

const PostDetailView = (props) => {
  const [commentareaElRef, setCommenttextElRef] = useState(null);
  const [token, setAccessToken] = useState(null);
  const [comments, setComments] = useState([]);
  const [isActiveCommentBtn, setIsActiveCommentBtn] = useState(false);

  useEffect(() => {
    let access_token = localStorage.getItem("access_token");
    setAccessToken(access_token);
    setComments(props.comments);
    setCommenttextElRef(React.createRef());
  }, [props]);

  const commentInputChangeHandler = () => {
    if (commentareaElRef.current.value !== "") {
      setIsActiveCommentBtn(true);
    } else {
      setIsActiveCommentBtn(false);
    }
  };

  const commentMediaHandler = (e) => {
    e.preventDefault();

    let text = commentareaElRef.current.value;

    if (text.trim().length === 0) {
      commentareaElRef.current.value = "";
      return;
    }

    const requestBody = {
      query: `
        mutation CreateComment($mediaId: ID!, $media_comment: String!) {
          createComment(commentInput: {mediaId: $mediaId, media_comment: $media_comment}){
            _id
            creator {
              username
              profile_pic_url
            }
          }
        }
      `,
      variables: {
        mediaId: props.mediaId,
        media_comment: text
      }
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
          ...state,
          {
            creator: {
              username: createCommentUsername,
              profile_pic_url: createCommentUserProfile
            },
            media_comment: text,
            date: new Date().getTime()
          }
        ]);
        commentareaElRef.current.value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <article className="social-article">
      <div className="social-left-col">
        <div className="social-img-wrap">
          <Image
            key={props.mediaId}
            cloudName="anstagram123"
            version="1613990153"
            publicId={props.media_url}
            crop="pad"
            width="650"
            height="650"
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
        <div className="social-comments-wrap">
          <div className="social-post">
            <div className="comment-header">
              <Link
                to={"/profile/" + props.creator_name}
                className="social-profile-img"
              >
                <img
                  src={props.creator_profile}
                  alt={props.creator_name + "님의 프로필 사진"}
                />
              </Link>
              <div className="social-copy">
                <Link to={"/profile/" + props.creator_name}>
                  <span className="social-name">{props.creator_name}</span>
                </Link>
                <span className="social-post-copy">{props.media_caption}</span>
                <time>{props.convertTime(props.date)}</time>
              </div>
            </div>
            {comments.map((comment, idx) => {
              return (
                <div key={idx} className="comment-header">
                  <Link
                    to={"/profile/" + comment.creator.username}
                    className="social-profile-img"
                  >
                    <img
                      src={comment.creator.profile_pic_url}
                      alt={comment.creator.username + "님의 프로필 사진"}
                    />
                  </Link>
                  <div className="social-copy">
                    <Link to={"/profile/" + comment.creator.username}>
                      <span className="social-name">
                        {comment.creator.username}
                      </span>
                    </Link>
                    <span className="social-post-copy">
                      {comment.media_comment}
                    </span>
                    <time>{props.convertTime(comment.date)}</time>
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
            <time>{props.convertTime(props.date)}</time>
          </div>
          <form
            onSubmit={commentMediaHandler}
            className="postdetail_comments_form"
          >
            <div className="input_box">
              <input
                type="text"
                id="commentarea"
                placeholder="Add a comment..."
                ref={commentareaElRef}
                onChange={commentInputChangeHandler}
              />
            </div>
            <div className="button_box">
              {isActiveCommentBtn ? (
                <input
                  type="submit"
                  className="active-comment-btn"
                  value="SUBMIT"
                />
              ) : (
                <input
                  type="submit"
                  className="disabled-comment-btn"
                  value="SUBMIT"
                  disabled="disabled"
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </article>
  );
};

export default PostDetailView;
