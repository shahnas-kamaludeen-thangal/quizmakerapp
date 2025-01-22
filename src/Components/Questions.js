import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const navigate = useNavigate();

  const decodeHTMLEntities = (text) => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch("https://opentdb.com/api_category.php");
        const jsonCategory = await response.json();
        setCategory(jsonCategory.trivia_categories);
      } catch (error) {
        console.log("Something went wrong while fetching category list", error);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (selectedCategory && difficulty) {
        try {
          const response = await fetch(
            `https://opentdb.com/api.php?amount=5&category=${selectedCategory}&difficulty=${difficulty}&type=multiple`
          );
          const jsonQus = await response.json();
          setQuestions(jsonQus.results);
        } catch (error) {
          console.log("Something went wrong while fetching questions", error);
        }
      }
    };
    fetchQuestions();
  }, [selectedCategory, difficulty]);

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  const handleSelectedCategory = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSelectedDifficulty = (event) => {
    setDifficulty(event.target.value);
  };

  const handleAnswerClick = (qusIndex, answerIndex) => {
    setSelectedAnswers((prev) => ({ ...prev, [qusIndex]: answerIndex }));
  };

  useEffect(() => console.log(selectedAnswers), [selectedAnswers]);

  useEffect(() => {
    const totalScore = () => {
      const score = Object.values(selectedAnswers).filter(
        (value) => value === 0
      ).length;
      setTotalScore(score);
    };
    totalScore();
  }, [selectedAnswers]);

  const handleSubmit = () => {
    navigate("/results", { state: { questions, selectedAnswers, totalScore } });
  };

  return (
    <>
      <div className="border-2  border-slate-200 w-3/6 m-2 p-2 mx-8 ">
        <select
          value={selectedCategory}
          onChange={handleSelectedCategory}
          className="border-2 border-slate-100 rounded-md shadow-md w-[300px] h-[40px]"
        >
          <option value="" disabled>
            Select a category
          </option>
          {category.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          value={difficulty}
          onChange={handleSelectedDifficulty}
          className="border-2 m-2 border-slate-100 rounded-md shadow-md w-[300px] h-[40px]"
        >
          <option value="" disabled>
            Select difficulty level
          </option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div>
        {questions?.map((item, qsIndex) => (
          <div key={qsIndex} className="mx-8">
            <li className="list-none m-2 p-2">
              {decodeHTMLEntities(item.question)}
            </li>{" "}
            <div>
              <button
                className={`m-1 p-1 border-2 border-slate-200 rounded-md shadow-md ${
                  selectedAnswers[qsIndex] === 0 ? "bg-green-400" : ""
                }`}
                onClick={() => handleAnswerClick(qsIndex, 0)}
              >
                {item.correct_answer}
              </button>
              {item.incorrect_answers.map((answer, incorrectanswerIndex) => (
                <button
                  className={`m-1 p-1 border-2 border-slate-200 rounded-md shadow-md ${
                    selectedAnswers[qsIndex] === incorrectanswerIndex + 1
                      ? "bg-green-400"
                      : ""
                  }`}
                  onClick={() =>
                    handleAnswerClick(qsIndex, incorrectanswerIndex + 1)
                  }
                  key={incorrectanswerIndex}
                >
                  {answer}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {Object.keys(selectedAnswers).length === 5 ? (
        <button
          onClick={handleSubmit}
          className="mx-8 my-5 p-2 border-2 border-slate-200 rounded-md shadow-md w-[200px] bg-red-400"
        >
          Submit
        </button>
      ) : null}
    </>
  );
};

export default Questions;
