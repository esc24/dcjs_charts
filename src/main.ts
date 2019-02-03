// import a CSS module
import './main.css';

interface Person {
    firstName: string;
    lastName: string;
}

function main(user: Person) {
    document.getElementById('message').innerText = `Hello ${user.firstName} ${user.lastName}`;
}

export default main;