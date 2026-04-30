const BACKEND_URL = "http://localhost:3000"; // change after deploy

const form = document.getElementById("form");
const list = document.getElementById("list");
const statusText = document.getElementById("status");

// Load items
async function loadItems() {
  statusText.textContent = "Loading...";
  try {
    const res = await fetch(`${BACKEND_URL}/items`);
    const data = await res.json();

    list.innerHTML = "";

    data.forEach(item => {
      const li = document.createElement("li");

      li.innerHTML = `
        ${item.topic} - ${item.duration} mins (${item.date})
        <button onclick="editItem(${item.id}, '${item.topic}', ${item.duration}, '${item.date}')">Edit</button>
        <button onclick="deleteItem(${item.id})">Delete</button>
      `;

      list.appendChild(li);
    });

    statusText.textContent = "";
  } catch (err) {
    statusText.textContent = "Error loading data";
  }
}

// CREATE
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const topic = document.getElementById("topic").value;
  const duration = document.getElementById("duration").value;
  const date = document.getElementById("date").value;

  await fetch(`${BACKEND_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, duration, date })
  });

  form.reset();
  loadItems();
});

// DELETE
async function deleteItem(id) {
  await fetch(`${BACKEND_URL}/items/${id}`, {
    method: "DELETE"
  });
  loadItems();
}

// UPDATE
async function editItem(id, topic, duration, date) {
  const newTopic = prompt("Edit topic", topic);
  const newDuration = prompt("Edit duration", duration);
  const newDate = prompt("Edit date", date);

  await fetch(`${BACKEND_URL}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topic: newTopic,
      duration: newDuration,
      date: newDate
    })
  });

  loadItems();
}

// initial load
loadItems();