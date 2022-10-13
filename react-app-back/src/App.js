import './App.css';
import LoginForm from "./LoginForm";
import Card from 'react-bootstrap/Card'

function LoginCard() {
    return(
        <Card className="p-20">
            <Card.Body>
                <LoginForm />
            </Card.Body>
        </Card>
    );
}

function App() {
  return (
    <div className="font h-100 d-flex justify-content-center align-items-center">
      <LoginCard />
    </div>
  );
}

export default App;

