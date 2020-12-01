import react from 'react';
import { Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import './pageLayout.scss';

import { s } from '../../../utils/Styels';
import { BackButton } from '../../BackButton';

type PageLayoutProps = {
    [p: string]: any
}

const useStyle = makeStyles({
    root: {
        padding: 5
    }
});

export const PageLayout: React.FC<PageLayoutProps> = (props) => {
    const classes = useStyle(props);

    return (
        <div className={s("page-layout", props.className)}>
            <BackButton />
            <Paper elevation={6} className={s(classes.root, 'page-layout__content')}>
                {props.children}
            </Paper>
        </div>
    );
};