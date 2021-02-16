import React from "react";

const postDetailView = (props) => {
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
              src="https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-19/s320x320/131994802_214284176856542_767716126641019031_n.jpg?_nc_ht=scontent-ssn1-1.cdninstagram.com&_nc_ohc=PDorBUdEWtwAX9sYsr4&tp=1&oh=cf29f6436cf30c756daf0b3772249b4e&oe=60534882"
              alt="gllcollege's profile picture"
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
            {props.comments.map((comment, idx) => {
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
  );
};

export default postDetailView;
