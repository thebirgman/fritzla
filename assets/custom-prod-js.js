document.addEventListener("DOMContentLoaded", function () {
    const readMoreBtn = document.querySelector(".read-more__btn");
    const detailsSection = document.querySelector(".product-details-tab__inner");

    if (readMoreBtn && detailsSection) {
        readMoreBtn.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent default button behavior (if it's a link)
        detailsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }
});