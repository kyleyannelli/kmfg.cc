import Card from "react-bootstrap/Card";
import LoginForm from "./LoginForm.jsx";


function LoginCard() {
    return(
        <Card className="p-20">
            <Card.Body>
                <LoginForm />
            </Card.Body>
        </Card>
    );
}

function Home() {
    return (
        <div className="font h-100 d-flex justify-content-center align-items-center">
            <LoginCard />
        </div>
    );
}

export default Home;

