import {BrowserRouter, Routes, Route} from "react-router-dom";
import Articles from "./pages/Articles";
import ArticleDetails from "./pages/ArticleDetails";
import ArticleUpdate from "./pages/ArticleUpdate";
import ArticleAdd from "./pages/ArticleAdd";
import Reports from "./pages/Reports";
import React, {useEffect, useState} from "react";
import AppContainer from "./components/AppContainer";
import {H1, Text} from "./components/Typography";
import HomepageBar from "./components/HomepageBar";
import AppButton from "./components/AppButton";
import {IMPORT_DATA_LINK, USERS_LINK} from "./assets/constants";
import axios from "axios";
import UserList from "./components/UserList";
import {Navbar} from "flowbite-react";
import {useDispatch} from "react-redux";
import {login} from './assets/loggedInUserSlice';
import {useSelector} from "react-redux";

function App() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersLoaded, setUsersLoaded] = useState(false);
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.loggedInUser);

    const importData = async () => {
        try {
            setLoading(true);
            await axios.post(IMPORT_DATA_LINK);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log("error:", error);
        }
    };


    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const allUsers = await axios.get(USERS_LINK);
                setUsers(allUsers.data);
                setUsersLoaded(true);
            } catch (error) {
                console.log("error while loading users:", error);
            }
        };
        fetchAllUsers();
    }, []);

    function loginNewUser(user) {
        dispatch(login(user));
    }

    return (
        <AppContainer>
            <H1>Newspaper</H1> {/* todo: link */}
            <Navbar fluid rounded>
                <div className="flex md:order-2">
                    <AppButton onClick={importData} disabled={loading}>
                        {loading ? 'Importing...' : 'Import Data'}
                    </AppButton>
                    <div className={"flex items-center justify-center pl-3 pr-1"}><Text>Logged in User: </Text></div>
                    {usersLoaded ? (<UserList onChange={loginNewUser} items={users}/>) : (
                        <Text>Loading users...</Text>)}
                    <Navbar.Toggle/>
                </div>
                <Navbar.Collapse>
                    <Navbar.Link active href="/reports">
                        Reports
                    </Navbar.Link>
                    <Navbar.Link active href="/add">
                        Add Article
                    </Navbar.Link>
                </Navbar.Collapse>
            </Navbar>
            <HomepageBar>

            </HomepageBar>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Articles/>}/>
                    <Route path="/add" element={<ArticleAdd/>}/>
                    <Route path="/update/:id" element={<ArticleUpdate/>}/>
                    <Route path="/details/:id" element={<ArticleDetails/>}/>
                    <Route path="/reports" element={<Reports/>}/>
                </Routes>
            </BrowserRouter>
        </AppContainer>
    );
}

export default App;
