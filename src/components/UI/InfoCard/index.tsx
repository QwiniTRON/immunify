import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Link } from 'react-router-dom';


type InfoCardData = {
  title: string
  description: string
}
type InfoCardProps = {
  data: InfoCardData[]
  detailText: string
  to: string
}


const useStyles = makeStyles({
  root: {
    padding: 15,
    position: 'relative',
    paddingBottom: 20
  },
  link: {
    fontSize: 18,
    color: 'unset',
    textDecoration: 'none',
    position: 'absolute',
    right: 10,
    bottom: 0,
    padding: 10,
    display: 'block'
  },
  linkArrow: {
    color: '#acacac',
    verticalAlign: 'middle'
  }
});


export const InfoCard: React.FC<InfoCardProps> = ({
  data,
  detailText,
  to
}) => {
  const clasess = useStyles();

  return (
    <Paper className={clasess.root} elevation={3}>
      {
        data.map((item) => (
          <Box fontSize={18} mb={2}>
            <Box fontWeight={500}>{item.title}</Box>
            <Box>{item.description}</Box>
          </Box>
        ))
      }

      <Link className={clasess.link} to={to}>{detailText} <ArrowForwardIosIcon className={clasess.linkArrow} /></Link>
    </Paper>
  );
};