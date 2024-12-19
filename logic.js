const URL = 'https://the-trivia-api.com/api/questions';
let player = 0;
const players = [{ name: "", scores: 0 }, { name: "", scores: 0 }];
let q_index = 0;
let cat = [];
let questions = [];
let options = [];
const difficulties = ['easy', 'medium', 'hard'];

document.getElementById('names').addEventListener('click', player_names);

//taking player names
async function player_names() {
    const player1 = document.getElementById('name1').value;
    const player2 = document.getElementById('name2').value;
    if (!player1 || !player2) {
        alert("Please enter both player names.");
        return;
    }
    players[0].name = player1;
    players[1].name = player2;

    show_category();
}

(async function categories() {
    let category = await fetch('https://the-trivia-api.com/api/categories')
    cat = await category.json();
})();

//loading categories
function show_category() {
    const dropdown = document.getElementById('dropdown');
    dropdown.innerHTML = '';
    document.getElementById('name').style.display = 'none';
    document.getElementById('choices').style.display = 'block';
    document.getElementById('Next').style.display = 'none';

    let c=0;
    for (let key in cat) {
        const option = document.createElement('option');
        option.value = c;
        c++;
        option.textContent = key;
        dropdown.appendChild(option);
    }
}

document.getElementById('select').addEventListener('click', question_fetch);

//question fetching
async function question_fetch() {

    document.getElementById('choices').style.display = 'none';
    document.getElementById('questions').style.display = 'block';

    let index = document.getElementById('dropdown');
    let keys= Object.keys(cat);
    category = keys[index.value];
    // console.log(category);
    // console.log(index.value);

    //deleting chooseng category
    delete cat[keys[index.value]];
    // console.log(cat);

    for (let dif of difficulties) {
        let response = await fetch(`${URL}?categories=${category}&difficulty=${dif}&limit=2`);
        let question = await response.json();
        if (question.length != 2) {
            window.alert("Error fetching question!!!")
            window.stop();
        }
        questions = questions.concat(question);
    }
    display();
}


//printing question
function display() {
    if (q_index % 2 == 0) {
        player = 0;
    }
    else {
        player = 1;
    }

    document.getElementById("index").textContent = `Question ${q_index + 1}`;
    document.getElementById("playerid").textContent = `${players[player].name}`;
    document.getElementById("difficulty").textContent = `${questions[q_index].difficulty}`;

    document.getElementById('answer-choices').innerHTML = '';
    document.getElementById('question-text').textContent = questions[q_index].question;

    // console.log(questions[q_index].correctAnswer);

    options = questions[q_index].incorrectAnswers;
    let i = Math.floor(Math.random() * 4);
    options.splice(i, 0, questions[q_index].correctAnswer);

    options.forEach(option => {
        let li = document.createElement('li');
        let button = document.createElement('button');
        button.textContent = option;
        button.classList.add('answer-choice');
        button.addEventListener('click', score);

        li.appendChild(button);
        document.getElementById('answer-choices').appendChild(li);
    });
}


//checking marks
function marks() {
    switch (questions[q_index].difficulty) {
        case 'easy':
            return 10;
        case 'medium':
            return 15;
        case 'hard':
            return 20;
        default:
            return 0;
    }
}


//checking answer
function score(event) {
    const Button = event.target;
    const answer = Button.textContent;
    if (answer === questions[q_index].correctAnswer) {
        players[player].scores += marks();
    }
    q_index++;
    if (q_index < questions.length) {
        display();
    }
    else {
        document.getElementsByClassName('questions').innerHTML = '';
        document.getElementById('questions').style.display = 'none';
        if (cat != []) {
            document.getElementById('Next').style.display = 'block';//to continue
        }
        else {
            result();
        }
    }
}

document.getElementById('continue').addEventListener('click', show_category);
document.getElementById('end').addEventListener('click', result);

//printing result
function result() {
    document.getElementById('Next').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    const winner = players[0].scores > players[1].scores ? "The winner is " + players[0].name +"!!!": players[0].scores < players[1].scores ? "The winner is " + players[1].name +"!!!": "It is a Tie";
    document.getElementById('winner').textContent = `${winner}`;
    document.getElementById('score').textContent = `${players[0].name} : ${players[0].scores} | ${players[1].name} : ${players[1].scores}`;
}