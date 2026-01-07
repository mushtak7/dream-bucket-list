/* ===============================
   ELEMENT REFERENCES
================================ */
const goalInput = document.getElementById("goalInput");
const categorySelect = document.getElementById("categorySelect");
const addBtn = document.getElementById("addBtn");
const goalList = document.getElementById("goalList");

const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".nav-btn");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

const emptyState = document.getElementById("emptyState");
const themeToggle = document.getElementById("themeToggle");

/* ===============================
   DATA
================================ */
let goals = JSON.parse(localStorage.getItem("goals")) || [];
let currentFilter = "all";

/* ===============================
   SAVE TO localStorage
================================ */
function saveGoals() {
    localStorage.setItem("goals", JSON.stringify(goals));
}

/* ===============================
   THEME TOGGLE
================================ */
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark") ? "dark" : "light"
    );
});

/* ===============================
   DASHBOARD COUNTS
================================ */
function updateDashboard() {
    const total = goals.length;
    const completed = goals.filter(g => g.completed).length;
    const pending = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}

/* ===============================
   RENDER GOALS
================================ */
function renderGoals() {
    goalList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();

    const filteredGoals = goals.filter(goal => {
        const matchesSearch = goal.text.toLowerCase().includes(searchText);

        if (currentFilter === "completed") {
            return goal.completed && matchesSearch;
        }
        if (currentFilter === "pending") {
            return !goal.completed && matchesSearch;
        }
        return matchesSearch;
    });

    if (filteredGoals.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    filteredGoals.forEach((goal, index) => {
        const li = document.createElement("li");
        li.className = "goal-item";

        li.innerHTML = `
            <div class="goal-left">
                <input type="checkbox" ${goal.completed ? "checked" : ""}>
                <span class="goal-text ${goal.completed ? "completed" : ""}">
                    ${goal.text}
                </span>
                <span class="tag">${goal.category}</span>
            </div>
            <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        /* Toggle completed */
        li.querySelector("input").addEventListener("change", () => {
            goal.completed = !goal.completed;
            saveGoals();
            renderGoals();
            updateDashboard();
        });

        /* Delete */
        li.querySelector(".delete-btn").addEventListener("click", () => {
            goals.splice(goals.indexOf(goal), 1);
            saveGoals();
            renderGoals();
            updateDashboard();
        });

        goalList.appendChild(li);
    });

    updateDashboard();
}

/* ===============================
   ADD GOAL
================================ */
addBtn.addEventListener("click", () => {
    const text = goalInput.value.trim();
    const category = categorySelect.value;

    if (text === "") return;

    goals.push({
        text,
        category,
        completed: false
    });

    goalInput.value = "";
    saveGoals();
    renderGoals();
    updateDashboard();
});

/* ENTER KEY SUPPORT */
goalInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addBtn.click();
});

/* ===============================
   FILTER BUTTONS
================================ */
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        currentFilter = btn.dataset.filter;
        renderGoals();
    });
});

/* ===============================
   SEARCH
================================ */
searchInput.addEventListener("input", () => {
    renderGoals();
});

/* ===============================
   INITIAL LOAD
================================ */
renderGoals();
updateDashboard();
