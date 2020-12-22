import react, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import { Link } from 'react-router-dom';

import './diseas.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { Loader } from '../../components/UI/Loader';
import { Layout } from '../../components/Layout/Layout';
import { AppButtonGroup } from '../../components/UI/ButtonGroup';


type DiseasProps = {

}

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
    },
    paper: {
        backgroundColor: '#c4ffc5',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        borderRadius: 5,
        position: 'relative',
        maxWidth: 580
    },
    closer: {
        position: 'absolute',
        right: 10,
        top: 15,
        color: '#a0a0a0'
    },
    card: {
        margin: '5px 0'
    },
    more: {
        color: '#08f',
        position: 'absolute',
        right: 5,
        bottom: 10,

        '& svg': {
            verticalAlign: 'middle'
        }
    },
    title: {
        fontSize: 18,
        fontWeight: 500,
        textAlign: 'center',
        margin: '10px 0'
    },
    linkButton: {
        textDecoration: 'none'
    }
}));

const diseas = {
    name: 'Гипатит В',
    about: 'это инфекционное заболевание печени, вызванное вирусом гепатита типа B. Острая (активная) стадия гепатита В развивается в течение первых 6 месяцев после заражения вирусной инфекцией и может протекать как в очень легкой форме, практически бессимптомно, так и в тяжелой вплоть до госпитализации.',
    vaccines: `Все современные вакцины для профилактики вирусного гепатита В производятся с использованием генно-инженерной`,
    signs: `Постоянная тошнота Быстрая утомляемость Появление болей в суставах Лихорадка`
}
export const Diseas: React.FC<DiseasProps> = (props) => {
    const classes = useStyles();
    const [openAbout, setOpenAbout] = useState(false);
    const [openVaccines, setOpenVaccines] = useState(false);
    const [openSigns, setOpenSigns] = useState(false);
    const [loading, setLoading] = useState(true);

    // тут могла быть ваша загрузка данных
    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
    }, []);

    if (loading) return (
        <Layout title="Болезнь">
            <PageLayout className="diseas-page">
                <h3 className={classes.title}>Идёт загрузка данных</h3>
                <Loader />
            </PageLayout>
        </Layout>
    );

    return (
        <Layout title="Болезнь">
            <PageLayout className="diseas-page">
                <h3 className={classes.title}>{diseas.name}</h3>

                <div>
                    <div className={classes.paper + ' ' + classes.card} onClick={() => setOpenAbout(true)}>
                        <h2>Что это?</h2>
                        <p>{diseas.about.slice(0, 100) + '...'}</p>
                        <div className={classes.more}>подробнее <ArrowRightAltIcon /></div>
                    </div>
                    <Modal
                        className={classes.modal}
                        open={openAbout}
                        onClose={() => setOpenAbout(false)}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={openAbout}>
                            <div className={classes.paper}>
                                <h2 id="transition-modal-title">Что это?</h2>
                                <p id="transition-modal-description">{diseas.about}</p>
                                <ClearIcon classes={{ root: classes.closer }} onClick={() => setOpenAbout(false)} />
                            </div>
                        </Fade>
                    </Modal>
                </div>

                <div>
                    <div className={classes.paper + ' ' + classes.card} onClick={() => setOpenVaccines(true)}>
                        <h2>Какие есть вакцины?</h2>
                        <p>{diseas.vaccines.slice(0, 100) + '...'}</p>
                        <div className={classes.more}>подробнее <ArrowRightAltIcon /></div>
                    </div>
                    <Modal
                        className={classes.modal}
                        open={openVaccines}
                        onClose={() => setOpenVaccines(false)}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={openVaccines}>
                            <div className={classes.paper}>
                                <h2 id="transition-modal-title">Какие есть вакцины?</h2>
                                <p id="transition-modal-description">{diseas.vaccines}</p>
                                <ClearIcon classes={{ root: classes.closer }} onClick={() => setOpenVaccines(false)} />
                            </div>
                        </Fade>
                    </Modal>
                </div>

                <div>
                    <div className={classes.paper + ' ' + classes.card} onClick={() => setOpenSigns(true)}>
                        <h2 >Признаки</h2>
                        <p>{diseas.signs.slice(0, 100) + '...'}</p>
                        <div className={classes.more}>подробнее <ArrowRightAltIcon /></div>
                    </div>
                    <Modal
                        className={classes.modal}
                        open={openSigns}
                        onClose={() => setOpenSigns(false)}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                            timeout: 500,
                        }}
                    >
                        <Fade in={openSigns}>
                            <div className={classes.paper}>
                                <h2 id="transition-modal-title">Признаки</h2>
                                <p id="transition-modal-description">{diseas.signs}</p>
                                <ClearIcon classes={{ root: classes.closer }} onClick={() => setOpenSigns(false)} />
                            </div>
                        </Fade>
                    </Modal>
                </div>

                <AppButtonGroup floated>
                    <Link to="/passport/ready" className={classes.linkButton}><AppButton appColor="white"> Я привит </AppButton></Link>
                    <Link to="/take" className={classes.linkButton}><AppButton>Записаться</AppButton></Link>
                </AppButtonGroup>
            </PageLayout>
        </Layout>
    );
};