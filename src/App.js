import React, {Fragment, useEffect, useReducer} from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import Question from "./components/Question";
import StartScreen from "./components/StartScreen";
import error from "./components/Error";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
import NextButton from "./components/NextButton";

const initialState = {
    questions: [],
    status: "loading",
    index: 0,
    answer: null,
    points: 0,
    secondsRemaining: null,
}

const SECONDS_PER_QUESTION = 10;
const reducer = (state, action) => {
    switch (action.type) {
        case "dataReceived":
            return {
                ...state,
                questions: action.payload,
                status: "ready",
            };
        case "dataFailed":
            return {
                ...state,
                status: error,
            };
        case "start":
            return {
                ...state,
                secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
                status: "active",
            };
        case "newAnswer":
            const question = state.questions.at(state.index);
            return {
                ...state,
                answer: action.payload,
                points: action.payload === question.correctOption ? state.points + question.points : state.points
            };
        case "nextQuestion":
            return {
                ...state,
                index: state.index + 1,
                answer: null,
            };
        case "finish":
            return {
                ...state,
                status: "finished",
            };
        case "restart":
            return {
                ...initialState,
                questions: state.questions,
                status: "ready"
            };
        case "timer":
            return {
                ...state,
                secondsRemaining: state.secondsRemaining -1,
                status: state.secondsRemaining === 0 ? "finished" : state.status,
            }
        default:
            throw new Error("Error while fetching data");
    }
}

const App = () => {
    const [{questions, status, index, answer, points, secondsRemaining}, dispatch] = useReducer(reducer, initialState)

    const numQuestions = questions.length;
    const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0);
    const fetchQuestions = async () => {
        try {
            const res = await fetch("https://api.jsonbin.io/v3/b/65539cf654105e766fcff424", {
                headers: {
                    "X-MASTER-KEY": "$2a$10$iE2ClTTmohsyQ9gxMWOK4eLCXLiXGT4yk7Z0DHQRJxA/NZY/OFKBa",
                },
            });

            if (!res.ok) throw new Error("No network response");

            const data = await res.json();
            dispatch({
                type: "dataReceived",
                payload: data.record.questions
            })
        } catch (err) {
            dispatch({type: "dataFailed"});
        }
    }

    useEffect(() => {
        fetchQuestions();
    }, []);

    return (
        <div className="app">
            <Header/>
            <Main>
                {status === "loading" && <Loader/>}
                {status === "error" && <Error/>}
                {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch}/>}
                {status === "active" &&
                    <Fragment>
                        <Progress index={index} numQuestions={numQuestions} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer}/>
                        <Question question={questions[index]} dispatch={dispatch} answer={answer}/>
                        <Footer>
                            <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
                            <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} ></NextButton>
                        </Footer>
                    </Fragment>
                }
                {status === "finished" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} dispatch={dispatch} />}
            </Main>
        </div>
    );
};

export default App;
