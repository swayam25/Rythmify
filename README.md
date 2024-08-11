<div align="center">

![Rythmify](./assets/rythmify.png)

Amplify your moments

</div>

## 🎬 Preview

- **Main Page**

    ![Main Page](./assets/main.png)

- **Queue**

    ![Queue](./assets/queue.png)

- **Playlist**

    ![Playlist Page](./assets/playlist.png)

## 📚️ Documentation

Get full documentation of internal workings [here](../../wiki)

## 🚀 Installation

1. Clone this repository
    ```sh
    git clone <repository url> rythmify
    cd rythmify
    ```

2. Install dependencies
    - Backend
        ```sh
        cd server
        python -m venv .venv
        source .venv/bin/activate
        pip install -r requirements.txt
        ```

    - Frontend
        ```sh
        cd client
        npm i
        ```

3. Configure the [`config.json`](./config.json) file

4. Start the app
    - Backend
        ```sh
        cd server
        source .venv/bin/activate
        python -m uvicorn main:app --host localhost --port 2501
        ```
    - Frontend
        ```sh
        cd client
        npm run dev -- --host --port 2500
        ```

5. URLs
    - Backend: `http://localhost:2501`
    - Frontend: `http://localhost:2500`
