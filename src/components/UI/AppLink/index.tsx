import React from 'react';
import { Link } from 'react-router-dom';

import c from './applink.module.scss';

type AppLinkProps = {
    to: string
}

export const AppLink: React.FC<AppLinkProps> = ({ children, to }) => {
    return (
        <Link className={c['app-link']} to={to}>{children}</Link>
    );
}