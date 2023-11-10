# api

api básica para subir un archivo en formato raw con límite de tamaño


    location ~ ^/(playlist|upload-full|) {
        client_max_body_size 900M;
        proxy_pass http://127.0.0.1:5555;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location / {
        add_header 'Access-Control-Allow-Origin' '*' always;
        root /usr/share/nginx/html/dev;
    }

