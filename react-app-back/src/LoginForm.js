import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {HandleLogin} from './HandleLogin';
import PocketBase from 'pocketbase';

function handleSubmit(event) {
    // prevent page reload
    event.preventDefault();
    // create new login class
    let login = new HandleLogin();
    let result = login.exists(event.target[0].value);

    if (result.response === 'true') {
        console.log("Account exists... proceeding with login.");
        const client = new PocketBase("https://kmfg.cc");
        client.users.authViaEmail(event.target[0].value, event.target[1].value).then(result => {
            client.authStore.clear();
            client.authStore.save(result.token, result.user);
            client.authStore.exportToCookie({}, "pb_auth");
        });
    } else {
        console.log("Account doesn't exist.. show password confirmation");
        console.log(login.create(event.target[0].value, event.target[1].value, event.target[1].value));
    }
}

function LoginForm() {
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Text className="text-muted">
                    <div className="row g-0 pr-2">
                        You will be signed up for an account,
                    </div>
                    <div className="row g-0 pr-2">
                        if you don't already have one.
                    </div>
                </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
                Login
            </Button>
        </Form>
    );
}

export default LoginForm;