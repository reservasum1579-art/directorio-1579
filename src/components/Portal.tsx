import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal component – renders its children into the DOM node with id "modal-root".
 * This allows modals (which use `fixed inset-0`) to escape any CSS containment
 * (e.g., `transform` or `filter`) applied by parent layout components.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.getElementById('modal-root');
    if (root) setModalRoot(root);
  }, []);

  if (!modalRoot) return null;

  return createPortal(children, modalRoot);
}
