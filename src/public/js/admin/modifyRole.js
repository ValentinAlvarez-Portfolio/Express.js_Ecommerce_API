const form = document.getElementById('formModifyRole');

form.addEventListener('submit', (e) => {

      e.preventDefault();

      const data = new FormData(form);

      const obj = {}

      data.forEach((value, key) => {
            obj[key] = ['email'].includes(key) ? value.toLowerCase() : value;
      });

      const url = obj._id ? `/api/users/premium/${obj._id}` : '/api/users/premium';

      fetch(url, {
            method: 'put',
            body: JSON.stringify(obj),
            headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')} `
            }

      }).then(response => {

            if (response.status === 200) {

                  response.json().then(data => {

                        alert('Usuario actualizado');

                  });

            } else {

                  response.json().then(data => {

                        alert(data.error);

                  });

            }

      });

});