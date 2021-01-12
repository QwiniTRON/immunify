import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { s } from '../../../utils/Styels';
import { CardLink } from '../CardLink';

type VaccineCardProps = {
  vaccine: {
    id: number
    name: string
    date: string
    detailed: string
  }

  status: 'green' | 'red' | 'yellow'
}


const useStyles = makeStyles({
  "green": {
    color: '#9BC83F'
  },

  "yellow": {
    color: '#FFB800'
  },

  "red": {
    color: '#FF003D'
  },
});



export const VaccineCard: React.FC<VaccineCardProps> = ({
  vaccine,
  status
}) => {
  const classes = useStyles();

  return (
    <CardLink to={`/vaccination/${vaccine.id}`} title="">
      <Box fontWeight={500} fontSize={18}>
        {vaccine.name}
      </Box>

      <Box fontWeight={300}>
        полиомиелит
      </Box>

      <Box className={s((classes as any)[status])}>
        {vaccine.date}
      </Box>
    </CardLink>
  );
};