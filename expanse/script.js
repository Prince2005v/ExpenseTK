const expenses = [];
const borrowings = [];

// Add expense functionality
document.getElementById('expense-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('date').value || new Date().toISOString().split('T')[0];
    const category = document.getElementById('category').value;
    const item = document.getElementById('item').value;
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const description = document.getElementById('description').value;

    expenses.push({ date, category, item, amount, description });
    renderExpenses();
});

// Add borrowing functionality
document.getElementById('borrowing-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const friendName = document.getElementById('friend-name').value;
    const amount = parseFloat(document.getElementById('borrow-amount').value);

    borrowings.push({ friendName, amount });
    renderBorrowings();
});

// Render expense list
function renderExpenses() {
    const list = document.getElementById('expense-list');
    list.innerHTML = expenses.map(exp => `<p>${exp.item}: $${exp.amount} (${exp.date})</p>`).join('');
}

// Render borrowing list
function renderBorrowings() {
    const list = document.getElementById('borrowing-list');
    list.innerHTML = borrowings.map(borrow => `<p>${borrow.friendName}: $${borrow.amount}</p>`).join('');
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark');
}

// Export to PDF
function exportToPDF() {
    const content = `
        <h1>Expense Insights</h1>
        <p>Total Expenses: ${expenses.reduce((acc, exp) => acc + exp.amount, 0)}</p>
        <p>Total Borrowings: ${borrowings.reduce((acc, b) => acc + b.amount, 0)}</p>
    `;
    const pdfWindow = window.open();
    pdfWindow.document.write(content);
}

// Share via Email
function shareViaEmail() {
    const subject = 'Expense Insights';
    const body = `Here are your insights:\n
    Total Expenses: $${expenses.reduce((acc, exp) => acc + exp.amount, 0)}\n
    Total Borrowings: $${borrowings.reduce((acc, b) => acc + b.amount, 0)}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Function to export expenses to PDF
function exportToPDF() {
    const doc = new jsPDF();
    let yPosition = 10;

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Expense List", 10, yPosition);
    yPosition += 10;

    // Get items from the expense list
    const expenseItems = document.querySelectorAll(".expense-item strong");
    if (expenseItems.length === 0) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("No expenses to show.", 10, yPosition);
    } else {
        expenseItems.forEach((item, index) => {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(`${index + 1}. ${item.textContent}`, 10, yPosition);
            yPosition += 10;
        });
    }

    // Save PDF
    doc.save("expenses.pdf");
}

// Function to share expenses via email
function shareViaEmail() {
    const expenseItems = document.querySelectorAll(".expense-item strong");
    if (expenseItems.length === 0) {
        alert("No expenses to share.");
        return;
    }

    const emailBody = Array.from(expenseItems)
        .map((item, index) => `${index + 1}. ${item.textContent}`)
        .join("%0A"); // Use %0A for new lines in email body

    const mailToLink = `mailto:?subject=My Expense List&body=Here are my expenses:%0A${emailBody}`;
    window.location.href = mailToLink;
}

// Attach event listeners to buttons
document.getElementById("export-pdf-button").addEventListener("click", exportToPDF);
document.getElementById("email-button").addEventListener("click", shareViaEmail);
// Function to toggle dark mode
function toggleDarkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

// Function to add expense
function addExpense() {
    var date = document.getElementById("date").value;
    var category = document.getElementById("category").value;
    var item = document.getElementById("item").value;
    var amount = document.getElementById("amount").value;
    var description = document.getElementById("description").value;

    var expenseList = document.getElementById("expense-list");
    var expenseItem = document.createElement("div");
    expenseItem.innerHTML = `
        <p>Date: ${date}</p>
        <p>Category: ${category}</p>
        <p>Item: ${item}</p>
        <p>Amount: ${amount}</p>
        <p>Description: ${description}</p>
    `;
    expenseList.appendChild(expenseItem);
}

// Function to add borrowing
function addBorrowing() {
    var friendName = document.getElementById("friend-name").value;
    var amount = document.getElementById("amount").value;

    var borrowingList = document.getElementById("borrowing-list");
    var borrowingItem = document.createElement("div");
    borrowingItem.innerHTML = `
        <p>Friend's Name: ${friendName}</p>
        <p>Amount: ${amount}</p>
    `;
    borrowingList.appendChild(borrowingItem);
}

// Event listeners
document.getElementById("submit-btn").addEventListener("click", function(event) {
    event.preventDefault();
    addExpense();
});

document.getElementById("borrow-submit-btn").addEventListener("click", function(event) {
    event.preventDefault();
    addBorrowing();
});
document.getElementById("add-participant").addEventListener("click", () => {
    const participantsDiv = document.getElementById("participants");
    const newParticipant = document.createElement("div");
    newParticipant.className = "participant";
    newParticipant.innerHTML = `
      <label for="name">Name:</label>
      <input type="text" class="name" placeholder="Enter Name" required>
      <label for="amount">Amount Paid:</label>
      <input type="number" class="amount" placeholder="Amount in $" required>
    `;
    participantsDiv.appendChild(newParticipant);
  });
  
  document.getElementById("calculate-split").addEventListener("click", () => {
    const names = document.querySelectorAll(".name");
    const amounts = document.querySelectorAll(".amount");
  
    let participants = [];
    names.forEach((name, index) => {
      participants.push({
        name: name.value,
        amount: parseFloat(amounts[index].value) || 0,
      });
    });
  
    const total = participants.reduce((sum, participant) => sum + participant.amount, 0);
    const perPerson = total / participants.length;
  
    let summary = [];
    participants.forEach((participant) => {
      const diff = participant.amount - perPerson;
      summary.push({
        name: participant.name,
        owes: diff < 0 ? Math.abs(diff).toFixed(2) : null,
        gets: diff > 0 ? diff.toFixed(2) : null,
      });
    });
  
    const summaryList = document.getElementById("summary-list");
    summaryList.innerHTML = "";
    summary.forEach((entry) => {
      const listItem = document.createElement("li");
      listItem.textContent = entry.owes
        ? `${entry.name} owes $${entry.owes}`
        : `${entry.name} gets $${entry.gets}`;
      summaryList.appendChild(listItem);
    });
  });
  
