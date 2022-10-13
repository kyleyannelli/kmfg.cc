export class HandleLogin {
    exists(email) {
        let bod = new FormData();
        bod.append("email", email);
        return this.syncRequest('POST', 'https://kmfg.cc/api/exists', bod);
    }

    create(user, pass, passConfirm) {
        let bod = new FormData();
        bod.append("email", user);
        bod.append("password", pass);
        bod.append("passwordConfirm", passConfirm);
        return this.syncRequest('POST', 'https://kmfg.cc/api/users', bod);
    }

    login(user, pass) {
        let bod = new FormData();
        bod.append("email", user);
        bod.append("password", pass);
        return this.syncRequest('POST', 'https://kmfg.cc/api/users/auth-via-email', bod);
    }

    syncRequest(method, url, bod) {
        const XHR = new XMLHttpRequest();
        XHR.open(method, url, false);
        XHR.send(bod);
        return XHR;
    }
}