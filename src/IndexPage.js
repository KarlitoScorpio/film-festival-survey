import { useState, useEffect, useContext } from "react";
import survey from "./json/200.json";
import error from "./json/500.json";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { SurveyContext } from "./SurveyContext";

function IndexPage() {
  const [response, setResponse] = useState({});
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState([]);
  const [filmValue, setFilmValue] = useState("");
  const [reviewValue, setReviewValue] = useState(1);
  const { answers, setAnswers } = useContext(SurveyContext);
  const { server } = useContext(SurveyContext);

  const id = uuidv4();

  const navigate = useNavigate();

  server.get("/api/v1/survey/", survey.data.attributes);
  server.post(`/api/v1/survey/:${id}/answers`, answers);

  useEffect(() => {
    const fetchForm = async () => {
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
                      : (e) => setReviewValue(e.target.value)
                  }
                  defaultValue={
                    question.questionId === "film" ? filmValue : reviewValue
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
    fetchForm();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setAnswers({ film: filmValue, review: reviewValue });
    fetch(`/api/v1/survey/:${id}/answers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(answers),
    })
      .then((res) => res.json())
      .then((data) => {
        return data;
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
    navigate("/success");
  }

  return (
    <div className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center">
      {questions.length ? (
        <>
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
                <button className="btn btn-primary mt-4 justify-content-center">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default IndexPage;
