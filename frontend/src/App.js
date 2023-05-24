import {BrowserRouter, Routes, Route} from "react-router-dom";
import Articles from "./pages/Articles";
import ArticleDetails from "./pages/ArticleDetails";
import ArticleUpdate from "./pages/ArticleUpdate";
import ArticleAdd from "./pages/ArticleAdd";
import React from "react";
import AppContainer from "./components/AppContainer";
import {H1, H2} from "./components/Headings";

function App() {
    return (
        <AppContainer>
            <H1>Newspaper</H1> {/* todo: link */}
            <H2>navbar</H2> {/* todo: navbar */}
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Articles/>}/>
                    <Route path="/add" element={<ArticleAdd/>}/>
                    <Route path="/update/:id" element={<ArticleUpdate/>}/>
                    <Route path="/details/:id" element={<ArticleDetails/>}/>
                </Routes>
            </BrowserRouter>
        </AppContainer>
    );
}

export default App;
