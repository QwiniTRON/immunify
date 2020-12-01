import react, { useState } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';

import './quiz.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';

type QuizProps = {

}

const useStyles = makeStyles((theme) => ({
    notice: {
        color: theme.palette.error.main
    }
}));

const quizData = [
    {
        question: 'Что Вы думаете о войне во Вьетнаме?',
        answers: [{ text: 'да', id: 1 }, { text: 'нет', id: 2 }, { text: 'смотря кто спрашивает', id: 3 }],
        id: 1
    },
    {
        question: 'Сколько пальцев на ноге?',
        answers: [{ text: 'сложно', id: 4 }, { text: '10', id: 5 }, { text: '5', id: 6 }],
        id: 2
    },
    {
        question: 'Небо какого цвета?',
        answers: [{ text: 'красное', id: 7 }, { text: 'зелёное', id: 8 }, { text: 'голубое', id: 9 }],
        id: 3
    },
    {
        question: 'Какой год сегодня?',
        answers: [{ text: '2019', id: 10 }, { text: '2020', id: 11 }, { text: '2021', id: 12 }],
        id: 4
    },
    {
        question: 'Солнце это звезда?',
        answers: [{ text: 'нет', id: 13 }, { text: 'да', id: 14 }, { text: 'планета', id: 15 }],
        id: 5
    }
]

type QuizState = {
    currentStep: number
    userAnswers: UserAnswer[]
}
type UserAnswer = {
    questionId: number
    answerId: number
}
export const Quiz: React.FC<QuizProps> = (props) => {
    const classes = useStyles();
    const [quiz, setQuiz] = useState<QuizState>({
        userAnswers: [],
        currentStep: 0
    });
    const [selectedAnswer, setSelectedAnswer] = useState(0);
    const quizQuestions = quizData;
    const quizProgress = quiz.userAnswers.length / quizQuestions.length * 100;
    const isNotCurrentAnswer = !Boolean(quiz.userAnswers[quiz.currentStep]) && !selectedAnswer;
    const currentQuestion = quizQuestions[quiz.currentStep];


    const setAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedAnswer(window.parseInt(value));
    }

    const nextQuestion = () => {
        if (quiz.currentStep >= quizQuestions.length) return;
        const lastUserAnswers = quiz.userAnswers;
        const prevAnswer = quiz.userAnswers[quiz.currentStep + 1];
        lastUserAnswers[quiz.currentStep] = {
            questionId: currentQuestion.id,
            answerId: selectedAnswer
        };

        if (prevAnswer) {
            setSelectedAnswer(prevAnswer.answerId);
        } else {
            setSelectedAnswer(0);
        }

        setQuiz({
            currentStep: quiz.currentStep + 1,
            userAnswers: [...lastUserAnswers]
        });
    }

    const backQuestion = () => {
        if (quiz.currentStep == 0) return;

        const prevAnswer = quiz.userAnswers[quiz.currentStep - 1];

        if (prevAnswer) {
            setSelectedAnswer(prevAnswer.answerId);
        } else {
            setSelectedAnswer(0);
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
            questionId: currentQuestion.id,
            answerId: selectedAnswer
        };

        setQuiz({
            ...quiz,
            userAnswers: [...lastUserAnswers]
        });
        console.log(quiz);
    }

    return (
        <PageLayout className="quiz-page">
            <LinearProgress variant="determinate" value={quizProgress} />
            <p>вопрос {`${quiz.currentStep + 1}/${quizQuestions.length}`}</p>
            { isNotCurrentAnswer && (<p className={classes.notice}>ответьте на этот вопрос</p>)}
            <h3 className="quiz-page__question">{currentQuestion.question}</h3>

            <FormControl component="fieldset" color="primary">
                <FormLabel component="legend">ответ</FormLabel>
                <RadioGroup
                    aria-label="answer"
                    name="gender1"
                    value={selectedAnswer}
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
                    disabled={quiz.currentStep == 0}
                    color="default">назад</AppButton>

                {!(quiz.currentStep + 1 == quizQuestions.length) && <AppButton
                    onClick={nextQuestion}
                    className="region-page__save"
                    disabled={isNotCurrentAnswer || quiz.currentStep + 1 == quizQuestions.length}
                    color="primary">далее</AppButton>}

                {quiz.currentStep + 1 == quizQuestions.length && <AppButton
                    onClick={finishQuiz}
                    className="region-page__save"
                    disabled={isNotCurrentAnswer}
                    color="primary">завершить</AppButton>}
            </div>
        </PageLayout>
    );
};