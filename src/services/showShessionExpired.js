import { Dialog } from 'quasar';

let popupShown = false;

export function showSessionExpired(router) {
  if (popupShown) return;
  popupShown = true;

  Dialog.create({
    title: 'Session expired',
    message: 'You have been logged out. Please log in again.',
    ok: { label: 'Go to Login', color: 'primary' },
    persistent: true
  }).onOk(() => {
    router.push('/auth/login');
    popupShown = false;
  });
}
