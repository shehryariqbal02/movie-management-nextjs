import React from 'react'
import mediaCard from "@/styles/MediaCard.module.scss";

/**
 *
 * @param media
 * @returns {Element}
 * @constructor
 */
export const MediaCard = ({media}) => {
    return (
       <div className={mediaCard.mediaCard} key={media?.id}>
          <div className={mediaCard.mediaCard__img} style={{backgroundImage: `url(${media?.image})`}}></div>
           <div className={mediaCard.mediaCard__title}>{media?.name}</div>
           <div className={mediaCard.mediaCard__desc}>{media?.published_date}</div>
       </div>
    )
}
