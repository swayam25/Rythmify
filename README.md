<div align="center">

![Rythmify](./assets/rythmify.png)

Amplify your moments

</div>

# what is it?

its a simple music player, written in Svelte and Python by [Swayam](https://github.com/swayam25), featuring many different artists.

## 🎬 Preview

- **Search & Play**

    ![Search & Play](./assets/search.gif)

- **Queue**

    ![Queue](./assets/queue.gif)

- **Playlist**

    ![Playlist](./assets/playlist.gif)

## 📚️ Documentation

Get full documentation of internal workings [here](../../wiki)

## 🚀 Installation

1. Clone this repository
    ```sh
    git clone https://github.com/swayam25/Rythmify rythmify
    cd rythmify
    ```

2. Configure the [`config.json`](./config.json) file

    <details>

    <summary>Configuration</summary>

    - `discord`
        - `client_id`: Discord OAuth2 Client ID
        - `client_secret`: Discord OAuth2 Client Secret

    - `server`: Backend server url

    - `client`: Frontend client url

    </details>

3. Copy the `Client ID` and `Client Secret` from the Discord Developer Portal and paste them into the `client_id` and `client_secret` fields, respectively, in the [`config.json`](./config.json) file

    ![Discord Client Information](./assets/discord_client_info.png)

4. Add `http://localhost:2501/auth/callback` to the Discord OAuth2 Redirect URIs

    ![Discord OAuth2 Redirect URIs](./assets/discord_redirect.png)

> [!NOTE]
> You can skip the discord developer portal configuration (*step 3 & 4*) if you don't want to use login related features.

5. For backend
   - Install dependencies
        ```sh
        cd server
        python -m venv .venv
        source .venv/bin/activate
        pip install -r requirements.txt
        ```
   - Start the server
        ```sh
        fastapi dev --port 2501
        ```

6. For frontend
   - Install dependencies
        ```sh
        cd client
        npm i
        ```
   - Start the client
        ```sh
        npm run dev -- --port 2500
        ```

7. URLs
    - Backend: `http://localhost:2501`
    - Frontend: `http://localhost:2500`

## 🌐 For Production

1. Follow the steps 1-4 from the [installation guide](#-installation). *Ignore if already done.*
2. For backend
   - Install dependencies (*Ignore if already done*)
   - Start the server
        ```sh
        fastapi run --port 2501
        ```

3. For frontend
    - Install dependencies (*Ignore if already done*)
    - Build the client
        ```sh
        npm run build
        ```
    - Preview the client
        ```sh
        npm run preview -- --port 2500
        ```

4. URLs
    - Backend: `http://localhost:2501`
    - Frontend: `http://localhost:2500`

> [!TIP]
> Checkout the [deployment guide](https://svelte.dev/docs/kit/adapter-node) for more information.
