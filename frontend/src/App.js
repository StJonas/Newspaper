import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Articles from "./pages/Articles";
import ArticleDetails from "./pages/ArticleDetails";
import ArticleUpdate from "./pages/ArticleUpdate";
import ArticleAdd from "./pages/ArticleAdd";
import Reports from "./pages/Reports";
import React, {useEffect, useState} from "react";
import AppContainer from "./components/AppContainer";
import {H1, Text} from "./components/Typography";
import AppButton from "./components/AppButton";
import {DB_SWITCH_LINK, IMPORT_DATA_LINK, USERS_LINK} from "./assets/constants";
import axios from "axios";
import UserList from "./components/UserList";
import {Navbar, Spinner} from "flowbite-react";
import {useDispatch} from "react-redux";
import {login} from './assets/loggedInUserSlice';
import {useSelector} from "react-redux";

function App() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersLoaded, setUsersLoaded] = useState(false);
    const [isJournalist, setJournalist] = useState(false);
    const dispatch = useDispatch();
    const loggedInUser = useSelector(state => state.loggedInUser);
    const [switchBTNloading, setSwitchBTNloading] = useState(false);

    const importData = async () => {
        try {
            setLoading(true);
            await axios.post(IMPORT_DATA_LINK);
            setLoading(false);
            await fetchAllUsers().then(() => {
                window.location.reload();
            });
        } catch (error) {
            setLoading(false);
            console.log("error:", error);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const allUsers = await axios.get(USERS_LINK);
            setUsers(allUsers.data);
            setUsersLoaded(true);
        } catch (error) {
            console.log("error while loading users:", error);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    function loginNewUser(user) {
        dispatch(login(user));
    }

    useEffect(() => {
        if (loggedInUser && loggedInUser.isJournalist) {
            setJournalist(true);
        } else {
            setJournalist(false);
        }
    }, [loggedInUser]);

    const switchDB = async () => {
        try {
            setSwitchBTNloading(true);
            await axios.put(DB_SWITCH_LINK);
            setSwitchBTNloading(false);
            window.location.reload();
        } catch (error) {
            setSwitchBTNloading(false);
            console.log("error:", error);
        }
    };

    return (
        <AppContainer>
            <BrowserRouter>
                <H1><Link to={"/"}>Newspaper</Link></H1>
                {/*<Text>{loggedInUser.username} {loggedInUser.user_id}</Text>*/}
                <Navbar fluid rounded>
                    <div className="flex md:order-2">
                        <AppButton onClick={importData} disabled={loading}>
                            {loading ? 'Importing...' : 'Import Data'}
                        </AppButton>
                        <AppButton onClick={switchDB} disabled={switchBTNloading} classes={"ml-2"}>
                            {loading ? 'Switching DB...' : 'Switch DB'}
                        </AppButton>
                        <div className={"flex items-center justify-center pl-3 pr-1"}><Text>Logged in User: </Text>
                        </div>
                        {usersLoaded ? (<UserList onChange={loginNewUser} items={users}/>) : (
                            <div className={"flex items-center justify-center"}><Spinner
                                aria-label="Center-aligned spinner example"/></div>)}
                        <Navbar.Toggle/>
                    </div>
                    <Navbar.Collapse>
                        <Navbar.Link as={Link} to="/reports" active>
                            Reports
                        </Navbar.Link>
                        {isJournalist && (
                            <Navbar.Link as={Link} to="/add" active>
                                Add Article
                            </Navbar.Link>
                        )}
                    </Navbar.Collapse>
                </Navbar>
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
