import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


type AppRadioButtonProps = {
  [p: string]: any
  value: string
  text: string
  checked?: boolean
}


const useStyles = makeStyles({
  root: {

  },
  input: {

  }
});


export const AppRadioButton: React.FC<AppRadioButtonProps> = ({ text, ...props }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div>{text}</div>
      <input className={classes.input} type="radio" {...props} />
    </div>
  );
};