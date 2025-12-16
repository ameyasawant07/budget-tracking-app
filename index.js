let balance = 0;
let lastTransaction = null;

// load saved transactions
let allTransactions = JSON.parse(localStorage.getItem("transactions")) || [];

// render saved transactions on load
allTransactions.forEach(t => renderItem(t));

function addTransaction(){
  const desc = document.getElementById("desc").value.trim();
  const amt = Number(document.getElementById("amt").value);
  const type = document.getElementById("type").value;

  if(!desc || amt <= 0) return;

  // 🔍 check if same description already exists
  const index = allTransactions.findIndex(
    t => t.desc.toLowerCase() === desc.toLowerCase()
  );

  if(index !== -1){
    // ✅ update existing transaction amount
    if(type === "income"){
      allTransactions[index].amt += amt;
    } else {
      allTransactions[index].amt -= amt;
    }

    // if amount becomes negative, convert type
    if(allTransactions[index].amt < 0){
      allTransactions[index].amt = Math.abs(allTransactions[index].amt);
      allTransactions[index].type = "expense";
    }

    // 🔄 re-render everything
    document.getElementById("list").innerHTML = "";
    balance = 0;
    allTransactions.forEach(t => renderItem(t));
  } else {
    // ➕ new transaction
    const transaction = { desc, amt, type };
    allTransactions.push(transaction);
    renderItem(transaction);
  }

  localStorage.setItem("transactions", JSON.stringify(allTransactions));

  lastTransaction = { desc, amt, type };

  document.getElementById("desc").value = "";
  document.getElementById("amt").value = "";
}


function renderItem({ desc, amt, type }){
  const item = document.createElement("div");
  item.className = "item";

  const sign = type === "income" ? "+" : "-";
  const cls = type === "income" ? "income" : "expense";

  item.innerHTML = `
    <span>${desc}</span>
    <span class="${cls}">
      ${sign}₹${amt}
      <button onclick="deleteTransaction(this)">❌</button>
    </span>
  `;

  document.getElementById("list").appendChild(item);

  balance += type === "income" ? amt : -amt;
  document.getElementById("balance").innerText = balance;
}

function deleteTransaction(btn){
  const item = btn.closest(".item");
  const index = [...item.parentNode.children].indexOf(item);

  const t = allTransactions[index];
  balance += t.type === "income" ? -t.amt : t.amt;

  allTransactions.splice(index, 1);
  localStorage.setItem("transactions", JSON.stringify(allTransactions));

  item.remove();
  document.getElementById("balance").innerText = balance;
}

function showHistory(){
  if(allTransactions.length === 0){
    alert("No transactions yet!");
    return;
  }

  let historyText = "All Transactions:\n\n";

  allTransactions.forEach((t, i) => {
    const sign = t.type === "income" ? "+" : "-";
    historyText += `${i + 1}. ${t.desc} : ${sign}₹${t.amt} (${t.type})\n`;
  });

  alert(historyText);
}

// ✅ clear all transactions
function clearAll(){
  if(!confirm("Are you sure you want to clear all transactions?")) return;

  allTransactions = [];
  localStorage.removeItem("transactions");

  document.getElementById("list").innerHTML = "";
  balance = 0;
  document.getElementById("balance").innerText = balance;
}