let btn = document.querySelector("button#add-button");
let input = document.querySelector("input");
let taskCounter = document.querySelector("#taskCounter");
let themeToggle = document.querySelector("#theme-toggle");

// Select the three columns
const todoList = document.getElementById("todo-list");
const inprogressList = document.getElementById("inprogress-list");
const doneList = document.getElementById("done-list");

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
// MIGRATION: Ensure all tasks have a status. Default to 'todo' if missing.
tasks = tasks.map(task => {
    if (!task.status) {
        return { ...task, status: 'todo' };
    }
    return task;
});

let nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

const saveTasks = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateCounter();
};

const updateCounter = () => {
    // Count tasks that are NOT in the 'done' column
    let counter = tasks.filter(task => task.status !== 'done').length;
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
    item.setAttribute("draggable", "true"); // Enable dragging

    // Add class for styling if completed (optional, mostly handled by column now)
    if (task.status === 'done') {
        item.classList.add("completed");
    }

    let checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = task.status === 'done';

    // Checkbox behavior: Move to Done or back to Todo
    checkBox.addEventListener("change", (e) => {
        if (e.target.checked) {
            task.status = 'done';
            item.classList.add("completed");
            doneList.appendChild(item);
        } else {
            task.status = 'todo';
            item.classList.remove("completed");
            todoList.appendChild(item);
        }
        saveTasks();
    });

    item.appendChild(checkBox);

    let taskText = document.createElement("span");
    taskText.innerText = task.text;
    item.appendChild(taskText);

    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.classList.add("delete-btn");
    delBtn.addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        item.remove();
        saveTasks();
    });
    item.appendChild(delBtn);

    // DRAG EVENTS
    item.addEventListener("dragstart", () => {
        item.classList.add("dragging");
    });

    item.addEventListener("dragend", () => {
        item.classList.remove("dragging");

        // Update data model based on new parent
        const parentId = item.parentElement.id;
        if (parentId === "todo-list") task.status = 'todo';
        else if (parentId === "inprogress-list") task.status = 'inprogress';
        else if (parentId === "done-list") task.status = 'done';

        // Update visual style for done
        if (task.status === 'done') {
            item.classList.add("completed");
            checkBox.checked = true;
        } else {
            item.classList.remove("completed");
            checkBox.checked = false;
        }

        saveTasks();
    });

    // Append to the correct column based on status
    if (task.status === 'todo') todoList.appendChild(item);
    else if (task.status === 'inprogress') inprogressList.appendChild(item);
    else if (task.status === 'done') doneList.appendChild(item);
};

// COLUMN DRAG OVER EVENTS
const columns = [todoList, inprogressList, doneList];

columns.forEach(column => {
    column.addEventListener("dragover", (e) => {
        e.preventDefault(); // Necessary to allow dropping
        const draggable = document.querySelector(".dragging");
        if (draggable) {
            column.appendChild(draggable);
        }
    });
});

const addTask = (e) => {
    if (e.key === "Enter" || e.type === "click") {
        if (input.value.trim() !== "") {
            let task = {
                id: nextId,
                text: input.value,
                status: 'todo' // Default status
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
