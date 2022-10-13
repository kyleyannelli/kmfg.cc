import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";


function handleSubmit(event) {
    event.preventDefault();

}

function ConfirmationModal() {
    return(
        <div class="modal hide fade" id="passwordConfirmationModal" hidden={true}>
            HELLO
        </div>
        // <Modal
        //     id="passwordConfirmationModal"
        // >
        //     <Modal.Title>Confirm Your Password</Modal.Title>
        //     <Modal.Body>
        //         <Form onSubmit={handleSubmit}>
        //             <Form.Group className="mb-3" controlId="formBasicPassword">
        //                 <Form.Label>Password</Form.Label>
        //                 <Form.Control type="password" placeholder="Password" />
        //             </Form.Group>
        //             <Button variant="primary" type="submit">
        //                 Sign up & Login
        //             </Button>
        //         </Form>
        //     </Modal.Body>
        // </Modal>
    );
}

export default ConfirmationModal;