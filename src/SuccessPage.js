import React, { useState, useEffect, useContext } from "react";
import { SurveyContext } from "./SurveyContext";
import survey from "./json/200.json";
import error from "./json/500.json";

function SuccessPage() {
  const [questions, setQuestions] = useState([]);
  const [errors, setErrors] = useState([]);
  const { answers } = useContext(SurveyContext);
  const { server } = useContext(SurveyContext);

  server.get("/api/v1/survey/", survey.data.attributes);

  useEffect(() => {
    const fetchForm = async () => {
      await fetch("/api/v1/survey/")
        .then((res) => res.json())
        .then((data) => {
          setQuestions(
            data.questions.map((question) => (
              <div key={question.questionId} className="text-center mb-3">
                <label className="w-100">{question.label}</label>
                {answers[question.questionId]}
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

  return (
    <div className="vw-100 vh-100 d-flex flex-column justify-content-center align-items-center">
      {questions.length ? (
        <>
          <h3>Thank you for completing a survey</h3>
          <p>Your answers:</p>
          {errors}
          {questions}
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default SuccessPage;
