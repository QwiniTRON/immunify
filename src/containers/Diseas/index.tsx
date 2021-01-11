import react, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import './diseas.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { Loader } from '../../components/UI/Loader';
import { Layout } from '../../components/Layout/Layout';
import { AppButtonGroup } from '../../components/UI/ButtonGroup';
import { BackButton } from '../../components/BackButton';
import { useServer } from '../../hooks/useServer';
import { GetDetailedDisease, Vaccine } from '../../server';
import { version } from 'react-dom';
import { AppLinkButton } from '../../components/UI/AppLinkButton';
import { CircleLoader } from '../../components/UI/CircleLoader';



type DiseasRoutParams = {
    id: string
}

type DiseasProps = {

}

const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 24,
        fontWeight: 500,
        margin: '10px 0',
        color: '#67CDFD'
    },

    menuButton: {
        display: 'block',
        fontSize: 14,

        '& svg': {
            fontSize: 32
        }
    },

    vaccineLink: {
        color: '#000',
        fontSize: 18,
        fontWeight: 400
    },
}));

type Diseas = {
    detailed: string
    id: number
    name: string
    signs: string
    vaccines: Vaccine[]
}


export const Diseas: React.FC<DiseasProps> = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const id = useRouteMatch<DiseasRoutParams>().params.id;

    const diseasReq = useServer(GetDetailedDisease);
    const loading = diseasReq.state.fetching;
    const success = !loading && diseasReq.state.answer.succeeded;
    const [diseas, setDiseas] = useState<Diseas | null>(null);

    const [openAbout, setOpenAbout] = useState(false);
    const [openVaccines, setOpenVaccines] = useState(false);
    const [openSigns, setOpenSigns] = useState(false);

    // загрузка информации по болезни
    useEffect(() => {
        diseasReq.fetch({ diseaseId: Number(id) });
    }, []);

    // успешная загрузка данных болезни
    useEffect(() => {
        if (success && diseasReq.state.answer?.data !== undefined) {
            setDiseas(diseasReq.state.answer.data);
        }
    }, [success]);


    /**
     * обработка клика кнопки "я привит"
     */
    const takeHandle = () => {
        history.push('/vaccination/add');
    }

    // если данных по болезни не нашлось
    if (!loading && !success) return (
        <Layout title="" BackButtonCustom={<BackButton text="Вернуться к иммунному паспорту" />}>
            <PageLayout className="diseas-page">
                <h3 className={classes.title}>Такой болезни не нашлось</h3>
                <Link to={`/profile`} >в профиль</Link>
            </PageLayout>
        </Layout>
    );


    return (
        <Layout title="" BackButtonCustom={<BackButton text="Вернуться к иммунному паспорту" />} >
            <PageLayout className="diseas-page">

                {loading && <Box textAlign="center"><CircleLoader /></Box>}

                {!loading &&
                    <>
                        <Box mb={2} display="grid" justifyContent="space-between" gridAutoFlow="column" alignItems="center">
                            <Box component="h3" className={classes.title}>
                                {diseas?.name}
                            </Box>

                            <IconButton
                                classes={{ label: classes.menuButton }}
                                disabled={loading}
                                onClick={takeHandle}
                                color="primary"
                            >
                                <AddIcon />
                                <div>Уже привит</div>
                            </IconButton>
                        </Box>

                        <Box mb={2}>
                            Mark down
                        </Box>

                        <Box>
                            <Box fontSize={18} fontWeight={300}>Вакцины:</Box>
                            {
                                diseas?.vaccines.map((vaccine) => (
                                    <Box key={vaccine.id} m={1}>
                                        <Link
                                            className={classes.vaccineLink}
                                            to={{
                                                pathname: `/passport/vaccine/${vaccine.id}`,
                                                state: vaccine
                                            }}
                                        >
                                            {vaccine.name}
                                        </Link>
                                    </Box>
                                ))
                            }
                        </Box>
                    </>
                }


                <AppLinkButton
                    disabled={loading}
                    to={{
                        pathname: `/passport/take`,
                        state: { type: 'diseas', data: diseas }
                    }}
                    floated
                > Записаться
                </AppLinkButton>
            </PageLayout>
        </Layout>
    );
};