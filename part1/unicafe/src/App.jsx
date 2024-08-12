import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = good + neutral + bad;
  const average = (good * 1 + bad * -1) / all;
  const positive = all > 0 ? (good / all) * 100 + "%" : 0;

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
        <ul>
          <li>good {good}</li>
          <li>neutral {neutral}</li>
          <li>bad {bad}</li>
          <li>all {all}</li>
          <li>average {average ? average : 0}</li>
          <li>positive {positive ? positive : 0}</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
