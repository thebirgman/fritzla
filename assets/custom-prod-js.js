document.addEventListener("DOMContentLoaded", function () {
    const readMoreBtn = document.querySelector(".read-more__btn");
    const detailsSection = document.querySelector(".product-details-tab__inner");

    if (readMoreBtn && detailsSection) {
        readMoreBtn.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default button behavior (if it's a link)
        detailsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    const descParagraph = document.querySelector(".product__description.rte.quick-add-hidden p");
    const detailsSection = document.querySelector(".product-details-tab__inner");

    if (descParagraph && detailsSection) {
      // Create the button
      const readMoreBtn = document.createElement("button");
      readMoreBtn.className = "read-more__btn";
      readMoreBtn.type = "button";
      readMoreBtn.textContent = "Read More";

      // Append it to the paragraph
      descParagraph.appendChild(readMoreBtn);

      // Add scroll event
      readMoreBtn.addEventListener("click", function (e) {
        e.preventDefault();
        detailsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
});