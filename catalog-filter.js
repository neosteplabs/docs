const searchInput = document.getElementById("searchInput");
const compoundFilter = document.getElementById("compoundFilter");
const mgFilter = document.getElementById("mgFilter");
const productCards = document.querySelectorAll(".product-card");

function filterProducts() {

  const searchValue = searchInput.value.toLowerCase();
  const compoundValue = compoundFilter.value;
  const mgValue = mgFilter.value;

  productCards.forEach(card => {

    const name = card.dataset.name.toLowerCase();
    const compound = card.dataset.compound;
    const mg = card.dataset.mg;

    const matchesSearch = name.includes(searchValue);
    const matchesCompound = compoundValue === "" || compound === compoundValue;
    const matchesMg = mgValue === "" || mg === mgValue;

    if (matchesSearch && matchesCompound && matchesMg) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }

  });
}

searchInput.addEventListener("input", filterProducts);
compoundFilter.addEventListener("change", filterProducts);
mgFilter.addEventListener("change", filterProducts);