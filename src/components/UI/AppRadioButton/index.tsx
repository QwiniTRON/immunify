import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { sif } from '../../../utils/Styels';


type AppRadioButtonProps = {
  [p: string]: any
  value: string
  text: string
  checked?: boolean
}


const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    padding: 15,
    boxShadow: '1px 0px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    position: 'relative',
    textAlign: 'center'
  },
  input: {
    opacity: 0,
    width: 1,
    height: 1,
    position: 'absolute',
    top: 0,
    left: 0
  },
  _checked: {
    boxShadow: '1px 0px 5px #67CDFD',
  }
});


export const AppRadioButton: React.FC<AppRadioButtonProps> = ({ text, ...props }) => {
  const classes = useStyles(props);

  return (
    <label className={sif({ [classes.root]: true, [classes._checked]: Boolean(props.checked) })}>
      <div>{text}</div>
      <input className={classes.input} type="radio" {...props} />
    </label>
  );
};