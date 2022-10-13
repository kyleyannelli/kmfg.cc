import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import imgUrl from "./../../assets/k.png";
import "./Main.css";
import Logout from "../users/Logout.jsx";

function logout(event) {
    event.preventDefault();
    Logout.logout();
}

function messages(event) {
    event.preventDefault();
    window.location.href = "https://kmfg.cc/dashboard/messages";
}

function settings(event) {
    event.preventDefault();
    window.location.href = "https://kmfg.cc/dashboard/settings";
}

function NavigationBar() {
    return(
        <Nav>
            <Navbar>
                <Navbar.Brand>
                    <img id="navbarBrand" src={imgUrl} alt={"KMFG"} />
                </Navbar.Brand>
                <Nav.Item>
                    <Nav.Link onClick={messages}>
                        Messages
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={settings}>
                        Settings
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link onClick={logout}>
                        Logout
                    </Nav.Link>
                </Nav.Item>
            </Navbar>
        </Nav>
    );
}

export default NavigationBar;