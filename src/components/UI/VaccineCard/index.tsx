import React, { useState, useRef, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { s, sif } from '../../../utils/Styels';
import { useExpanded } from '../../../hooks/expand';
import { AppButton } from '../AppButton';
import DoneIcon from '@material-ui/icons/Done';
import { Link } from 'react-router-dom';

type VaccineCardProps = {
  vaccine: {
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
  root: {
    overflow: 'hidden',
    boxShadow: '1px 0px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    position: 'relative',
    transition: 'height 0.3s',
    padding: 16,
    paddingBottom: 48
  },

  arrow: {
    position: 'absolute',
    left: 0,
    right: 0,
    margin: '0 auto',
    bottom: 0,
    transition: 'transform 0.3s',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    height: 45,
    width: 45
  },

  arrow__rotate: {
    transform: 'rotateZ(180deg)'
  },

  content: {
    transition: 'opacity 0.3s'
  },

  cardButton: {
    fontSize: 14
  },

  statusIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    border: '1px solid',
    borderRadius: 30,
    fontSize: 30,
    color: '#9BC83F'
  },

  badIcon: {
    color: '#FF003D',
    display: 'block',
    width: 30,
    height: 30,
    lineHeight: '30px',
    textAlign: 'center'
  },

  linkButton: {
    textDecoration: 'none'
  }
});


export const VaccineCard: React.FC<VaccineCardProps> = ({
  vaccine,
  status
}) => {
  const clases = useStyles();
  const [componentRef, expandHandle, isOpen, height] = useExpanded(70);
  let StatusIcon = <DoneIcon className={clases.statusIcon} />
  if (status == 'bad') StatusIcon = <div className={s(clases.badIcon, clases.statusIcon)}>!</div>

  return (
    <div
      ref={componentRef}
      className={sif({ [clases.root]: true })}
      style={{
        height: height
      }}
    >
      <Box fontSize={18} fontWeight={500}>
        {vaccine.name}
      </Box>

      <div style={{ opacity: isOpen ? 1 : 0 }} className={clases.content}>
        <Box fontSize={18} fontWeight={500} color="#acacac" mb={2} >
          {vaccine.for}
        </Box>

        {vaccine.stadies.map((stady, index) => (
          <div key={stady[0].name + "main" + index.toString()}>
            {
              stady.map((item) => (
                <Box display="inline-block"
                  borderRadius={10}
                  p={2}
                  bgcolor={item.isVaccined ? '#9BC83F' : '#acacac'}
                  m={1}
                  fontSize={18}
                  key={item.name}>
                  {item.name}
                </Box>
              ))
            }
          </div>

        ))}

        <Box>{vaccine.date}</Box>

        <Box mt={2} display="flex" justifyContent="space-between">
          {/* <AppButton className={clases.cardButton} appColor="white">
            Мне стало плохо
          </AppButton> */}
          <Link className={clases.linkButton} to={`/passport/take`}>
            <AppButton className={clases.cardButton}>
              Записаться
            </AppButton>
          </Link>
        </Box>
      </div>

      {StatusIcon}

      <KeyboardArrowDownIcon
        classes={{ root: sif({ [clases.arrow]: true, [clases.arrow__rotate]: isOpen }) }}
        onClick={() => expandHandle()}
      />
    </div>
  );
};