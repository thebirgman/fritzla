if (!customElements.get('localization-form')) {
  customElements.define(
    'localization-form',
    class LocalizationForm extends HTMLElement {
      constructor() {
        super();
        this.mql = window.matchMedia('(min-width: 750px)');
        this.header = document.querySelector('.header-wrapper');
        this.originalForm = this.closest('form');
        this.elements = {
          input: this.querySelector('input[name="locale_code"], input[name="country_code"]'),
          button: this.querySelector('button.localization-form__select'),
          panel: this.querySelector('.disclosure__list-wrapper'),
          drawer: this.querySelector('country-drawer'),
          search: this.querySelector('input[name="country_filter"]'),
          closeButton: this.querySelector('.country-selector__close-button, .country-drawer__close'),
          resetButton: this.querySelector('.country-filter__reset-button'),
          searchIcon: this.querySelector('.country-filter__search-icon'),
          liveRegion: this.querySelector('#sr-country-search-results'),
          updateButton: this.querySelector('.country-drawer__button'),
          form: this.querySelector('form'),
        };
        this.addEventListener('keyup', this.onContainerKeyUp.bind(this));
        this.addEventListener('keydown', this.onContainerKeyDown.bind(this));
        this.addEventListener('focusout', this.closeSelector.bind(this));
        
        if (this.elements.button) {
          this.elements.button.addEventListener('click', this.openSelector.bind(this));
        }

        if (this.elements.search) {
          this.elements.search.addEventListener('keyup', this.filterCountries.bind(this));
          this.elements.search.addEventListener('focus', this.onSearchFocus.bind(this));
          this.elements.search.addEventListener('blur', this.onSearchBlur.bind(this));
          this.elements.search.addEventListener('keydown', this.onSearchKeyDown.bind(this));
        }
        if (this.elements.closeButton) {
          this.elements.closeButton.addEventListener('click', this.hidePanel.bind(this));
        }
        if (this.elements.resetButton) {
          this.elements.resetButton.addEventListener('click', this.resetFilter.bind(this));
          this.elements.resetButton.addEventListener('mousedown', (event) => event.preventDefault());
        }
        if (this.elements.updateButton) {
          this.elements.updateButton.addEventListener('click', this.onUpdateClick.bind(this));
        }
        if (this.elements.drawer) {
          this.elements.drawer.querySelector('.country-drawer__overlay')?.addEventListener('click', this.hidePanel.bind(this));
        }

        this.querySelectorAll('a, .country-drawer__radio').forEach((item) => {
          if (item.tagName === 'A') {
            item.addEventListener('click', this.onItemClick.bind(this));
          } else if (item.classList.contains('country-drawer__radio')) {
            item.addEventListener('change', this.onRadioChange.bind(this));
          }
        });
      }

      hidePanel() {
        if (this.elements.button) {
          this.elements.button.setAttribute('aria-expanded', 'false');
        }
        if (this.elements.panel) {
          this.elements.panel.setAttribute('hidden', true);
        }
        if (this.elements.drawer) {
          this.elements.drawer.classList.remove('active');
          this.elements.drawer.setAttribute('aria-hidden', 'true');
        }
        if (this.elements.search) {
          this.elements.search.value = '';
          this.filterCountries();
          this.elements.search.setAttribute('aria-activedescendant', '');
        }
        document.body.classList.remove('overflow-hidden-mobile', 'overflow-hidden');
        const menuDrawer = document.querySelector('.menu-drawer');
        if (menuDrawer) {
          menuDrawer.classList.remove('country-selector-open');
        }
        if (this.header) {
          this.header.preventHide = false;
        }
      }

      onContainerKeyDown(event) {
        const focusableItems = Array.from(this.querySelectorAll('a')).filter(
          (item) => !item.parentElement.classList.contains('hidden')
        );
        let focusedItemIndex = focusableItems.findIndex((item) => item === document.activeElement);
        let itemToFocus;

        switch (event.code.toUpperCase()) {
          case 'ARROWUP':
            event.preventDefault();
            itemToFocus =
              focusedItemIndex > 0 ? focusableItems[focusedItemIndex - 1] : focusableItems[focusableItems.length - 1];
            itemToFocus.focus();
            break;
          case 'ARROWDOWN':
            event.preventDefault();
            itemToFocus =
              focusedItemIndex < focusableItems.length - 1 ? focusableItems[focusedItemIndex + 1] : focusableItems[0];
            itemToFocus.focus();
            break;
        }

        if (!this.elements.search) return;

        setTimeout(() => {
          focusedItemIndex = focusableItems.findIndex((item) => item === document.activeElement);
          if (focusedItemIndex > -1) {
            this.elements.search.setAttribute('aria-activedescendant', focusableItems[focusedItemIndex].id);
          } else {
            this.elements.search.setAttribute('aria-activedescendant', '');
          }
        });
      }

      onContainerKeyUp(event) {
        event.preventDefault();

        switch (event.code.toUpperCase()) {
          case 'ESCAPE':
            if (this.elements.drawer && this.elements.drawer.classList.contains('active')) {
              this.hidePanel();
              event.stopPropagation();
              if (this.elements.button) {
                this.elements.button.focus();
              }
              return;
            }
            if (this.elements.button && this.elements.button.getAttribute('aria-expanded') == 'false') return;
            this.hidePanel();
            event.stopPropagation();
            if (this.elements.button) {
              this.elements.button.focus();
            }
            break;
          case 'SPACE':
            if (this.elements.button && this.elements.button.getAttribute('aria-expanded') == 'true') return;
            this.openSelector();
            break;
        }
      }

      onItemClick(event) {
        event.preventDefault();
        const form = this.querySelector('form');
        this.elements.input.value = event.currentTarget.dataset.value;
        if (form) form.submit();
      }

      openSelector() {
        if (this.elements.drawer) {
          // Move drawer to body if not already there
          if (this.elements.drawer.parentElement !== document.body) {
            document.body.appendChild(this.elements.drawer);
          }
          // Use drawer
          this.elements.drawer.classList.add('active');
          this.elements.drawer.setAttribute('aria-hidden', 'false');
          if (this.elements.button) {
            this.elements.button.setAttribute('aria-expanded', 'true');
          }
          document.body.classList.add('overflow-hidden');
          const firstRadio = this.elements.drawer.querySelector('.country-drawer__radio:checked, .country-drawer__radio');
          if (firstRadio) {
            setTimeout(() => firstRadio.focus(), 100);
          }
        } else if (this.elements.panel) {
          // Use old panel
          this.elements.button.focus();
          this.elements.panel.toggleAttribute('hidden');
          this.elements.button.setAttribute(
            'aria-expanded',
            (this.elements.button.getAttribute('aria-expanded') === 'false').toString()
          );
          if (!document.body.classList.contains('overflow-hidden-tablet')) {
            document.body.classList.add('overflow-hidden-mobile');
          }
          if (this.elements.search && this.mql.matches) {
            this.elements.search.focus();
          }
          if (this.hasAttribute('data-prevent-hide')) {
            this.header.preventHide = true;
          }
          const menuDrawer = document.querySelector('.menu-drawer');
          if (menuDrawer) {
            menuDrawer.classList.add('country-selector-open');
          }
        }
      }

      closeSelector(event) {
        if (!this.elements.drawer) {
          // Old behavior for panel
          if (
            event.target.classList.contains('country-selector__overlay') ||
            !this.contains(event.target) ||
            !this.contains(event.relatedTarget)
          ) {
            this.hidePanel();
          }
        }
      }
      
      onRadioChange(event) {
        // Update the hidden input when radio changes
        if (this.elements.input) {
          this.elements.input.value = event.target.value;
        }
      }
      
      onUpdateClick(event) {
        event.preventDefault();
        const selectedRadio = this.elements.drawer?.querySelector('.country-drawer__radio:checked');
        if (selectedRadio) {
          // Work exactly like onItemClick - find form within localization-form
          const form = this.querySelector('form');
          if (form) {
            // Update the hidden input value (same as old onItemClick)
            if (this.elements.input) {
              this.elements.input.value = selectedRadio.value;
            } else {
              // If input doesn't exist, find or create it in the form
              let hiddenInput = form.querySelector('input[name="country_code"]');
              if (!hiddenInput) {
                hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.name = 'country_code';
                form.appendChild(hiddenInput);
              }
              hiddenInput.value = selectedRadio.value;
            }
            // Submit the form (same as old onItemClick)
            form.submit();
          }
        }
      }

      normalizeString(str) {
        return str
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase();
      }

      filterCountries() {
        const searchValue = this.normalizeString(this.elements.search.value);
        const popularCountries = this.querySelector('.popular-countries');
        const allCountries = this.querySelectorAll('a');
        let visibleCountries = allCountries.length;

        this.elements.resetButton.classList.toggle('hidden', !searchValue);

        if (popularCountries) {
          popularCountries.classList.toggle('hidden', searchValue);
        }

        allCountries.forEach((item) => {
          const countryName = this.normalizeString(item.querySelector('.country').textContent);
          if (countryName.indexOf(searchValue) > -1) {
            item.parentElement.classList.remove('hidden');
            visibleCountries++;
          } else {
            item.parentElement.classList.add('hidden');
            visibleCountries--;
          }
        });

        if (this.elements.liveRegion) {
          this.elements.liveRegion.innerHTML = window.accessibilityStrings.countrySelectorSearchCount.replace(
            '[count]',
            visibleCountries
          );
        }

        this.querySelector('.country-selector').scrollTop = 0;
        this.querySelector('.country-selector__list').scrollTop = 0;
      }

      resetFilter(event) {
        event.stopPropagation();
        this.elements.search.value = '';
        this.filterCountries();
        this.elements.search.focus();
      }

      onSearchFocus() {
        this.elements.searchIcon.classList.add('country-filter__search-icon--hidden');
      }

      onSearchBlur() {
        if (!this.elements.search.value) {
          this.elements.searchIcon.classList.remove('country-filter__search-icon--hidden');
        }
      }

      onSearchKeyDown(event) {
        if (event.code.toUpperCase() === 'ENTER') {
          event.preventDefault();
        }
      }
    }
  );
}

// Define country-drawer custom element
if (!customElements.get('country-drawer')) {
  customElements.define(
    'country-drawer',
    class CountryDrawer extends HTMLElement {
      constructor() {
        super();
      }
    }
  );
}
