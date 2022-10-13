import NavigationBar from "./Navigation";
import PocketBase from "pocketbase";
import Logout from "../users/Logout.jsx";
import Unauthorized from "../error/Unauthorized.jsx";

const client = new PocketBase("https://kmfg.cc");

function Dashboard() {
    if(!client.authStore.isValid) {
        console.log("INVALID AUTH FOR KMFG.CC");
        Logout.logout();
        return(
            <Unauthorized />
        );
    }
    else {
        return(
            <div>
                <NavigationBar />
            </div>
        );
    }
}

export default Dashboard;