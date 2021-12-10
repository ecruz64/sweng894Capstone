async function loadIntoTable(url,table) {
  const tableHead = table.querySelector('thead');
  const tableBody = table.querySelector('tbody');
  const response = await fetch(url);
  const data = await response.json();

  console.log(data);

}
loadIntoTable("/Users/ernestocruz/WebstormProjects/sweng894/lawn_buddy/testJson.json", document.querySelector("apiTable"))
