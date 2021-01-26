import react from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

import './pageLayout.scss';

import { s, sif } from '../../../utils/Styels';
import { BackButton } from '../../BackButton';

type PageLayoutProps = {
    [p: string]: any
    ButtonBackto?: string
    flex?: boolean
}

const useStyle = makeStyles({
    root: {
        padding: 5
    }
});

export const PageLayout: React.FC<PageLayoutProps> = ({
    ButtonBackto,
    children,
    flex,
    ...props
}) => {
    const classes = useStyle(props);

    return (
        <div className={sif({
            ["page-layout"]: true,
            [props.className]: true,
            ['page-anim']: true,
            ['page-layout--flex']: Boolean(flex)
        })}>
            {children}
        </div>
    );
};