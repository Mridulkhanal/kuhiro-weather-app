import { useState, useEffect, useCallback } from "react";
import "./Quiz.css";

type Question = {
  question: string;
  options: string[];
  correct: number;
};

type HighScore = {
  player: string;
  score: number;
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
  {
    question: "What is a device used to measure temperature?",
    options: ["Thermometer", "Barometer", "Anemometer", "Hygrometer"],
    correct: 0,
  },
  {
    question: "What are stratus, cirrus, cumulus types of?",
    options: ["Clouds", "Winds", "Rains", "Storms"],
    correct: 0,
  },
  {
    question: "Which country has the most tornadoes?",
    options: ["USA", "Australia", "India", "Canada"],
    correct: 0,
  },
  {
    question: "What color should you wear to stay cool on a hot day?",
    options: ["Black", "White", "Red", "Blue"],
    correct: 1,
  },
  {
    question: "What is the study of weather called?",
    options: ["Geology", "Meteorology", "Biology", "Astronomy"],
    correct: 1,
  },
  {
    question: "What is needed to create a blizzard?",
    options: ["Rain and wind", "Snow and wind", "Sun and heat", "Clouds and fog"],
    correct: 1,
  },
  {
    question: "What makes the wind blow?",
    options: ["Trees", "Differences in air pressure", "Ocean", "Mountains"],
    correct: 1,
  },
  {
    question: "What is fog?",
    options: ["A type of rain", "A cloud on the ground", "Snow falling", "Wind storm"],
    correct: 1,
  },
  {
    question: "What is hail?",
    options: ["Frozen rain", "Snow balls", "Ice pellets from thunderstorms", "Sleet"],
    correct: 2,
  },
  {
    question: "How many inches in the highest yearly snowfall on record?",
    options: ["29", "678", "1224", "100"],
    correct: 2,
  },
  {
    question: "What is a rainbow caused by?",
    options: ["Wind", "Sunlight and rain", "Clouds", "Snow"],
    correct: 1,
  },
  {
    question: "What do we call a storm with strong winds and rain?",
    options: ["Tornado", "Hurricane", "Blizzard", "Fog"],
    correct: 1,
  },
  {
    question: "What is the term for a long period without rain?",
    options: ["Flood", "Drought", "Hurricane", "Blizzard"],
    correct: 1,
  },
  {
    question: "What gas makes up most of Earth's atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
    correct: 2,
  },
  {
    question: "What is a sudden burst of wind called?",
    options: ["Gust", "Breeze", "Gale", "Draft"],
    correct: 0,
  },
  {
    question: "What do clouds need to form?",
    options: ["Wind", "Water vapor", "Sand", "Smoke"],
    correct: 1,
  },
  {
    question: "What is the calm center of a hurricane called?",
    options: ["Eye", "Wall", "Tail", "Core"],
    correct: 0,
  },
  {
    question: "What season is typically the warmest?",
    options: ["Winter", "Spring", "Summer", "Fall"],
    correct: 2,
  },
  {
    question: "What is sleet?",
    options: ["Snow", "Rain mixed with ice", "Hail", "Fog"],
    correct: 1,
  },
  {
    question: "What do we call a scientist who studies weather?",
    options: ["Biologist", "Geologist", "Meteorologist", "Chemist"],
    correct: 2,
  },
  {
    question: "What causes thunder?",
    options: ["Wind", "Lightning", "Rain", "Clouds"],
    correct: 1,
  },
  {
    question: "What is the term for very low temperatures?",
    options: ["Heatwave", "Cold snap", "Drought", "Flood"],
    correct: 1,
  },
  {
    question: "What is a common sign of an approaching storm?",
    options: ["Clear skies", "Dark clouds", "Bright sun", "Calm winds"],
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
  {
    question: "What do you call someone who forecasts weather?",
    options: ["Astronomer", "Geologist", "Meteorologist", "Biologist"],
    correct: 2,
  },
  {
    question: "What two things are needed for a rainbow?",
    options: ["Sun and rain", "Moon and clouds", "Wind and sun", "Rain and wind"],
    correct: 0,
  },
  {
    question: "What is the average weather pattern called?",
    options: ["Weather", "Climate", "Season", "Forecast"],
    correct: 1,
  },
  {
    question: "What is a rotating funnel cloud with high winds?",
    options: ["Hurricane", "Tornado", "Cyclone", "Typhoon"],
    correct: 1,
  },
  {
    question: "Highest temperature recorded (134°F) in which country?",
    options: ["Saudi Arabia", "USA", "Australia", "India"],
    correct: 1,
  },
  {
    question: "What makes hurricanes powerful?",
    options: ["Warm ocean water", "Cold air", "Mountains", "Deserts"],
    correct: 0,
  },
  {
    question: "What is snow?",
    options: ["Frozen rain", "Ice crystals", "Hail", "Sleet"],
    correct: 1,
  },
  {
    question: "What are clouds made of?",
    options: ["Cotton", "Water droplets", "Smoke", "Air only"],
    correct: 1,
  },
  {
    question: "What is a drought?",
    options: ["Too much rain", "Lack of water", "Strong wind", "Cold weather"],
    correct: 1,
  },
  {
    question: "What causes seasons?",
    options: ["Earth's tilt", "Distance from sun", "Moon", "Wind"],
    correct: 0,
  },
  {
    question: "What is the primary source of Earth's climate system?",
    options: ["Moon", "Sun", "Stars", "Earth's core"],
    correct: 1,
  },
  {
    question: "What measures atmospheric pressure?",
    options: ["Thermometer", "Barometer", "Anemometer", "Hygrometer"],
    correct: 1,
  },
  {
    question: "What is a cold front?",
    options: [
      "Warm air replacing cold air",
      "Cold air replacing warm air",
      "Stable air mass",
      "High-pressure system",
    ],
    correct: 1,
  },
  {
    question: "What type of cloud is thin and wispy?",
    options: ["Cumulus", "Stratus", "Cirrus", "Nimbus"],
    correct: 2,
  },
  {
    question: "What is the term for a sudden flood caused by heavy rain?",
    options: ["Tsunami", "Flash flood", "Hurricane", "Tornado"],
    correct: 1,
  },
  {
    question: "What is the jet stream?",
    options: [
      "Ocean current",
      "High-altitude wind",
      "Low-pressure system",
      "Rain pattern",
    ],
    correct: 1,
  },
  {
    question: "What is El Niño?",
    options: [
      "A cooling of ocean waters",
      "A warming of ocean waters",
      "A type of tornado",
      "A high-pressure system",
    ],
    correct: 1,
  },
  {
    question: "What does a hygrometer measure?",
    options: ["Wind speed", "Humidity", "Pressure", "Temperature"],
    correct: 1,
  },
  {
    question: "What is a monsoon?",
    options: [
      "A dry season",
      "A seasonal wind with heavy rain",
      "A cold front",
      "A type of cloud",
    ],
    correct: 1,
  },
  {
    question: "What is the greenhouse effect?",
    options: [
      "Cooling of the Earth",
      "Trapping of heat by gases",
      "Wind circulation",
      "Ocean currents",
    ],
    correct: 1,
  },
  {
    question: "What is a waterspout?",
    options: [
      "A type of rain",
      "A tornado over water",
      "A wave",
      "A cloud formation",
    ],
    correct: 1,
  },
  {
    question: "What is the main cause of fog?",
    options: [
      "High wind speeds",
      "Cooling of air near the ground",
      "Heavy rain",
      "Warm ocean currents",
    ],
    correct: 1,
  },
  {
    question: "What is the term for a high-pressure system?",
    options: ["Cyclone", "Anticyclone", "Tornado", "Monsoon"],
    correct: 1,
  },
];

const hardQuestions: Question[] = [
  {
    question: "🌍 The Intertropical Convergence Zone (ITCZ) is also known as?",
    options: ["Horse Latitudes", "Doldrums", "Trade Winds", "Polar Vortex"],
    correct: 1,
  },
  {
    question: "⚡ What is the scientific term for sudden downdrafts during thunderstorms?",
    options: ["Cyclone", "Microburst", "Squall", "Derecho"],
    correct: 1,
  },
  {
    question: "From which cloud do thunderstorms come?",
    options: ["Cumulus", "Cumulonimbus", "Stratus", "Cirrus"],
    correct: 1,
  },
  {
    question: "What does CAPE stand for in meteorology?",
    options: [
      "Convective Available Potential Energy",
      "Cloud Altitude Pressure Estimate",
      "Cumulative Atmospheric Pressure Effect",
      "Convective Air Parcel Energy",
    ],
    correct: 0,
  },
  {
    question: "Standard temperature at sea level?",
    options: ["0°C", "15°C", "20°C", "25°C"],
    correct: 1,
  },
  {
    question: "Standard pressure at sea level?",
    options: ["1000 mb", "1013 mb", "1020 mb", "990 mb"],
    correct: 1,
  },
  {
    question: "In a stable air mass, what is likely?",
    options: ["Turbulence", "Smooth air", "Thunderstorms", "High winds"],
    correct: 1,
  },
  {
    question: "Weather mostly occurs in which layer?",
    options: ["Stratosphere", "Troposphere", "Mesosphere", "Thermosphere"],
    correct: 1,
  },
  {
    question: "Three main gases in the atmosphere?",
    options: [
      "Nitrogen, Oxygen, Carbon Dioxide",
      "Nitrogen, Oxygen, Argon",
      "Oxygen, Carbon Dioxide, Neon",
      "Helium, Nitrogen, Oxygen",
    ],
    correct: 1,
  },
  {
    question: "What measures wind speed?",
    options: ["Barometer", "Anemometer", "Thermometer", "Hygrometer"],
    correct: 1,
  },
  {
    question: "What is the term for winds greater than 32 mph with heavy snow?",
    options: ["Blizzard", "Snowstorm", "Hurricane", "Tornado"],
    correct: 0,
  },
  {
    question: "How is water vapor in the air measured?",
    options: ["Temperature", "Humidity", "Pressure", "Density"],
    correct: 1,
  },
  {
    question: "What is the Coriolis effect caused by?",
    options: [
      "Earth's rotation",
      "Temperature differences",
      "Ocean currents",
      "Solar radiation",
    ],
    correct: 0,
  },
  {
    question: "What is a derecho?",
    options: [
      "A tropical storm",
      "A widespread windstorm",
      "A type of cloud",
      "A cold front",
    ],
    correct: 1,
  },
  {
    question: "What is the primary driver of ocean currents?",
    options: ["Wind", "Tides", "Earth's rotation", "Solar heat"],
    correct: 0,
  },
  {
    question: "What is a haboob?",
    options: [
      "A dust storm",
      "A tropical cyclone",
      "A cold front",
      "A high-pressure system",
    ],
    correct: 0,
  },
  {
    question: "What is the approximate height of the troposphere at the equator?",
    options: ["5 km", "10 km", "16 km", "20 km"],
    correct: 2,
  },
  {
    question: "What is a squall line?",
    options: [
      "A line of thunderstorms",
      "A type of cloud",
      "A wind pattern",
      "A pressure system",
    ],
    correct: 0,
  },
  {
    question: "What gas is most responsible for the greenhouse effect?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
    correct: 2,
  },
  {
    question: "What is the term for a rapid drop in temperature?",
    options: ["Cold snap", "Heatwave", "Inversion", "Advection"],
    correct: 0,
  },
  {
    question: "What is a foehn wind?",
    options: [
      "A cold polar wind",
      "A warm downslope wind",
      "A tropical storm wind",
      "A high-altitude jet stream",
    ],
    correct: 1,
  },
  {
    question: "What is the dew point?",
    options: [
      "Temperature at which air becomes saturated",
      "Lowest daily temperature",
      "Pressure at sea level",
      "Wind speed threshold",
    ],
    correct: 0,
  },
  {
    question: "What is the Beaufort scale used for?",
    options: [
      "Measuring temperature",
      "Measuring wind speed",
      "Measuring rainfall",
      "Measuring humidity",
    ],
    correct: 1,
  },
  {
    question: "What is a thermal inversion?",
    options: [
      "Warm air below cold air",
      "Cold air below warm air",
      "High wind speeds",
      "Heavy rainfall",
    ],
    correct: 0,
  },
  {
    question: "What is the primary source of energy for Earth's weather?",
    options: ["Earth's core", "Moon", "Sun", "Wind"],
    correct: 2,
  },
];

const Quiz = () => {
  const [level, setLevel] = useState<"easy" | "medium" | "hard" | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [highScores, setHighScores] = useState<{
    easy: HighScore | null;
    medium: HighScore | null;
    hard: HighScore | null;
  }>({
    easy: null,
    medium: null,
    hard: null,
  });
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const getQuestions = useCallback(() => {
    if (level === "easy") return easyQuestions;
    if (level === "medium") return mediumQuestions;
    if (level === "hard") return hardQuestions;
    return [];
  }, [level]);

  const getTimerDuration = useCallback(() => {
    if (level === "easy") return 60;
    if (level === "medium") return 90;
    if (level === "hard") return 120;
    return 60;
  }, [level]);

  const getPoints = useCallback(() => {
    if (level === "easy") return 5;
    if (level === "medium") return 10;
    if (level === "hard") return 20;
    return 5;
  }, [level]);

  useEffect(() => {
    // Load high scores from localStorage on mount
    const storedHighScores = localStorage.getItem("weatherQuizHighScores");
    if (storedHighScores) {
      try {
        setHighScores(JSON.parse(storedHighScores));
      } catch (error) {
        console.error("Failed to parse high scores:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Shuffle questions when level is selected
    if (level && shuffledQuestions.length === 0) {
      const questions = getQuestions();
      if (questions.length > 0) {
        setShuffledQuestions(shuffleArray(questions));
      }
    }
  }, [level, getQuestions, shuffledQuestions.length]);

  useEffect(() => {
    // Timer logic for entire level
    if (level && !gameOver && shuffledQuestions.length > 0) {
      setTimeLeft(getTimerDuration());
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [level, gameOver, getTimerDuration, shuffledQuestions.length]);

  const handleAnswer = (index: number) => {
    if (shuffledQuestions.length === 0 || showFeedback) return; // Prevent action if no questions or during feedback
    setSelectedAnswer(index);
    const q = shuffledQuestions[currentQ];
    const correct = index === q.correct;
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + getPoints());
    }
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
      if (currentQ + 1 < shuffledQuestions.length) {
        setCurrentQ((prev) => prev + 1);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  const startGame = (selectedLevel: "easy" | "medium" | "hard") => {
    if (playerName.trim()) {
      setLevel(selectedLevel);
      setCurrentQ(0);
      setScore(0);
      setGameOver(false);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(null);
      setShuffledQuestions([]);
      setTimeLeft(getTimerDuration());
    }
  };

  const restartGame = () => {
    setLevel(null);
    setCurrentQ(0);
    setScore(0);
    setGameOver(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(null);
    setTimeLeft(0);
    setPlayerName("");
    setShuffledQuestions([]);
  };

  useEffect(() => {
    // Update high scores when game is over
    if (gameOver && level && playerName) {
      setHighScores((prev) => {
        const currentHighScore = prev[level];
        const newHighScore = { player: playerName, score };
        if (!currentHighScore || score > currentHighScore.score) {
          const updatedHighScores = { ...prev, [level]: newHighScore };
          try {
            localStorage.setItem("weatherQuizHighScores", JSON.stringify(updatedHighScores));
          } catch (error) {
            console.error("Failed to save high scores:", error);
          }
          return updatedHighScores;
        }
        return prev;
      });
    }
  }, [gameOver, level, score, playerName]);

  const renderHighScores = () => (
    <div className="high-scores-container">
      <h3>🏆 High Scores</h3>
      <table className="high-scores-table">
        <thead>
          <tr>
            <th>Level</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Easy</td>
            <td>{highScores.easy ? highScores.easy.player : "N/A"}</td>
            <td>{highScores.easy ? highScores.easy.score : "0"}</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>{highScores.medium ? highScores.medium.player : "N/A"}</td>
            <td>{highScores.medium ? highScores.medium.score : "0"}</td>
          </tr>
          <tr>
            <td>Hard</td>
            <td>{highScores.hard ? highScores.hard.player : "N/A"}</td>
            <td>{highScores.hard ? highScores.hard.score : "0"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  if (!level) {
    return (
      <div className="quiz-container">
        <h2>🌦️ Weather Quiz</h2>
        {renderHighScores()}
        <p>Enter your name:</p>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value.trim())}
          placeholder="Your name"
          className="player-input"
          maxLength={20}
        />
        <p>Select a level to begin:</p>
        <div className="level-buttons">
          <button onClick={() => startGame("easy")} disabled={!playerName.trim()}>
            Easy
          </button>
          <button onClick={() => startGame("medium")} disabled={!playerName.trim()}>
            Medium
          </button>
          <button onClick={() => startGame("hard")} disabled={!playerName.trim()}>
            Hard
          </button>
        </div>
        {!playerName.trim() && (
          <p className="error-message">Please enter your name to start!</p>
        )}
      </div>
    );
  }

  if (gameOver) {
    const totalQuestions = shuffledQuestions.length;
    const maxScore = totalQuestions * getPoints();
    const percentage = totalQuestions > 0 ? Math.round((score / maxScore) * 100) : 0;
    let message = "";
    if (percentage >= 90) {
      message = "Weather Wizard! 🌟";
    } else if (percentage >= 70) {
      message = "Great Job! 👍";
    } else if (percentage >= 50) {
      message = "Good Effort! 😊";
    } else {
      message = "Keep Learning! 📚";
    }
    const highScore = highScores[level];
    return (
      <div className="quiz-container">
        <h2>🏆 Game Over!</h2>
        {renderHighScores()}
        <p>{message}</p>
        <p>Your final score: {score} / {maxScore}</p>
        <p>Percentage: {percentage}%</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        {highScore && (
          <p className="high-score">
            High Score for {level.toUpperCase()}: {highScore.score} by {highScore.player}
          </p>
        )}
        <button onClick={restartGame}>Play Again</button>
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
    return (
      <div className="quiz-container">
        <h2>Loading...</h2>
        <p>Please wait while the quiz is being prepared.</p>
      </div>
    );
  }

  const q = shuffledQuestions[currentQ];
  const timerDuration = getTimerDuration();

  return (
    <div className="quiz-container">
      <h2>Level: {level.toUpperCase()}</h2>
      {renderHighScores()}
      <p>Player: {playerName}</p>
      <p>Score: {score}</p>
      <p>Question {currentQ + 1} of {shuffledQuestions.length}</p>
      <p>Time Left for Level: {timeLeft}s</p>
      <div className="timer-bar">
        <div
          className="timer-fill"
          style={{ width: `${(timeLeft / timerDuration) * 100}%` }}
        ></div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentQ + 1) / shuffledQuestions.length) * 100}%` }}
        ></div>
      </div>
      <div className="question-box">
        <h3>{q.question}</h3>
        {showFeedback && (
          <p className={isCorrect ? "feedback-correct" : "feedback-wrong"}>
            {isCorrect ? "Correct!" : "Wrong!"}
          </p>
        )}
        <div className="options-grid">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={
                showFeedback
                  ? idx === q.correct
                    ? "correct"
                    : idx === selectedAnswer
                    ? "wrong"
                    : ""
                  : selectedAnswer === idx
                  ? "selected"
                  : ""
              }
              disabled={selectedAnswer !== null || showFeedback}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz;