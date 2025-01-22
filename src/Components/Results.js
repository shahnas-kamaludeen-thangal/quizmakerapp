import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const Results = () => {
  const { state } = useLocation();
  const { questions, selectedAnswers, totalScore } = state;

  return (
    <div className="flex flex-col justify-center items-center h-screen border-2 border-slate-400 shadow-md">
      <h1 className="font-bold text-2xl m-2 p-2 ">Results</h1>
      <div>
        {questions.map((question, qsIndex) => (
          <div key={qsIndex}>
            <p className="m-2 p-2">{question.question}</p>
            <div>
              <button className="m-1 p-1 border-2 rounded-md bg-green-500">
                {question.correct_answer}
              </button>
              {question.incorrect_answers.map(
                (answer, incorrectanswerIndex) => (
                  <button
                    key={incorrectanswerIndex}
                    className={`m-1 p-1 border-2 rounded-md ${
                      selectedAnswers[qsIndex] === incorrectanswerIndex + 1
                        ? selectedAnswers[qsIndex] === 0
                          ? "bg-green-500"
                          : "bg-red-500"
                        : ""
                    }`}
                  >
                    {answer}
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
      <p
        className={`m-2 p-2 px-8 w-[250px] rounded-md shadow-md ${
          totalScore === 0 || totalScore === 1
            ? "bg-red-500"
            : totalScore === 2 || totalScore === 3
            ? "bg-yellow-400"
            : totalScore === 4 || totalScore === 5
            ? "bg-green-400"
            : "bg-white"
        }`}
      >
        You Scored {totalScore} out of 5
      </p>
      <Link to="/quizmakerapp">
        <button className="bg-gray-500 w-[250px] m-2 p-2 rounded-md shadow-md">
          Create a new quiz
        </button>
      </Link>
    </div>
  );
};

export default Results;
