import React from 'react';
import showdown from 'showdown';

import './markdown.scss';


type MarkDownProps = {
  md: string
}

export const MarkDown: React.FC<MarkDownProps> = ({
  md
}) => {
  const html = new showdown.Converter().makeHtml(md);

  return (
    <div className="markdown" dangerouslySetInnerHTML={{__html: html}} />
  );
};