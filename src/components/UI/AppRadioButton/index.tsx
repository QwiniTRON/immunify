import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { sif } from '../../../utils/Styels';


type AppRadioButtonProps = {
  [p: string]: any
  value: string
  checked?: boolean
  component: React.ReactElement | JSX.Element
  text?: string
}


const useStyles = makeStyles({
  root: {
    display: 'inline-block',
    padding: 15,
    boxShadow: '1px 0px 5px rgba(0, 0, 0, 0.2)',
    position: 'relative',
    textAlign: 'center',
    cursor: 'pointer',
    width: 100,
    height: 100,
    borderRadius: 50
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
    boxShadow: '1px 0px 10px 0 #9BC83F',
  },

  labelContainer: {
    textAlign: 'center'
  },

  text: {
    fontSize: 18,
    fontWeight: 300,
    color: "#ACACAC"
  }
});


export const AppRadioButton: React.FC<AppRadioButtonProps> = ({ text, component, ...props }) => {
  const classes = useStyles(props);

  return (
    <label className={classes.labelContainer}>
      <div className={sif({ [classes.root]: true, [classes._checked]: Boolean(props.checked) })}>
        {component}
        <input className={classes.input} type="radio" {...props} />
      </div>
      <div className={classes.text}>
        {text}
      </div>
    </label>
  );
};