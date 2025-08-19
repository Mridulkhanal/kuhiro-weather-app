import { useState } from "react";
import "./Quiz.css";

type Question = {
  question: string;
  options: string[];
  correct: number; // index of correct option
};

const easyQuestions: Question[] = [
  {
    question: "☀️ What do we call frozen water falling from the sky?",
    options: ["Rain", "Snow", "Cloud", "Wind"],
    correct: 1,
  },
  {
    question: "🌧️ Which tool measures rainfall?",
    options: ["Thermometer", "Rain Gauge", "Barometer", "Compass"],
    correct: 1,
  },
];

const mediumQuestions: Question[] = [
  {
    question: "🌡️ Which layer of the atmosphere contains the ozone layer?",
    options: ["Troposphere", "Stratosphere", "Mesosphere", "Exosphere"],
    correct: 1,
  },
  {
    question: "💨 What causes wind?",
    options: [
      "Movement of clouds",
      "Temperature differences",
      "Rotation of Earth only",
      "Ocean waves",
    ],
    correct: 1,
  },
];

const hardQuestions: Question[] = [
  {
    question: "🌍 The Intertropical Convergence Zone (ITCZ) is also known as?",
    options: [
      "Horse Latitudes",
      "Doldrums",
      "Trade Winds",
      "Polar Vortex",
    ],
    correct: 1,
  },
  {
    question: "⚡ What is the scientific term for sudden downdrafts during thunderstorms?",
    options: ["Cyclone", "Microburst", "Squall", "Derecho"],
    correct: 1,
  },
];

const Quiz = () => {
  const [level, setLevel] = useState<"easy" | "medium" | "hard" | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const getQuestions = () => {
    if (level === "easy") return easyQuestions;
    if (level === "medium") return mediumQuestions;
    if (level === "hard") return hardQuestions;
    return [];
  };

  const handleAnswer = (index: number) => {
    const questions = getQuestions();
    const q = questions[currentQ];
    let points = 0;
    if (level === "easy") points = 5;
    if (level === "medium") points = 10;
    if (level === "hard") points = 20;

    if (index === q.correct) {
      setScore((prev) => prev + points);
    }

    if (currentQ + 1 < questions.length) {
      setCurrentQ((prev) => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setLevel(null);
    setCurrentQ(0);
    setScore(0);
    setGameOver(false);
  };

  if (!level) {
    return (
      <div className="quiz-container">
        <h2>🌦️ Weather Quiz</h2>
        <p>Select a level to begin:</p>
        <div className="level-buttons">
          <button onClick={() => setLevel("easy")}>Easy</button>
          <button onClick={() => setLevel("medium")}>Medium</button>
          <button onClick={() => setLevel("hard")}>Hard</button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="quiz-container">
        <h2>🏆 Game Over!</h2>
        <p>Your final score: {score}</p>
        <button onClick={restartGame}>Restart</button>
      </div>
    );
  }

  const questions = getQuestions();
  const q = questions[currentQ];

  return (
    <div className="quiz-container">
      <h2>Level: {level.toUpperCase()}</h2>
      <p>Score: {score}</p>
      <div className="question-box">
        <h3>{q.question}</h3>
        <div className="options-grid">
          {q.options.map((opt, idx) => (
            <button key={idx} onClick={() => handleAnswer(idx)}>
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;