
# Item App 
This is a template frontend app for managig generic items. The app provides crud operations on items. 
This is a production-ready Frontend app built with Vue 3. It provides crud operations on items, and login/signup. This is the Vue 3 version of the Item App - A generic e2e app im building with various technologies, using Vue, React, Express, Go and Pyhton.

![enter image description here](https://res.cloudinary.com/dokgseqgj/image/upload/v1684224245/item-app-architecture_qqiy0d.png)


## Tech Stack

**Client:** vite, vue3, typescript, vuex, sass, axios


## Run Locally

Clone the project

```bash
  git clone https://github.com/gDenisLit/item-app-vue.git
```

Go to the project directory

```bash
  cd item-app-vue
```

Install dependencies

```bash
  npm install
```

Start the app in dev enviroment

```bash
  npm run dev
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`VITE_UPLOAD_PRESET`
Upload preset for cloudinary service for managing media

`VITE_CLOUD_NAME`
Cloud name for cloudinary 

`VITE_ENV`
Can recieve "local" or "remote", toggle between working with the backend and the local storage

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).


## Authors

- [@gDenislit](https://www.github.com/gDenislit)
