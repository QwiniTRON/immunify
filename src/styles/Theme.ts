import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { PaletteColor } from '@material-ui/core/styles/createPalette';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    mainColor: PaletteColor
    backColor: PaletteColor
  }
  
  interface ThemeOptions {
    colors: {
      mainColor?: PaletteColor
      backColor?: PaletteColor
      mainColor2?: PaletteColor
    }
  }
}

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

const backColor: PaletteColor = {
  main: '#E5E5E5',
  contrastText: '',
  dark: '',
  light: ''
}

const mainColor2: PaletteColor = {
  main: '#67CDFD',
  contrastText: '#67CDFD',
  dark: '#47ADDD',
  light: '#87EDFD'
}

export const mainTheme = createMuiTheme({
  palette: {
    primary: accentColor,
  },

  colors: {
    mainColor,
    backColor,
    mainColor2,
  }
});