let btn = document.querySelector("button#add-button");
let ul = document.querySelector("ul");
let input = document.querySelector("input");
let taskCounter = document.querySelector("#taskCounter");
let themeToggle = document.querySelector("#theme-toggle");

// Icons
const sunIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const moonIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

// Theme Logic
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    themeToggle.innerHTML = sunIcon;
} else {
    themeToggle.innerHTML = moonIcon;
}

themeToggle.addEventListener("click", () => {
    const isDark = document.body.getAttribute("data-theme") === "dark";
    if (isDark) {
        document.body.removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        themeToggle.innerHTML = moonIcon;
    } else {
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        themeToggle.innerHTML = sunIcon;
    }
});

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateCounter();
};

const updateCounter = () => {
    let counter = tasks.filter(task => !task.completed).length;
    if (tasks.length === 0) {
        taskCounter.innerText = "No tasks added";
    } else if (counter === 0) {
        taskCounter.innerText = "Hooray! You've completed all your tasks.";
    } else {
        taskCounter.innerText = `${counter} Tasks left`;
    }
};

const createDOMElement = (task) => {
    let item = document.createElement("li");
    item.setAttribute("data-id", task.id);
    if (task.completed) {
        item.classList.add("completed");
    }

    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = task.completed;
    item.appendChild(checkBox);

    let taskText = document.createElement("span");
    taskText.innerText = task.text;
    item.appendChild(taskText);

    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.classList.add("delete-btn");
    item.appendChild(delBtn);

    ul.appendChild(item);
};

const addTask = (e) => {
    if (e.key === "Enter" || e.type === "click") {
        if (input.value.trim() !== "") {
            let task = {
                id: nextId,
                text: input.value,
                completed: false
            };
            tasks.push(task);
            createDOMElement(task);
            nextId++;
            saveTasks();
            input.value = "";
        } else {
            alert("Please enter a task!");
        }
    }
};

// Initialize app
tasks.forEach(createDOMElement);
updateCounter();

btn.addEventListener("click", addTask);
input.addEventListener("keydown", addTask);

ul.addEventListener("click", function (e) {
    if (e.target.nodeName === "BUTTON") {
        let listItem = e.target.parentElement;
        let taskId = Number(listItem.getAttribute("data-id"));

        let index = tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
            tasks.splice(index, 1);
            saveTasks();
        }

        listItem.remove();
    }

    if (e.target.nodeName === "INPUT") {
        let listItem = e.target.parentElement;
        let taskId = Number(listItem.getAttribute("data-id"));

        let task = tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = e.target.checked;
            if (task.completed) {
                listItem.classList.add("completed");
            } else {
                listItem.classList.remove("completed");
            }
            saveTasks();
        }
    }
});
