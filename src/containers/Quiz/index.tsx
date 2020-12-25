import React, { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useHistory } from 'react-router-dom';
import { useReactOidc } from '@axa-fr/react-oidc-context';

import './quiz.scss';

import { claculateRisks } from '../../store/appData/action';
import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { RootState } from '../../store';
import { updateCurrentUserData } from '../../store/user/action';
import { QuizAnswer } from '../../store/types';
import { Layout } from '../../components/Layout/Layout';
import { BackButton } from '../../components/BackButton';
import { useIsEmptyFamily } from '../../hooks';
import { QuizData } from '../../models/User';



type QuizProps = {}

const useStyles = makeStyles((theme) => ({
    notice: {
        color: theme.palette.error.main
    }
}));

type QuizState = {
    currentStep: number
    userAnswers: QuizAnswer[]
}
export const Quiz: React.FC<QuizProps> = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const { oidcUser } = useReactOidc();

    const isEmptyFamily = useIsEmptyFamily();
    const [open, setOpen] = useState(false);
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const currentQuestionnarie = useSelector((state: RootState) => state.appData.questionnaire);
    const pathToBack = isEmptyFamily ? '/profile' : `/profile/${currentUser?.name}`;

    const [quiz, setQuiz] = useState<QuizState>({
        userAnswers: currentUser?.data?.quiz?.answers || [],
        currentStep: 0
    });
    const [selectedAnswer, setSelectedAnswer] = useState(currentUser?.data?.quiz?.answers?.[0]?.answerId);


    const Questionnaire = currentQuestionnarie;
    if (!Questionnaire) {
        history.push('/profile');
        return null;
    }
    const quizQuestions = Questionnaire?.questions!;
    const quizProgress = quiz.userAnswers.length / quizQuestions?.length * 100;
    const isNotCurrentAnswer = !Boolean(quiz.userAnswers[quiz.currentStep]) && !selectedAnswer;
    const currentQuestion = quizQuestions?.[quiz.currentStep];


    const setAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedAnswer(value);
    }


    const nextQuestion = () => {
        if (quiz.currentStep >= quizQuestions.length) return;
        const lastUserAnswers = quiz.userAnswers;
        const prevAnswer = quiz.userAnswers[quiz.currentStep + 1];
        lastUserAnswers[quiz.currentStep] = {
            questionId: String(currentQuestion.id),
            answerId: String(selectedAnswer)
        };

        if (prevAnswer) {
            setSelectedAnswer(prevAnswer.answerId);
        } else {
            setSelectedAnswer(String(0));
        }

        setQuiz({
            currentStep: quiz.currentStep + 1,
            userAnswers: [...lastUserAnswers]
        });
    }


    const backQuestion = () => {
        if (quiz.currentStep === 0) return;

        const prevAnswer = quiz.userAnswers[quiz.currentStep - 1];

        if (prevAnswer) {
            setSelectedAnswer(String(prevAnswer.answerId));
        } else {
            setSelectedAnswer(String(0));
        }

        setQuiz({
            ...quiz,
            currentStep: quiz.currentStep - 1
        });
    }


    const finishQuiz = () => {
        if (quiz.currentStep >= quizQuestions.length) return;
        const lastUserAnswers = quiz.userAnswers;
        lastUserAnswers[quiz.currentStep] = {
            questionId: currentQuestion.id?.toString(),
            answerId: selectedAnswer?.toString()!
        };

        setQuiz({
            ...quiz,
            userAnswers: [...lastUserAnswers]
        });

        const quizData = new QuizData(Date.now().toString(), true, Questionnaire?.id?.toString(), quiz.userAnswers);
        (dispatch(updateCurrentUserData({ quiz: quizData })) as any)
            .then((r: any) => {
                setOpen(true);
                dispatch(claculateRisks(oidcUser.access_token));
            });
    }

    return (
        <Layout title="" BackButtonCustom={<BackButton to={pathToBack} text="Вернуться в профиль" />} >
            <PageLayout className="quiz-page">
                <LinearProgress variant="determinate" value={quizProgress} />
                <p>вопрос {`${quiz.currentStep + 1}/${quizQuestions.length}`}</p>
                {isNotCurrentAnswer && (<p className={classes.notice}>ответьте на этот вопрос</p>)}
                <h3 className="quiz-page__question">{currentQuestion.text}</h3>

                <FormControl component="fieldset" color="primary">
                    <FormLabel component="legend">ответ</FormLabel>
                    <RadioGroup
                        aria-label="answer"
                        name="quiz"
                        value={Number(selectedAnswer)}
                        onChange={setAnswer}>
                        {currentQuestion.answers.map((answer) => (
                            <FormControlLabel key={answer.id} value={answer.id} control={<Radio color="primary" />} label={answer.text} />
                        ))}
                    </RadioGroup>
                </FormControl>

                <div className="region-page__btns">
                    <AppButton
                        onClick={backQuestion}
                        className="region-page__save"
                        disabled={quiz.currentStep === 0}
                        color="default">назад</AppButton>

                    {!(quiz.currentStep + 1 === quizQuestions.length) && <AppButton
                        onClick={nextQuestion}
                        className="region-page__save"
                        disabled={isNotCurrentAnswer || quiz.currentStep + 1 === quizQuestions.length}
                        color="primary">далее</AppButton>}

                    {quiz.currentStep + 1 === quizQuestions.length && <AppButton
                        onClick={finishQuiz}
                        className="region-page__save"
                        disabled={isNotCurrentAnswer}
                        color="primary">завершить</AppButton>}
                </div>

                <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
                    <MuiAlert onClose={() => setOpen(false)} elevation={6} variant="filled">
                        данные сохранены.
                </MuiAlert>
                </Snackbar>
            </PageLayout>
        </Layout>
    );
};