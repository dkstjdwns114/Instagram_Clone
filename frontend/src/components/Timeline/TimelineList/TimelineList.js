import React from "react";

import TimelineItem from "./TimelineItem/TimelineItem";

const TimelineList = (props) => {
  const medias = props.medias.map((media) => {
    return (
      <TimelineItem
        key={media._id}
        mediaId={media._id}
        mediaUrl={media.media_url}
        mediaCaption={media.media_caption}
        mediaLiked={media.likeds}
        mediaDate={media.date}
        comments={media.commentTexts}
        creatorId={media.creator._id}
        creatorProfile={media.creator.profile_pic_url}
        creatorName={media.creator.username}
        userId={props.authUserId}
      />
    );
  });
  return (
    <div className="contents_left">
      <div className="inner">
        <ul className="feeds_list">{medias}</ul>
      </div>
    </div>
  );
};

export default TimelineList;
