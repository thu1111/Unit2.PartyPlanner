//1. State
const COHORT = "2410-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  parties: [ ],
}

//2. super render
async function render() {
  await getParties();
  renderParties(); 
} 
render();

//3. get data - update state with parties from /*API*/
async function getParties() {
  try {
    const response = await fetch (API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch parties!");
    }

    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.log(error);    
  }
}

//4. render
function renderParties() {
  const partiesList = document.querySelector("#parties") //DOM link with ul

  if (!state.parties.length) {
    partiesList.innerHTML = "<li>No parties</li>";
    return;
  }

  const partyCards = state.parties.map((party)=>{
    const card = document.createElement("li");
    card.classList.add("party");
    card.innerHTML=`
    <p>Name: ${party.name}</p>
    <p>Date: ${party.date}</p>
    <p>Location: ${party.location}</p>
    <p>Description: ${party.description}</p>
    `;

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("deleteBtnClass");
    deleteBtn.textContent = "Delete Party";
    card.append(deleteBtn);

    deleteBtn.addEventListener("click", ()=>deleteParty(party.id))

    return card;
  });

  partiesList.replaceChildren(...partyCards);
}

//5. Add and Create Party
//Handle form submission for adding a party
const form = document.querySelector("form");
form.addEventListener("submit", addParty);
//addParty - collect submitted data into an object and create party
async function addParty(event) {
  event.preventDefault();

  const partyInfo = {
    name: form.partyName.value,
    date: new Date(form.partyDate.value).toISOString(),
    location: form.partyLocation.value,
    description: form.partyDescription.value,
  }

  form.reset(); //clear form after submit
  // console.log(partyInfo);
  
  await createParty(partyInfo);
}

//createParty - Ask API to create a new party and rerender /*API*/
async function createParty(partyInfo) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partyInfo),
    }); 
    const json = await response.json();
    // console.log(json);
    render();
  } catch (error) {
    console.error(error);
  }
}


//6. deleteParty - Ask API to delete a party and rerender /*API*/
async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Party could not be deleted");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}
