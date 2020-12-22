import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


type AppDatePickerProps = {
  changeHandle: (value: number) => void
  value: number
  defaultUnit?: string
}


const useStyles = makeStyles({
  root: {
    display: 'flex'
  },
  block: {
    padding: 25,
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
    borderRadius: 10,
    flexGrow: 1,
    textAlign: 'center',
    maxWidth: 300,
    color: '#646464',
    flexShrink: 1,
    flexBasis: 1
  }
});


type UnitDictionary = {
  [p: string]: {
    text: string,
    add(value: number): number
    subtract(value: number): number
    toSecond(value: number): number
    fromSecond(value: number): number
  }
}
const unitDictionary: UnitDictionary = {
  'month': {
    text: 'мес',
    add(value: number) {
      return value + 1;
    },
    subtract(value: number) {
      value = value - 1
      return value > 0 ? value : 0;
    },
    toSecond(value: number) {
      return value * 30 * 24 * 60 * 60;
    },
    fromSecond(value: number) {
      if (value < 0) return 0;
      return Math.floor(value / 30 / 24 / 60 / 60);
    }
  },
  'year': {
    text: 'год',
    add(value: number) {
      return value + 1;
    },
    subtract(value: number) {
      value = value - 1
      return value > 0 ? value : 0;
    },
    toSecond(value: number) {
      return value * 365 * 24 * 60 * 60;
    },
    fromSecond(value: number) {
      if (value < 0) return 0;
      return Math.floor(value / 365 / 24 / 60 / 60);
    }
  }
}
export const AppDatePicker: React.FC<AppDatePickerProps> = ({ changeHandle, value, defaultUnit }) => {
  const [unit, setUnit] = useState(defaultUnit ?? 'month');
  const clasess = useStyles();
  const units = Object.keys(unitDictionary);
  const currentValue = unitDictionary[unit].fromSecond(value);

  return (
    <Box className={clasess.root}>
      <Box className={clasess.block} mr={2}>
        <Box><ExpandLessIcon onClick={() => {
          const unitDictionaryOptions = unitDictionary[unit];
          const newValue = unitDictionaryOptions.add(currentValue);
          changeHandle(unitDictionaryOptions.toSecond(newValue));
        }} /></Box>

        <Box fontSize={36} fontWeight={500}>{currentValue}</Box>

        <Box><ExpandMoreIcon onClick={() => {
          const unitDictionaryOptions = unitDictionary[unit];
          const newValue = unitDictionaryOptions.subtract(currentValue);
          changeHandle(unitDictionaryOptions.toSecond(newValue));
        }} /></Box>
      </Box>


      <Box className={clasess.block}>
        <Box>
          <ExpandLessIcon onClick={() => {
            const currentUnitPosition = units.indexOf(unit);
            const nextUnitPosition = currentUnitPosition + 1;
            const nextUnit = units.length > nextUnitPosition ? units[nextUnitPosition] : units[Math.abs(units.length - nextUnitPosition)];
            changeHandle(0);
            setUnit(nextUnit);
          }} />
        </Box>

        <Box fontSize={36} fontWeight={500}>{unitDictionary[unit].text}</Box>

        <Box><ExpandMoreIcon onClick={() => {
          const currentUnitPosition = units.indexOf(unit);
          const nextUnitPosition = currentUnitPosition - 1;
          const nextUnit = nextUnitPosition >= 0 ? units[nextUnitPosition] : units[units.length + nextUnitPosition];
          changeHandle(0);
          setUnit(nextUnit);
        }} /></Box>
      </Box>
    </Box>
  );
};