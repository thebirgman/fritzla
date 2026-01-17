if (!customElements.get('product-form')) {
  customElements.define(
    'product-form',
    class ProductForm extends HTMLElement {
      constructor() {
        super();

        this.form = this.querySelector('form');
        this.variantIdInput.disabled = false;
        this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
        this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
        this.submitButton = this.querySelector('[type="submit"]');
        this.submitButtonText = this.submitButton.querySelector('span');

        if (document.querySelector('cart-drawer')) this.submitButton.setAttribute('aria-haspopup', 'dialog');

        this.hideErrors = this.dataset.hideErrors === 'true';

        // Length option validation
        this.lengthInput = this.querySelector('.length-input');
        this.lengthError = this.querySelector('.length-error-message');
        this.requiresLength = this.submitButton.dataset.requiresLength === 'true';
        
        if (this.lengthInput) {
          this.lengthMin = parseFloat(this.lengthInput.dataset.lengthMin) || 50;
          this.lengthMax = parseFloat(this.lengthInput.dataset.lengthMax) || 500;
          this.lengthInput.addEventListener('input', this.validateLengthOption.bind(this));
          this.lengthInput.addEventListener('blur', () => {
            this.validateLengthOption();
            // Hide error on blur if valid, but don't show it until submit attempt
            if (this.isLengthValid()) {
              this.hideLengthError();
            }
          });
          // Initial validation
          this.validateLengthOption();
        }
      }

      onSubmitHandler(evt) {
        evt.preventDefault();
        if (this.submitButton.getAttribute('aria-disabled') === 'true') return;

        // Check if button has disabled class due to length validation
        if (this.requiresLength && this.lengthInput && !this.isLengthValid()) {
          evt.preventDefault();
          this.showLengthError();
          return;
        }

        this.handleErrorMessage();

        this.submitButton.setAttribute('aria-disabled', true);
        this.submitButton.classList.add('loading');
        this.querySelector('.loading__spinner').classList.remove('hidden');

        const config = fetchConfig('javascript');
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        delete config.headers['Content-Type'];

        const formData = new FormData(this.form);
        
        // Append "cm" to length value in formData only (not in the input field)
        if (this.lengthInput && this.lengthInput.value) {
          const lengthValue = this.lengthInput.value.trim();
          if (lengthValue) {
            formData.set('properties[Length]', lengthValue + 'cm');
          }
        }
        if (this.cart) {
          formData.append(
            'sections',
            this.cart.getSectionsToRender().map((section) => section.id)
          );
          formData.append('sections_url', window.location.pathname);
          this.cart.setActiveElement(document.activeElement);
        }
        config.body = formData;

        fetch(`${routes.cart_add_url}`, config)
          .then((response) => response.json())
          .then((response) => {
            if (response.status) {
              publish(PUB_SUB_EVENTS.cartError, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                errors: response.errors || response.description,
                message: response.message,
              });
              this.handleErrorMessage(response.description);

              const soldOutMessage = this.submitButton.querySelector('.sold-out-message');
              if (!soldOutMessage) return;
              this.submitButton.setAttribute('aria-disabled', true);
              this.submitButtonText.classList.add('hidden');
              soldOutMessage.classList.remove('hidden');
              this.error = true;
              return;
            } else if (!this.cart) {
              window.location = window.routes.cart_url;
              return;
            }

            const startMarker = CartPerformance.createStartingMarker('add:wait-for-subscribers');
            if (!this.error)
              publish(PUB_SUB_EVENTS.cartUpdate, {
                source: 'product-form',
                productVariantId: formData.get('id'),
                cartData: response,
              }).then(() => {
                CartPerformance.measureFromMarker('add:wait-for-subscribers', startMarker);
              });
            this.error = false;
            const quickAddModal = this.closest('quick-add-modal');
            if (quickAddModal) {
              document.body.addEventListener(
                'modalClosed',
                () => {
                  setTimeout(() => {
                    CartPerformance.measure("add:paint-updated-sections", () => {
                      this.cart.renderContents(response);
                    });
                  });
                },
                { once: true }
              );
              quickAddModal.hide(true);
            } else {
              CartPerformance.measure("add:paint-updated-sections", () => {
                this.cart.renderContents(response);
              });
            }
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            this.submitButton.classList.remove('loading');
            if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
            if (!this.error) this.submitButton.removeAttribute('aria-disabled');
            this.querySelector('.loading__spinner').classList.add('hidden');

            CartPerformance.measureFromEvent("add:user-action", evt);
          });
      }

      handleErrorMessage(errorMessage = false) {
        if (this.hideErrors) return;

        this.errorMessageWrapper =
          this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
        if (!this.errorMessageWrapper) return;
        this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

        this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

        if (errorMessage) {
          this.errorMessage.textContent = errorMessage;
        }
      }

      toggleSubmitButton(disable = true, text) {
        if (disable) {
          this.submitButton.setAttribute('disabled', 'disabled');
          if (text) this.submitButtonText.textContent = text;
        } else {
          this.submitButton.removeAttribute('disabled');
          this.submitButtonText.textContent = window.variantStrings.addToCart;
        }
      }

      isLengthValid() {
        if (!this.lengthInput) return true; // If no length input, consider valid
        
        const rawValue = this.lengthInput.value ? this.lengthInput.value.trim() : '';
        const lengthValue = parseFloat(rawValue);
        const isEmpty = !rawValue;
        return !isEmpty && !isNaN(lengthValue) && lengthValue >= this.lengthMin && lengthValue <= this.lengthMax;
      }

      validateLengthOption() {
        if (!this.lengthInput || !this.requiresLength) return;

        const isValid = this.isLengthValid();

        // Update button state using only classes (not disabled attribute)
        if (isValid) {
          // Only remove disabled class if variant is available (check if variant input is not disabled)
          const variantAvailable = this.variantIdInput && !this.variantIdInput.disabled;
          if (variantAvailable) {
            this.submitButton.classList.remove('disabled');
          }
        } else {
          // Only add disabled class if it's not already disabled for other reasons (like sold out)
          // Check if variant is available first
          const variantAvailable = this.variantIdInput && !this.variantIdInput.disabled;
          if (variantAvailable && !this.submitButton.hasAttribute('disabled')) {
            this.submitButton.classList.add('disabled');
          }
        }
      }

      showLengthError() {
        if (!this.lengthInput || !this.lengthError) return;
        
        this.lengthInput.classList.add('field__input--error');
        this.lengthError.removeAttribute('hidden');
        this.lengthInput.setAttribute('aria-invalid', 'true');
        this.lengthInput.focus();
      }

      hideLengthError() {
        if (!this.lengthInput || !this.lengthError) return;
        
        this.lengthInput.classList.remove('field__input--error');
        this.lengthError.setAttribute('hidden', '');
        this.lengthInput.removeAttribute('aria-invalid');
      }

      get variantIdInput() {
        return this.form.querySelector('[name=id]');
      }
    }
  );
}
