 document.addEventListener('DOMContentLoaded', function () {
  const drawerOpeners = document.querySelectorAll('.product-drawer-opener');
  const newDrawers = document.querySelectorAll('.product-drawer');

  // Function to open a drawer
  function openDrawer(targetId) {
    const drawer = document.querySelector(targetId);
    if (drawer) {
      drawer.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('drawer-open');
    }
  }

  // Function to close a drawer
  function closeDrawer(drawer) {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
  }

  // Bind click events on openers
  drawerOpeners.forEach(opener => {
    const targetId = opener.getAttribute('data-drawer');
    const button = opener.querySelector('button');

    if (button && targetId) {
      button.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent triggering document click
        newDrawers.forEach(d => closeDrawer(d));
        openDrawer(targetId);
      });
    }
  });

  // Bind click events on close buttons
  newDrawers.forEach(drawer => {
    const closeBtn = drawer.querySelector('.product-drawer__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeDrawer(drawer);
      });
    }
  });

  // Handle ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      newDrawers.forEach(drawer => closeDrawer(drawer));
    }
  });

  // Click outside to close
  document.addEventListener('click', function (e) {
    const isInsideDrawer = [...newDrawers].some(drawer => drawer.contains(e.target));
    const isOpener = [...drawerOpeners].some(opener => opener.contains(e.target));

    if (!isInsideDrawer && !isOpener) {
      newDrawers.forEach(drawer => closeDrawer(drawer));
    }
  });
});

// Move newDrawers to end of <body>
const newDrawers = document.querySelectorAll('.product-drawer');
newDrawers.forEach(drawer => {
  document.body.appendChild(drawer);

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.querySelector(".drawer-overlay")) {
      const overlay = document.createElement("div");
      overlay.classList.add("drawer-overlay", "hidden");
      document.body.appendChild(overlay);
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.querySelector(".drawer-overlay");

    if (!overlay) return;

    // Open drawer → show overlay
    document.querySelectorAll(".product-drawer-button.link").forEach(button => {
      button.addEventListener("click", function () {
        overlay.classList.remove("hidden");
      });
    });

    // Close drawer → hide overlay
    function hideOverlay() {
      overlay.classList.add("hidden");
    }

    overlay.addEventListener("click", hideOverlay);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        hideOverlay();
      }
    });

    document.querySelectorAll(".product-drawer__close").forEach(closeBtn => {
      closeBtn.addEventListener("click", hideOverlay);
    });
  });

  /*document.addEventListener('DOMContentLoaded', function () {
  const target = document.querySelector('.product-form__input .select');
  const moveEl = document.querySelector('.grid__item > .product__info-container > div:has(.product-form > .form)');
  
  if (target && moveEl) {
    target.after(moveEl);
  }
});*/

document.querySelectorAll('.product-form__input .form__label').forEach(function(label) {
  if (label.textContent.trim() === 'Size') {
    label.classList.add('size-label');
  }
});

document.querySelectorAll('.product-drawer-button.link').forEach(function(el) {
  if (el.textContent.includes('STORLEKSGUIDE')) {
    el.classList.add('size-guide');
  }
});

const target = document.querySelector('.drawer-block:has(.size-guide)');
if (target) {
  target.classList.add('hide');
}

setTimeout(function () {
  const targetLabel = document.querySelector('.new-variant_cont');
  const sizeGuide = document.querySelector('.size-guide');

  if (targetLabel && sizeGuide) {
    targetLabel.appendChild(sizeGuide);
  }
}, 1500);

jQuery(document).ready(function () {
  jQuery('.read-more-button').on('click', function () {
    console.log('test truncate');
    jQuery('.product__info-container .product__description').toggleClass('expanded');
    jQuery(this).text(isExpanded ? 'Läs mer' : 'Visa mindre');
  });
});

const el = document.querySelector('.product__description');

  if (!el) return;

  // Only do this if not expanded
  if (!el.classList.contains('expanded')) {
    const isClamped = el.scrollHeight > el.clientHeight;

    if (!isClamped) {
      document.querySelector('.read-more-button').style.display = 'none';
    }
  }


  document.querySelectorAll('.mega-menu__link--level-2').forEach(function(el) {
  el.addEventListener('click', function() {
    const parentUl = el.closest('ul');
    if (parentUl) {
      parentUl.classList.add('is-level-3');
    }

    const nextEl = el.nextElementSibling;
    if (nextEl) {
      nextEl.classList.add('is-level-3-selected');
    }
  });
});
});



document.querySelectorAll('.mega-menu__link--level-2').forEach(function(el) {
  el.addEventListener('click', function() {
    const parentUl = el.closest('ul');
    if (parentUl) {
      parentUl.classList.add('is-level-3');
    }

    const nextEl = el.nextElementSibling;
    if (nextEl) {
      nextEl.classList.add('is-level-3-selected');
    }
  });
});


var ur = window.location.href;
if(ur.includes('/collection')){
   setTimeout(function(){ 

}, 1000);
}