import React from 'react';
import {Link} from 'react-router-dom';

import { AppButtonProps, AppButton } from '../AppButton';


interface AppLinkButtonProps extends AppButtonProps {
    to: any
    disabled?: boolean
}

const AppLinkButton: React.FC<AppLinkButtonProps> = (props) => {
    return (
        <AppButton {...props} component={Link} />
    )
}

const Memoized = React.memo(AppLinkButton);

export {Memoized as AppLinkButton};