import React, { useState, useEffect } from 'react';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=boolean')
      .then(response => response.json())
      .then(data => setQuestions(data.results))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  const handleAnswerChange = (answer) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [currentQuestionIndex]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const renderQuiz = () => {
    if (questions.length === 0) {
      return <p>Loading questions...</p>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div>
        <h1>True or False Quiz</h1>
        <p>{currentQuestion.question}</p>
        <div>
          <button onClick={() => handleAnswerChange('True')}>True</button>
          <button onClick={() => handleAnswerChange('False')}>False</button>
        </div>
        <button onClick={handleNextQuestion}>Next</button>
      </div>
    );
  };

  const renderResults = () => {
    const correctAnswers = questions.filter((question, index) => userAnswers[index] === question.correct_answer);
    const score = (correctAnswers.length / questions.length) * 100;

    return (
      <div>
        <h1>Quiz Results</h1>
        <p>Your score: {score}%</p>
        {questions.map((question, index) => (
          <p key={index}>
            Question {index + 1}: {userAnswers[index] === question.correct_answer ? 'Correct' : 'Incorrect'}
          </p>
        ))}
      </div>
    );
  };

  return <div>{showResults ? renderResults() : renderQuiz()}</div>;
}

export default App;