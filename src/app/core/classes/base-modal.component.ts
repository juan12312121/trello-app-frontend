import { output, Directive } from '@angular/core';

/**
 * Base class for all modals in the application.
 * Provides standard close functionality.
 */
@Directive()
export abstract class BaseModalComponent {
  /** Emitted when the modal should be closed */
  closed = output<void>();

  /** 
   * Standard close method to be used by all subclasses.
   * Can be overridden if additional cleanup is needed.
   */
  close() {
    this.closed.emit();
  }

  /**
   * Helper to stop event propagation (useful for backdrop clicks)
   */
  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
