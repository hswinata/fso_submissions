import { useState } from "react";

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = (good * 1 + bad * -1) / all;
  const positive = all > 0 ? (good / all) * 100 + "%" : 0;

  return (
    <div>
      <h3>statistics</h3>
      {all === 0 ? (
        <p>No feedback given</p>
      ) : (
        <ul>
          <StatisticsLine name="good" value={good} />
          <StatisticsLine name="neutral" value={neutral} />
          <StatisticsLine name="bad" value={bad} />
          <StatisticsLine name="average" value={average} />
          <StatisticsLine name="positive" value={positive} />
        </ul>
      )}
    </div>
  );
};

const StatisticsLine = ({ name, value }) => {
  return (
    <li>
      {name} {value}
    </li>
  );
};

const Button = ({ onClick, name }) => {
  return <button onClick={onClick}>{name}</button>;
};

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
      <Button onClick={handleGoodClick} name="good" />
      <Button onClick={handleNeutralClick} name="neutral" />
      <Button onClick={handleBadClick} name="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
