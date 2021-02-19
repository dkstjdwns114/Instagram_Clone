import React from "react";

import TimelineItem from "./TimelineItem/TimelineItem";

const timelineList = (props) => {
  const medias = props.medias.map((media) => {
    return (
      <TimelineItem
        mediaId={media._id}
        mediaUrl={media.media_url}
        mediaCaption={media.media_caption}
        mediaLiked={media.likeds}
        commentCnt={media.commentTexts.length}
        creatorId={media.creator._id}
        creatorProfile={media.creator.profile_pic_url}
        creatorName={media.creator.username}
        userId={props.authUserId}
      />
    );
  });
  return (
    <div className="contents_left">
      <div class="inner">
        <ul className="feeds_list">{medias}</ul>
      </div>
    </div>
  );
};

export default timelineList;
