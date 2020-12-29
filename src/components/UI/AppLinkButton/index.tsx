import React from 'react';
import {Link} from 'react-router-dom';

import { AppButtonProps, AppButton } from '../AppButton';


interface AppLinkButtonProps extends AppButtonProps {
    to: any
    disabled?: boolean
}

export const AppLinkButton: React.FC<AppLinkButtonProps> = (props) => {
    return (
        <AppButton component={Link} {...props} />
    )
}