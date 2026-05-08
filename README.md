<div align="center">
  <h1>Tuta Link Checker</h1>

  <img alt="TypeScript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" />
  <img alt="TailwindCSS" src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="DaisyUI" src="https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white"/>
  <img alt="Zed" src="https://img.shields.io/badge/zed-084CCF.svg?style=for-the-badge&logo=zedindustries&logoColor=white" />

  <br />

_A simple web application to validate URLs and check their existence_

</div>

<br />

> ⚠️ There is an issue with ?DaisyUI? where form validation styles are not applied immediately while typing
>
> - **Workaround:** Submit the form, or click outside the input field and then back into it to trigger the correct styling (also working and reacting properly afterward)
> - This issue only affects input field styling, validation messages are displayed correctly
> - The same behavior can be observed in the official DaisyUI example: https://daisyui.com/components/input/

### Run

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000

### Technologies

- **Frontend:** Mithril.js
- **Styling:** TailwindCSS + DaisyUI

### Architecture

- **Pattern:** MVC (Model-View-Controller)
- **Structure:** Feature-oriented


### Validation Behavior

The application performs strict local format validation followed by a mocked asynchronous remote existence check

During this remote check, the resource type is inferred from the URL path: 
  - URLs ending in a slash (`/`), having an empty path, or lacking a file extension in the final segment are classified as **Directories**
  - URLs where the final path segment contains a valid file extension (e.g., `image.png`) are classified as **Files**
  - If the URL fails the simulated network check or does not exist, it resolves to an **Unknown** state

### Requirements

1. **User Input:** User can enter a URL into an input field
2. **URL Validation:** Validates the format of the URL (e.g., must start with http:// or https:// and include a valid domain)
3. **Existence Check:** Mock a server call to check if the URL exists and whether it is a file or a folder
   - **Asynchronous:** The server call must be asynchronous
   - **Throttling:** Throttle the existence check to avoid excessive server requests while typing

---
<p align="center">
  🐄
</p>
