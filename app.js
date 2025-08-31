document.getElementById('fileInput').addEventListener('change', function (e) {
  const file = e.target.files[0];

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const data = results.data;
      analyzeData(data);
    }
  });
});

function analyzeData(data) {
  const summary = {};
  let income = 0;
  let expense = 0;

  data.forEach(row => {
    const amount = parseFloat(row['Debit']) || -parseFloat(row['Credit']) || 0;
    const desc = row['Description'] || row['Narration'];
    let category = 'Others';

    if (/swiggy|zomato|restaurant/i.test(desc)) category = 'Food';
    else if (/amazon|flipkart/i.test(desc)) category = 'Shopping';
    else if (/petrol|fuel/i.test(desc)) category = 'Transport';
    else if (amount < 0) category = 'Income';

    if (!summary[category]) summary[category] = 0;
    summary[category] += Math.abs(amount);

    if (amount < 0) income += Math.abs(amount);
    else expense += amount;
  });

  // Render summary table
  let tableHTML = `<tr><th>Category</th><th>Amount</th></tr>`;
  for (const cat in summary) {
    tableHTML += `<tr><td>${cat}</td><td>₹${summary[cat].toFixed(2)}</td></tr>`;
  }
  tableHTML += `<tr><td><strong>Total Income</strong></td><td>₹${income.toFixed(2)}</td></tr>`;
  tableHTML += `<tr><td><strong>Total Expenses</strong></td><td>₹${expense.toFixed(2)}</td></tr>`;
  tableHTML += `<tr><td><strong>Balance</strong></td><td>₹${(income - expense).toFixed(2)}</td></tr>`;

  document.getElementById('summaryTable').innerHTML = tableHTML;

  // Render Chart
  const ctx = document.getElementById('expenseChart').getContext('2d');
  const chartData = {
    labels: Object.keys(summary),
    datasets: [{
      label: 'Spending',
      data: Object.values(summary),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800'],
    }]
  };

  new Chart(ctx, {
    type: 'pie',
    data: chartData
  });
}
