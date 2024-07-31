const form = document.getElementById('loginForm');

form.addEventListener('submit', (e) => {

      e.preventDefault();

      const data = new FormData(form);

      const obj = {}

      data.forEach((value, key) => {
            obj[key] = ['email'].includes(key) ? value.toLowerCase() : value;
      });

      if (obj.email !== 'admincoder@coder.com') {

            fetch('/api/auth/login', {
                  method: 'POST',
                  body: JSON.stringify(obj),
                  headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')} `
                  }

            }).then(response => {

                  if (response.status === 200) {

                        response.json().then(data => {

                              localStorage.setItem('token', data.token);

                              alert('Bienvenido');

                              window.location.href = '/profile';

                        });

                  } else {

                        response.json().then(data => {

                              alert(data.error);

                        });

                  }

            });

      } else {

            fetch('/api/auth/login/admin', {
                  method: 'POST',
                  body: JSON.stringify(obj),
                  headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')} `
                  }

            }).then(response => {

                  if (response.status === 200) {

                        response.json().then(data => {

                              localStorage.setItem('token', data.token);

                              alert('Bienvenido');

                              window.location.href = '/profile';

                        });

                  } else {

                        response.json().then(data => {

                              alert(data.error);

                        });

                  }

            });
      }


});