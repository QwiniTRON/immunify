import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { s } from '../../../utils';

type DividerColors = "gray" | "green"

type DividerProps = {
  color?: DividerColors
}

const useStyles = makeStyles({
  divider: {
    height: 1,
    margin: '10px 0'
  },

  green: {
    backgroundColor: '#E0F0BE',
  },

  gray: {
    backgroundColor: '#DADADA',
  }
});

export const Divider: React.FC<DividerProps> = ({
  color = "green"
}) => {
  const classes = useStyles();

  return (
    <div className={s(classes.divider, classes[color] )}></div>
  );
};