import { useState, useEffect } from "react";
import { createServer } from "miragejs";
import response from "./api/v1/survey/200.json";
import error from "./api/v1/survey/500.json";

let server = createServer();

server.get("/api/v1/survey/", response.data.attributes);

function App() {
  const [response, setResponse] = useState({});
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState([]);
  const [filmValue, setFilmValue] = useState("");
  const [ratingValue, setRatingValue] = useState(1);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("/api/v1/survey/")
        .then((res) => res.json())
        .then((data) => {
          setResponse(data);
          setQuestions(
            data.questions.map((question) => (
              <div key={question.questionId}>
                <label className="w-100">{question.label}</label>
                <br></br>
                <input
                  type={question.questionType === "rating" ? "range" : "text"}
                  id={question.questionId}
                  required={question.required}
                  min={question.attributes?.min}
                  max={question.attributes?.max}
                  list={question.questionType === "rating" ? "tickmarks" : ""}
                  onInput={
                    question.questionId === "film"
                      ? (e) => setFilmValue(e.target.value)
                      : (e) => setRatingValue(e.target.value)
                  }
                  defaultValue={
                    question.questionId === "film" ? filmValue : ratingValue
                  }
                  className="w-100 mb-3 rounded"
                />
              </div>
            ))
          );
        })
        .catch(() => {
          setErrors(
            error.errors.map((error) => (
              <div key={error.title} className="text-center">
                <p>{error.title}</p>
                <p>{error.detail}</p>
              </div>
            ))
          );
        });
    };
    fetchData();
  }, []);

  function handleSubmit(e) {
  }

  return (
    <div className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center">
      <h2 className="text-center">{response.title}</h2>
      <div className="border border-dark rounded mx-5">
        <div className="p-3">
          <p dangerouslySetInnerHTML={{ __html: response.description }} />
        </div>
        <div>
          <form
            className="p-3 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
            onSubmit={handleSubmit}
          >
            {questions}
            {errors}
            <datalist id="tickmarks">
              <option value="1"></option>
              <option value="2"></option>
              <option value="3"></option>
              <option value="4"></option>
              <option value="5"></option>
            </datalist>
            {questions ? (
              <button className="btn btn-primary mt-4 justify-content-center">
                Submit
              </button>
            ) : (
              ""
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
