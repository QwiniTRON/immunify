import React from 'react';

import './submenucontainer.scss';


type SubMenuContainerProps = {}


export const SubMenuContainer: React.FC<SubMenuContainerProps> = ({
  children
}) => {
  return (
    <div className="sub-menu">
      {children}
    </div>
  );
};