import React from 'react';
import { useRouteMatch} from 'react-router-dom';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import './memberinfo.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { RootState } from '../../store';
import { User } from '../../store/types';
import {AppButtonGroup} from '../../components/UI/ButtonGroup';
import { AppButton } from '../../components/UI/AppButton';

type MemberInfoParams = {
    id: string
}

interface MemberInfoProps {
    user: User | null
};

const MemberInfo: React.FC<MemberInfoProps> = ({
    user
}) => {
    const id = useRouteMatch<MemberInfoParams>().params?.id;
    let allUsers = [user, ...user?.family!];
    let selectedUser = allUsers.find((u) => u?.name == id);
    
    return (
        <PageLayout className="member-page">
           <Typography>{selectedUser?.name}</Typography>
           <Typography>{selectedUser?.age}</Typography>

           <AppButtonGroup floated>
               <AppButton>сохранить</AppButton>
               <AppButton color="secondary">выбрать</AppButton>
               <AppButton color="default">удалить</AppButton>
           </AppButtonGroup>
        </PageLayout>
    );
};

const mapStatetoProps = (state: RootState) => ({
    user: state.user.user
});
const mapDispatchToProps = {};
const connectedMemberInfo = connect(mapStatetoProps, mapDispatchToProps)(MemberInfo);
export { connectedMemberInfo as MemberInfo };