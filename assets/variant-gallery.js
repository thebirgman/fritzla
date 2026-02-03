// Simple variant gallery handler
(function() {
  function toggleVariantGallery(variantId) {
    // Hide all variant gallery items
    const allVariantItems = document.querySelectorAll('.variant-gallery-item');
    allVariantItems.forEach(item => {
      item.classList.add('hidden');
    });

    // Hide all variant gallery thumbnails
    const allVariantThumbnails = document.querySelectorAll('.variant-gallery-thumbnail');
    allVariantThumbnails.forEach(thumb => {
      thumb.classList.add('hidden');
    });

    // Hide all variant gallery modal items
    const allVariantModalItems = document.querySelectorAll('.variant-gallery-modal-item');
    allVariantModalItems.forEach(item => {
      item.classList.add('hidden');
    });

    // Show variant gallery items for the selected variant
    const selectedVariantItems = document.querySelectorAll(`.variant-gallery-item[data-variant-id="${variantId}"]`);
    selectedVariantItems.forEach(item => {
      item.classList.remove('hidden');
    });

    // Show variant gallery thumbnails for the selected variant
    const selectedVariantThumbnails = document.querySelectorAll(`.variant-gallery-thumbnail[data-variant-id="${variantId}"]`);
    selectedVariantThumbnails.forEach(thumb => {
      thumb.classList.remove('hidden');
    });

    // Show variant gallery modal items for the selected variant
    const selectedVariantModalItems = document.querySelectorAll(`.variant-gallery-modal-item[data-variant-id="${variantId}"]`);
    selectedVariantModalItems.forEach(item => {
      item.classList.remove('hidden');
    });
  }

  // Listen for variant change events
  if (typeof subscribe !== 'undefined' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.variantChange, function({ data }) {
      if (data && data.variant && data.variant.id) {
        toggleVariantGallery(data.variant.id);
      }
    });
  }

  // Also listen for variant change on variant radio buttons/selects
  document.addEventListener('DOMContentLoaded', function() {
    const variantInputs = document.querySelectorAll('input[name="id"]');
    variantInputs.forEach(input => {
      input.addEventListener('change', function() {
        if (this.value) {
          toggleVariantGallery(this.value);
        }
      });
    });
  });
})();

