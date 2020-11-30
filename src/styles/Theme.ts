import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { PaletteColor } from '@material-ui/core/styles/createPalette';

const accentColor: PaletteColor = {
  main: '#9BC83F',
  contrastText: '',
  dark: '',
  light: ''
}

const mainColor: PaletteColor = {
  main: '#E5E5E5',
  contrastText: '',
  dark: '',
  light: ''
}

export const mainTheme = createMuiTheme({
  palette: {
    primary: accentColor,
  }
});