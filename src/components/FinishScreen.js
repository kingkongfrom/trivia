import {Fragment} from "react";

const FinishScreen = ({points, maxPossiblePoints, dispatch}) => {
    const percentage = (points / maxPossiblePoints) * 100;

    let stars;
    if (percentage <= 100) stars = "⭐⭐⭐⭐⭐";
    if (percentage <= 80) stars = "⭐⭐⭐⭐";
    if (percentage <= 70) stars = "⭐⭐⭐";
    if (percentage <= 60) stars = "⭐⭐";
    if (percentage <= 50) stars = "⭐";


    return (
        <Fragment>
            <p className="result">You scored <strong>{points}</strong> out
                of <strong>{maxPossiblePoints}</strong> possible points</p>
            <div className="coffee-cup-container">
                <p className="stars">{stars}</p>
            </div>
            <div className="restart">
                <button className="btn btn-ui" onClick={() => dispatch({type: "restart"})}>Restart the quiz</button>
            </div>
        </Fragment>
    );
}
export default FinishScreen;
