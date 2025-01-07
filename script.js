const StartBtn = document.querySelector("#start-btn");
const StartPage = document.querySelector(".quiz-start-container");
const QuestionPage = document.querySelector(".question-page");
const HighestScore = document.querySelector("#highest-score");
const QuestionNumber = document.querySelector("#question-number");
const realQuestion = document.querySelector("#question");
const options = document.querySelectorAll(".options-container button");
const optionCont = document.querySelector(".options-container");
const nextBtn = document.querySelector(".next-container button");
const timer = document.querySelector("#timer");
const timeup = document.querySelector("#timeup");
const ResultBtn = document.querySelector("#Result");
const CorrectAnswers = document.querySelector("#correct-answers");
const winPercentage = document.querySelector("#win-percent");
const losePercentage = document.querySelector("#lose-percent");
const green = document.querySelector(".green-container");
const red = document.querySelector(".red");
const retryBtn = document.querySelector("#retry-btn");
const ResultPage = document.querySelector(".result-page");
const musicBtn = document.querySelector("#music");

let CurrQuestion = 1;
let totalQuestions = 0;
let score = 0;
let interval ;
let audio = new Audio("Purity - Beautiful Piano Song, Relaxing BGM BigRicePiano.mp3");

let musicState = localStorage.getItem("musicState");

if (localStorage.getItem("scr") === null) {
    localStorage.setItem("scr", 0);
}
else{
    HighestScore.innerHTML = `Highest Score: ${localStorage.getItem("scr")}/25`; 
}


StartBtn.addEventListener("click",()=>{
    StartPage.style.display = "none";
    QuestionPage.style.display = "flex";
    timeSet();
    displayQuestions();
    audio.play();
    if (musicState === "paused") {
        musicBtn.src= "./assets/mute.svg";
        audio.pause();
    }
    else{
        musicBtn.src = "./assets/music.svg";
        audio.play();
    }
})

musicBtn.addEventListener("click",()=>{
    if (musicBtn.src.includes("music.svg")) {
        musicBtn.src = "./assets/mute.svg";
        audio.pause();
        localStorage.setItem("musicState", "paused");
    }
    else if(musicBtn.src.includes("mute.svg")){
        musicBtn.src = "./assets/music.svg";
        audio.play();
        localStorage.setItem("musicState", "playing");
    }
})

let questionsData; 

async function getData() {
    if (!questionsData) {  
        const questionsJson = "questions.json";
        let data = await fetch(questionsJson);
        questionsData = await data.json();
    }
    return questionsData;
}

async function displayQuestions() {
    let result = await getData();
    let questions = result.questions;
    totalQuestions = questions.length;
    QuestionNumber.innerText = `${CurrQuestion}/${totalQuestions}`;
    realQuestion.innerText = questions[CurrQuestion-1].question;
    options.forEach((e,n=0)=>{
        e.innerHTML= "";
        e.innerText =questions[CurrQuestion-1].options[n];
    })
}   

optionCont.addEventListener("click",async function(e){
    let result = await getData();
    let questions = result.questions;
    if (e.target!=optionCont) {
    if (e.target.innerText === questions[CurrQuestion-1].answer) {
        e.target.style.border = "3px solid rgba(53, 189, 58, 1)";
        e.target.innerHTML = `${e.target.innerText} <span><img src="./assets/correct.svg" alt=""></span>`;
        score = score + 1;
        clearInterval(interval);
        DisableOptions();
    }
    else{
        e.target.style.border = "3px solid rgba(255, 122, 122, 1)";
        e.target.innerHTML = `${e.target.textContent} <span><img src="./assets/wrong.svg" alt="cross image"></span>`;
        clearInterval(interval);
        ShowAnswer();
        DisableOptions();
    }
    nextBtn.innerText = "Next >";
    nextBtn.style.color = "rgba(1, 171, 8, 1)";

    if (CurrQuestion === totalQuestions) {
        nextBtn.style.display = "none";
        ResultBtn.style.display = "block";
    }
}
}) 

async function ShowAnswer() {
    let result = await getData();
    let questions = result.questions;
    let answer = questions[CurrQuestion-1].answer;
    options.forEach((e)=>{
        if (e.innerHTML === answer) {
            e.style.border = "3px solid rgba(53, 189, 58, 1)";
        }
    })

}

function DisableOptions() {
    options.forEach((e)=>{
        e.style.color = "black";
        e.disabled = true;
    })
}

function timeSet() {
    let seconds = 15;
    let halftime = seconds/2;
    let endtime = 20/100*seconds;
    
    timer.innerHTML = `00:${seconds}`;
    interval = setInterval(()=>{

        if (seconds <= -1) { 
            clearInterval(interval); 
            timeup.style.display = "block";
            if (CurrQuestion === totalQuestions) {
                nextBtn.style.display = "none";
                ResultBtn.style.display = "block";
            } 
            nextBtn.innerText = "Next >";
        nextBtn.style.color = "rgba(1, 171, 8, 1)";
            ShowAnswer(); 
            DisableOptions(); 
            return; 
        }
        if (seconds<10) {
            timer.innerHTML = `00:0${seconds}`;
        }
        else{
            timer.innerHTML = `00:${seconds}`;
        }
        seconds--;
        
        if(seconds > halftime){
            QuestionPage.style.backgroundColor = "#CCE2C2";
            timer.style.backgroundColor = "rgba(2, 164, 9, 0.7)";
            timer.style.boxShadow = "0px 2px 0 3px rgba(2, 164, 9, 0.43),0px -2px 0 3px rgba(2, 164, 9, 0.43)";
        }
        if (seconds< halftime) {
            QuestionPage.style.backgroundColor = "rgba(228, 229, 199, 1)";
            timer.style.backgroundColor = "rgba(197, 177, 0, 0.7)";
            timer.style.boxShadow = "0px 2px 0 3px rgba(197, 177, 0, 0.43),0px -2px 0 3px rgba(197, 177, 0, 0.43)";
            nextBtn.style.color = "rgba(197, 136, 0, 1)";
        }
        if(seconds<endtime){
            QuestionPage.style.backgroundColor = "rgba(219, 173, 173, 1)";
            timer.style.backgroundColor = "rgba(197, 12, 0, 0.7)";
            timer.style.boxShadow = "0px 2px 0 3px rgba(197, 12, 0, 0.43),0px -2px 0 3px rgba(197, 12, 0, 0.43)";
            nextBtn.style.color = "rgba(197, 0, 0, 1)";
        }
    },1000)
    
}

nextBtn.addEventListener("click", () => {
    if (CurrQuestion < totalQuestions) {
        clearInterval(interval);
        QuestionPage.style.backgroundColor = "#CCE2C2";
        timer.style.backgroundColor = "rgba(2, 164, 9, 0.7)";
        timer.style.boxShadow = "0px 2px 0 3px rgba(2, 164, 9, 0.43), 0px -2px 0 3px rgba(2, 164, 9, 0.43)";
        nextBtn.style.color = "rgba(197, 0, 0, 1)";
        nextBtn.innerText = "Skip >"
        
        timeSet();

        timeup.style.display = "none";
        options.forEach((e) => {
            e.disabled = false;
            e.style.border = "3px solid rgba(217, 217, 217, 1)";
        });

        CurrQuestion++;
        displayQuestions();
    }
});

ResultBtn.addEventListener("click",()=>{
    ResultPage.style.display = "flex";
    QuestionPage.style.display = "none";
    if (score<=totalQuestions) {
        let win = score/totalQuestions*100;
        win = win.toFixed(2);
        green.style.width = win + "%"; 
    winPercentage.innerHTML =  win + "%";
    let lose = 100-win;
    losePercentage.innerHTML =  lose + "%";
    CorrectAnswers.innerHTML= `${score}/${totalQuestions}`;
    if (score>localStorage.getItem("scr")) {
        NewHighestScore(score);
    }
    }
})

retryBtn.addEventListener("click",()=>{
    // score = 0;
    // QuestionPage.style.backgroundColor = "#CCE2C2";
    // timer.style.backgroundColor = "rgba(2, 164, 9, 0.7)";
    // timer.style.boxShadow = "0px 2px 0 3px rgba(2, 164, 9, 0.43),0px -2px 0 3px rgba(2, 164, 9, 0.43)";
    // nextBtn.style.color = "rgba(1, 171, 8, 1)";
    // ResultPage.style.display = "none";
    // StartPage.style.display = "flex";
    window.location.reload();
})


function NewHighestScore(newscore) {
          localStorage.setItem("scr",newscore); 
          HighestScore.innerHTML = `Highest Score: ${localStorage.getItem("scr")}/${totalQuestions}`; 
}
