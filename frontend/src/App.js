import {BrowserRouter, Routes, Route} from "react-router-dom";
import "./styles/App.css";
import Articles from "./pages/Articles";
import ArticleDetails from "./pages/ArticleDetails";
import ArticleUpdate from "./pages/ArticleUpdate";
import ArticleAdd from "./pages/ArticleAdd";
import React from "react";

function Button() {
    return null;
}

function App() {
    return (
        <div className="App">
            <h1>Newspaper</h1> {/* todo: link */}
            <h2>navbar</h2> {/* todo: navbar */}
            <div>
                <Button>Test</Button>
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Articles/>}/>
                    <Route path="/add" element={<ArticleAdd/>}/>
                    <Route path="/update/:id" element={<ArticleUpdate/>}/>
                    <Route path="/details/:id" element={<ArticleDetails/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
