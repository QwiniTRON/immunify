import react from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import './pageLayout.scss';

import { s } from '../../../utils/Styels';
import { BackButton } from '../../BackButton';

type PageLayoutProps = {
    [p: string]: any
    ButtonBackto?: string
}

const useStyle = makeStyles({
    root: {
        padding: 5
    }
});

export const PageLayout: React.FC<PageLayoutProps> = ({
    ButtonBackto,
    children,
    ...props
}) => {
    const classes = useStyle(props);

    return (
        <div className={s("page-layout", props.className, 'page-anim')}>
            <Box zIndex={10} position="sticky" top={0}><BackButton to={ButtonBackto} /></Box>
            <Paper elevation={6} className={s(classes.root, 'page-layout__content')}>
                {children}
            </Paper>
        </div>
    );
};