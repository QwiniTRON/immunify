import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

type DividerProps = {}

const useStyles = makeStyles({
  divider: {
    height: 1,
    backgroundColor: '#E0F0BE',
    margin: '10px 0'
  }
});

export const Divider: React.FC<DividerProps> = (props) => {
  const clasess = useStyles();

  return (
    <div className={clasess.divider}></div>
  );
};