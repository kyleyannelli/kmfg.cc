import PocketBase from "pocketbase";


const client = new PocketBase("https://kmfg.cc");

class Logout {
    static logout() {
        if(client.authStore.isValid) {
            client.authStore.clear();
            window.location.replace("https://kmfg.cc");
        }
        else {
            window.location.replace("https://kmfg.cc");
        }
    }
}