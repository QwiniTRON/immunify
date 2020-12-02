import react from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

type LoaderProps = {

}

export const Loader: React.FC<LoaderProps> = (props) => {
 return (
  <LinearProgress color="primary" />
 );
};