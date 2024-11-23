//1. State
const COHORT = "2410-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [],
};

//2. Super Render
async function render() {
  await getParties();
  renderParties();
}
render();

async function getParties() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Cannot get parties");
    }

    const json = await response.json();
    state.parties = json.data;
    //console.log(json.data);

  } catch (error) {
    console.error(error);
  }
}

function renderParties() {
  const partiesList = document.querySelector("#parties");

  if (!state.parties.length) {
    partiesList.innerHTML = "<li>There is no party!</li>";
    return;
  }

  const partyCards = state.parties.map((party) => {
    const card = document.createElement("li");
    card.classList.add("party");
    card.innerHTML = `
      <p>Name: ${party.name}</p>
      <p>Date: ${party.date}</p>
      <p>Location: ${party.location}</p>
      <p>Description: ${party.description}</p>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.textContent = "Delete party";
    card.append(deleteBtn);

    deleteBtn.addEventListener("click", () => {deleteParty(party.id)});

    return card;
  });

  partiesList.replaceChildren(...partyCards);
}

//3. Form Submit, Add and Create
const form = document.querySelector("form");
form.addEventListener("submit", addParty);

async function addParty(event) {
  event.preventDefault();

  const partyInfo = {
    name: form.partyName.value,
    date: new Date(form.partyDate.value).toISOString(),
    location: form.partyLocation.value,
    description: form.partyDescription.value,
  };
  //console.log(partyInfo);

  form.reset(); //clear form after submit

  await createParty(partyInfo);
}

async function createParty(partyInfo) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(partyInfo),
    });
    if (!response.ok) {
      throw new Error("Cannot create party!");
    }

    const json = await response.json();
    // console.log(json);

    render();
  } catch (error) {
    console.error(error);
  }
}

//4. Delete
async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Party can't be deleted!");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

//5. Update
async function updateParty(id, partyInfo) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(partyInfo),
    });
    if (!response.ok) {
      throw new Error("Party can't be updated!");
    }

    const json = await response.json();
    // console.log(json);

    render();
  } catch (error) {
    console.error(error);
  }
}
