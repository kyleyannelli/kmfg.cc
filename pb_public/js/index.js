'use strict';

const e = React.createElement;

class Index extends React.Component {
    render() {
        return <h1> +
            "Login" +
            </h1>
    }
}

const domContainer = document.querySelector('#react-index');
const root = ReactDOM.createRoot(domContainer);
root.render(e(Index));