import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
  };
  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };
  const handleBadClick = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <h3>Give feedback</h3>
      <div>
        <button onClick={handleGoodClick}>good</button>
        <button onClick={handleNeutralClick}> neutral</button>
        <button onClick={handleBadClick}>bad</button>
      </div>
      <div>
        <h3>statistics</h3>
        <p>good {good}</p>
        <p>neutral {neutral}</p>
        <p>bad {bad} </p>
      </div>
    </div>
  );
};

export default App;