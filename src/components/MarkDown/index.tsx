import React from 'react';
import showdown from 'showdown';

import './markdown.scss';



showdown.setOption('strikethrough', true);
showdown.setOption('tables', true);
showdown.setOption('tablesHeaderId', true);
showdown.setOption('tasklists', true);
showdown.setOption('emoji', true);
showdown.setOption('tasklists', true);
showdown.setOption('tablesHeaderId', true);
showdown.setOption('parseImgDimensions', true);


// пример работы с md
// http://demo.showdownjs.com/

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