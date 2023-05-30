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
import {IMPORT_DATA_LINK, USERS_LINK} from "./assets/constants";
import axios from "axios";
import UserList from "./components/UserList";
import {Navbar, Spinner} from "flowbite-react";
import {useDispatch} from "react-redux";
import {login} from './assets/loggedInUserSlice';
// import {useSelector} from "react-redux";

function App() {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersLoaded, setUsersLoaded] = useState(false);
    const dispatch = useDispatch();
    // const loggedInUser = useSelector(state => state.loggedInUser);

    const importData = async () => {
        try {
            setLoading(true);
            await axios.post(IMPORT_DATA_LINK);
            setLoading(false);
            await fetchAllUsers().then(()=>{
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
        console.log(user);
        dispatch(login(user));
    }

    return (
        <AppContainer>
            <BrowserRouter>
                <H1><Link to={"/"} >Newspaper</Link></H1>
                {/*<Text>{loggedInUser.username} {loggedInUser.user_id}</Text>*/}
                <Navbar fluid rounded>
                    <div className="flex md:order-2">
                        <AppButton onClick={importData} disabled={loading}>
                            {loading ? 'Importing...' : 'Import Data'}
                        </AppButton>
                        <div className={"flex items-center justify-center pl-3 pr-1"}><Text>Logged in User: </Text></div>
                        {usersLoaded ? (<UserList onChange={loginNewUser} items={users}/>) : (
                            <div className={"flex items-center justify-center"}><Spinner
                                aria-label="Center-aligned spinner example"/></div>)}
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
