import React from "react";
import { Link } from "react-router-dom";
import { Image } from "cloudinary-react";

const postItem = (props) => {
  return (
    <li key={props.mediaId}>
      <Link to={"/p/" + props.mediaId}>
        <div className="board_img">
          <Image
            version="1613990153"
            key={props.mediaId}
            cloudName="anstagram123"
            publicId={props.mediaUrl}
            crop="pad"
            width="293"
            height="293"
          />
        </div>
      </Link>
    </li>
  );
};

export default postItem;
