import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { } from '@material-ui/core';
import { Link } from 'react-router-dom';


type InfoCardData = {
  title: string
  description: string
}
type InfoCardProps = {
  data: InfoCardData[]
  detailText: string
  to: string

  [p: string]: any
}


const useStyles = makeStyles({
  root: {
    padding: 15,
    position: 'relative',
    paddingBottom: 45,
    borderRadius: 10
  },

  link: {
    fontSize: 18,
    color: 'unset',
    textDecoration: 'none',
    position: 'absolute',
    right: 5,
    bottom: 0,
    padding: 10,
    display: 'flex'
  },

  linkArrow: {
    color: '#fff',
    verticalAlign: 'middle',
    fontSize: 16
  },

  arrowCircle: {
    height: 30,
    width: 30,
    backgroundColor: '#9BC83F',
    borderRadius: 15,
    textAlign: 'center',
    lineHeight: '28px',
    marginLeft: 6
  }
});


export const InfoCard: React.FC<InfoCardProps> = ({
  data,
  detailText,
  to,
  ...props
}) => {
  const classes = useStyles(props);

  return (
    <Paper className={classes.root} elevation={3}>
      {
        data.map((item, idx) => (
          <Box fontSize={18} mb={5} key={idx}>
            <Box fontWeight={500}>{item.title}</Box>
            <Box fontWeight={300}>{item.description}</Box>
          </Box>
        ))
      }

      <Link className={classes.link} to={to}>{detailText}

        <div className={classes.arrowCircle}>
          <ArrowForwardIosIcon className={classes.linkArrow} />
        </div>
      </Link>
    </Paper>
  );
};