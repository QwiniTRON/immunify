import React from 'react';
import ClearIcon from '@material-ui/icons/Clear';

import "./a2hsbunner.scss";
import { AppButton } from '../AppButton';


type A2hsBunnerProps = {
  onAgree: Function
  onCancel: Function
  onClose: Function
}


export const A2hsBunner: React.FC<A2hsBunnerProps> = ({
  onAgree,
  onCancel,
  onClose,
  ...props
}) => {
  return (
    <div className="a2hs" onClick={(e) => e.target == e.currentTarget && onClose()} {...props}>
      <div className="content">
        <div className="closer" onClick={(e) => onClose()}><ClearIcon /></div>

        <div className="content__body">
          <div className="content__text">Хотите добавить приложение на главную страницу?</div>

          <div className="content__btns">
            <AppButton appColor="linear" onClick={() => onAgree()}>Добавить</AppButton>
            <AppButton color="default" onClick={() => onCancel()}>Отказаться</AppButton>
          </div>
        </div>
      </div>
    </div>
  );
};