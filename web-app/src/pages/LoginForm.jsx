import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {HandleLogin} from '../handlers/HandleLogin.jsx';
import PocketBase from 'pocketbase';
import "./kstrap.css";


const client = new PocketBase("https://kmfg.cc");
function handleSubmit(event) {
    // prevent page reload
    event.preventDefault();
    // create new login class
    let login = new HandleLogin();
    let result = login.exists(event.target[0].value);

    if (result.response === 'true') {
        loginAsync(event.target[0].value, event.target[1].value);
    } else {
        document.getElementById("formErrorContent").innerHTML = "";
        document.getElementById("formErrorContent2").innerHTML = "";
        if(event.target[2].value == null || event.target[2].value === "") {
            $("#passwordConfirmationForm").removeClass("hideFormControl");
            $("#formErrorGroup").removeClass("hideFormControl");
            document.getElementById("formErrorContent").innerHTML = "You don't have an account!";
            document.getElementById("formErrorContent2").innerHTML = "Please confirm your password.";
        }
        else {
            $("#formErrorGroup").addClass("hideFormControl");
            if(event.target[2].value !== event.target[1].value) {
                // if passwords are not the same
                $("#formErrorGroup").removeClass("hideFormControl");
                document.getElementById("formErrorContent").innerHTML = "Passwords do not match!";
                return;
            }
            if(event.target[2].value.length < 8) {
                // if password doesnt meet length requirements
                $("#formErrorGroup").removeClass("hideFormControl");
                document.getElementById("formErrorContent").innerHTML = "Password must be at least 8 characters!";
                return;
            }
            let result = login.create(event.target[0].value, event.target[1].value, event.target[2].value);
            if(result.status === 200) {
                loginAsync(event.target[0].value, event.target[1].value);
            } else {
                // something went wrong with creating the account
                $("#formErrorGroup").removeClass("hideFormControl");
                document.getElementById("formErrorContent").innerHTML = "Something went wrong creating your account :(";
                document.getElementById("formErrorContent2").innerHTML = "Please contact support@kmfg.cc if this continues to be an issue.";
            }
        }
    }
}

function loginAsync(user, password) {
    client.users.authViaEmail(user, password).then(result => {
        console.log(result);
        client.authStore.clear();
        client.authStore.save(result.token, result.user);
        client.authStore.exportToCookie({}, "pb_auth");
        window.location.href = "https://kmfg.cc/dashboard";
    }).catch(failure => {
        failure = failure.toString();
        if(failure.toLowerCase().includes("400") || failure.toLowerCase().includes("failed to authenticate")) {
            $("#formErrorGroup").removeClass("hideFormControl");
            document.getElementById("formErrorContent").innerHTML = "Incorrect password.";
        }
        else {
            $("#formErrorGroup").removeClass("hideFormControl");
            document.getElementById("formErrorContent").innerHTML = "An unknown error occurred logging in.";
        }
    });
}

function LoginForm() {
    return (
        <div>
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

                <Form.Group id="passwordConfirmationForm" className="mb-3 mb-3 hideFormControl" controlId="formBasicPasswordConfirmation">
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type="password" placeholder="Password Confirmation" />
                </Form.Group>

                <Form.Group className="mb-3 hideFormControl" id="formErrorGroup">
                    <Form.Text className="text-danger">
                        <div className="row g-0 pr-2" id="formErrorContent">

                        </div>
                    </Form.Text>
                    <Form.Text className="text-danger">
                        <div className="row g-0 pr-2" id="formErrorContent2">

                        </div>
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
        </div>
    );
}

export default LoginForm;