import React, { useState, useRef, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { s, sif } from '../../../utils/Styels';
import { useExpanded } from '../../../hooks/expand';
import { AppButton } from '../AppButton';
import DoneIcon from '@material-ui/icons/Done';
import { Link } from 'react-router-dom';
import { CardLink } from '../CardLink';


enum StatusColors {
  green = "green",
  orange = "orange",
  red = "red"
}

type VaccineCardProps = {
  vaccine: {
    id: number
    name: string
    for: string
    date: string
    stadies: {
      name: string,
      isVaccined: boolean
    }[][]
  }

  status: 'ok' | 'bad'
}


const useStyles = makeStyles({
  "green": {
    color: '#9BC83F'
  },

  "orange": {
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

  let statusColor = StatusColors.green;
  if(status == 'bad') statusColor = StatusColors.red;

  return (
    <CardLink to={`/vaccination/${vaccine.id}`} title="">
      <Box fontWeight={500} fontSize={18}>
        {vaccine.name}
      </Box>

      <Box fontWeight={300}>
        полиомиелит
      </Box>

      <Box className={s((classes as any)[statusColor])}>
        {vaccine.date}
      </Box>
    </CardLink>
  );
};