class SearchDrawer extends HTMLElement {
  constructor() {
    super();
    this.details = this.querySelector('details');
    this.drawerContent = this.querySelector('.search-drawer');
    this.overlay = null;
    this.searchInput = null;
    this.keywordTags = null;
    this.form = null;
    this.closeButton = null;
    this.drawerInner = null;
    this.isMovedToBody = false;
    this.escKeyHandler = null;

    this.init();
  }

  init() {
    // Handle details toggle
    if (this.details) {
      this.details.addEventListener('toggle', () => {
        if (this.details.hasAttribute('open')) {
          this.open();
        } else {
          this.close();
        }
      });
    }
  }

  moveDrawerToBody() {
    if (this.isMovedToBody || !this.drawerContent) return;
    
    // Store original parent for potential restoration
    this.originalParent = this.drawerContent.parentElement;
    
    // Move drawer to body
    document.body.appendChild(this.drawerContent);
    this.isMovedToBody = true;

    // Get references after moving to body
    this.overlay = this.drawerContent.querySelector('.search-drawer__overlay');
    this.searchInput = this.drawerContent.querySelector('.search__input');
    this.keywordTags = this.drawerContent.querySelectorAll('.search-drawer__keyword-tag');
    this.form = this.drawerContent.querySelector('#search-drawer-form');
    this.closeButton = this.drawerContent.querySelector('.drawer__close');
    this.drawerInner = this.drawerContent.querySelector('.search-drawer__inner');

    // Setup event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Handle overlay click
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }

    // Prevent clicks inside the inner drawer from closing it
    if (this.drawerInner) {
      this.drawerInner.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Handle clicks on the drawer container (outside the inner drawer) to close
    if (this.drawerContent) {
      this.drawerContent.addEventListener('click', (e) => {
        // Only close if click is on the drawer container itself, not on inner content
        if (e.target === this.drawerContent) {
          this.close();
        }
      });
    }

    // Handle close button
    if (this.closeButton) {
      this.closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    }

    // Handle ESC key
    this.escKeyHandler = (evt) => {
      if (evt.code === 'Escape' && this.details && this.details.hasAttribute('open')) {
        this.close();
      }
    };
    document.addEventListener('keyup', this.escKeyHandler);

    // Handle keyword tag clicks
    if (this.keywordTags) {
      this.keywordTags.forEach((tag) => {
        tag.addEventListener('click', () => {
          const keyword = tag.getAttribute('data-keyword');
          if (keyword && this.searchInput && this.form) {
            this.searchInput.value = keyword;
            // Submit the form to trigger search
            this.form.submit();
          }
        });
      });
    }

    // Handle form submission
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        const searchTerm = this.searchInput?.value?.trim();
        if (!searchTerm) {
          e.preventDefault();
          return false;
        }
      });
    }
  }

  open() {
    this.moveDrawerToBody();
    this.drawerContent.classList.add('active');
    document.body.classList.add('overflow-hidden');
    
    // Focus on search input
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.focus();
      }
      // Trap focus
      if (this.drawerInner) {
        const focusElement = this.searchInput || this.closeButton;
        if (focusElement) {
          trapFocus(this.drawerInner, focusElement);
        }
      }
    }, 100);
  }

  close() {
    if (this.drawerContent) {
      this.drawerContent.classList.remove('active');
    }
    if (this.details) {
      this.details.removeAttribute('open');
    }
    if (this.escKeyHandler) {
      document.removeEventListener('keyup', this.escKeyHandler);
    }
    removeTrapFocus();
    document.body.classList.remove('overflow-hidden');
  }
}

//customElements.define('search-drawer', SearchDrawer);

