const signInAsGuest = async () => {
  await fetch('/sessions', {
    method: 'post',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'guest@guest.com',
      password: 'guest1GUEST',
    }),
  });

  window.location.href = window.location.origin;
};

const signOut = async () => {
  await fetch('/sessions', { method: 'DELETE' });

  window.location.href = window.location.origin;
};

const deleteMessage = async (id) => {
  await fetch(`/messages/${id}`, { method: 'DELETE' });

  window.location.href = window.location.origin;
};

const changeVisibility = () => {
  if (document.getElementsByName('password')[0].type === 'password') {
    document.getElementsByName('password')[0].type = 'text';
    this.textContent = 'visibility_off';
  } else {
    document.getElementsByName('password')[0].type = 'password';
    this.textContent = 'visibility';
  }
};

const setDisabled = () => {
  if (
    document.querySelector('input').value.length > 1 &&
    document.querySelector('textarea').value.length > 1
  ) {
    document.querySelector('form button').removeAttribute('disabled');
  } else {
    document.querySelector('form button').setAttribute('disabled', 'true');
  }
};
