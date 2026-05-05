<div align="center">
  <h1>Tuta Link Checker</h1>

  <img alt="TypeScript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="DaisyUI" src="https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white"/>
  <img alt="UV" src="https://img.shields.io/badge/uv-%23DE5FE9.svg?style=for-the-badge&logo=uv&logoColor=white" />
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-005571.svg?style=for-the-badge&logo=fastapi" />
  <img alt="Zed" src="https://img.shields.io/badge/zed-084CCF.svg?style=for-the-badge&logo=zedindustries&logoColor=white" />

  <br />

_A simple web application to validate URLs and check their existence using a lightweight frontend and backend setup_

</div>

<br />

> ℹ️ The backend is implemented with FastAPI as it was quick to implement and provides real feedback. It can be replaced with a mocked service if required

> ⚠️ There is an issue with ?DaisyUI? where form validation styles are not applied immediately while typing
>
> - **Workaround:** Submit the form, or click outside the input field and then back into it to trigger the correct styling (also working and reacting properly afterward)
> - This issue only affects input field styling, validation messages are displayed correctly
> - The same behavior can be observed in the official DaisyUI example: https://daisyui.com/components/input/

### Run Backend

```bash
cd backend-server
uv run main.py
```

### Run Frontend

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

### Technologies

- **Frontend:** Mithril.js (chosen for consistency with Tuta's open-source stack)
- **Styling:** TailwindCSS + DaisyUI
- **Backend:** FastAPI

### Architecture

- **Pattern:** MVC (Model-View-Controller)
- **Structure:** Feature-oriented

### Requirements

1. **User Input:** User can enter a URL into an input field
2. **URL Validation:** Validates the format of the URL (e.g., must start with http:// or https:// and include a valid domain)
3. **Existence Check:** Mock a server call to check if the URL exists and whether it is a file or a folder
   - **Asynchronous:** The server call must be asynchronous
   - **Throttling:** Throttle the existence check to avoid excessive server requests while typing
