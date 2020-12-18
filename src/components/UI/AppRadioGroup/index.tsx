import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { AppRadioButton } from '../AppRadioButton';


type AppRadioGroupProps = {
  [p: string]: any
  onChange: Function
  value: string | number
}


export const AppRadioGroup: React.FC<AppRadioGroupProps> = ({ onChange, value, ...props }) => {
  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue: string = e.target.value;

    onChange.call(null, inputValue);
  }

  const patchedRadio = React.Children.map(props.children, (e: any) => {

    if (React.isValidElement(e) && e.type == AppRadioButton) {
      const elem: React.ReactElement<any> = e as any;
      return React.cloneElement(elem, { checked: elem.props.value == value, onChange: changeHandle });
    } else {
      return null;
    }
  });

  return (
    <>
      { patchedRadio}
    </>
  );
};