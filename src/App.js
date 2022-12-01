import { createServer } from "miragejs";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import SuccessPage from "./pages/SuccessPage";
import { SurveyContext } from "./context/SurveyContext";

const server = createServer();

function App() {
  const [answers, setAnswers] = useState({
    film: "",
    review: 0,
  });

  return (
    <BrowserRouter>
      <SurveyContext.Provider value={{ answers, setAnswers, server }}>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </SurveyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
