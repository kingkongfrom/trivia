
const StartScreen = ({ numQuestions, dispatch }) => {
    return (
        <div className="start">
            <h2>Coffee trivia</h2>
            <h3>{numQuestions} questions to test your coffee mastery</h3>
            <button className="btn btn-ui" onClick={() => dispatch({type: "start"})}>Let's start</button>
        </div>
    );
}
export default StartScreen;
