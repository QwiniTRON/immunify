import React from 'react';
import ClearIcon from '@material-ui/icons/Clear';

import './appmodal.scss';


type AppModalProps = {
  onClose: Function
}


export const AppModal: React.FC<AppModalProps> = ({
  children,
  onClose
}) => {
  return (
    <div className='app-modal'>
      <div className="app-modal__overlay" onClick={() => onClose()} />

      <div className="app-modal__content">
        <ClearIcon className="app-modal__closer" onClick={() => onClose()} />

        {children}
      </div>
    </div>
  );
};