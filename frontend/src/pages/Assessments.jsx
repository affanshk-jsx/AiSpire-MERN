import React, { useState } from 'react';
import './Assessments.css';

const questions = [
  {
    questionText: 'Which activity sounds most appealing to you?',
    options: [
      'Building something with your hands or tools.',
      'Analyzing data and solving complex problems.',
      'Creating art, music, or writing.',
      'Helping and teaching others.',
    ],
  },
  {
    questionText: 'In a team project, you prefer to:',
    options: [
      'Take the lead and organize the team.',
      'Focus on the details and ensure accuracy.',
      'Brainstorm creative ideas.',
      'Make sure everyone is working together harmoniously.',
    ],
  },
  {
    questionText: 'What kind of work environment do you prefer?',
    options: [
      'A structured, predictable environment.',
      'A dynamic, fast-paced setting.',
      'A creative and flexible studio or office.',
      'A collaborative and social workplace.',
    ],
  },
];

const Assessments = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerOptionClick = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestion(0);
    setShowResult(false);
  }

  return (
    <div className="assessments-page container">
      <div className="page-header">
        <h1>Career Pathfinder</h1>
        <p>Answer a few simple questions to get a personalized career suggestion.</p>
      </div>
      
      <div className="quiz-container">
        {showResult ? (
          <div className="result-section">
            <h2>Based on your answers, you might enjoy being a...</h2>
            <div className="suggested-career">Software Developer</div>
            <p className="result-description">
              This role involves creative problem-solving and building tangible products. It aligns with your preference for analyzing data and working in a dynamic environment.
            </p>
            <button onClick={handleRestart} className="btn-restart">
              Take the Quiz Again
            </button>
          </div>
        ) : (
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">{questions[currentQuestion].questionText}</div>
            <div className="answer-options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={handleAnswerOptionClick}
                  className="option-button"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments;