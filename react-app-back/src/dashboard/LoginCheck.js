import PocketBase from "pocketbase";
import React, { useEffect } from 'react';

function UpdateTitle() {
    useEffect(() => {
        document.title = "KMFG - Dashboard";
    })
}

function LoginCheck() {
    const client = new PocketBase("https://kmfg.cc");
    if(client.authStore.isValid) {
        UpdateTitle();
        return(
            <div>
                {"Hello, " + client.authStore.model.email}
            </div>
        );
    }
    return(
        <div>
            {"You are not logged in!"}
        </div>
    );
}

export default LoginCheck;