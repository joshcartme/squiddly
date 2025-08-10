# squiddly

Disable the github merge button based on checks or a configurable label.

Get it for:
- [Chrome](https://chromewebstore.google.com/detail/squiddly/keckkliciafiafmlgeepcgbiohbekjmn)  
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/squiddly/)

Look at `.github/workflows/ci-check.yml` for an example Github Action that adds a label if a PR fails typechecking.  This is all client side and could have bugs so this should not be the only thing preventing merging.

## failing check[s]



# <img width="544" height="233" alt="Screenshot 2025-08-03 215146" src="https://github.com/user-attachments/assets/c8bd7dec-ab35-4a77-b620-587f25107450" /> &#x21AF;

| Disabled while checks are proceeding | Disabled when checks have failed | 
|--------------------------------------|----------------------------------|
|<img width="711" height="328" alt="Screenshot 2025-08-03 213111" src="https://github.com/user-attachments/assets/da05bf51-baa9-46b1-9a93-06c09f3ed62c" />|<img width="698" height="329" alt="Screenshot 2025-08-03 213233" src="https://github.com/user-attachments/assets/3f97161d-27db-4679-b4b2-be93316dc96f" />|

## PR has label

# <img width="542" height="231" alt="Screenshot 2025-08-03 215017" src="https://github.com/user-attachments/assets/3054a41f-59ba-4853-b828-efa624524848" /> &#x21AF;

<img width="1346" height="650" alt="Screenshot 2025-08-03 214740" src="https://github.com/user-attachments/assets/fc2b5bb8-48d9-4902-9c8a-2879e39fa29e" />

## Development

### Available Scripts

In the project directory, you can run the following scripts:

#### yarn dev

**Development Mode**: This command runs your extension in development mode. It will launch a new browser instance with your extension loaded. The page will automatically reload whenever you make changes to your code, allowing for a smooth development experience.

```bash
yarn dev
```

#### yarn start

**Production Preview**: This command runs your extension in production mode. It will launch a new browser instance with your extension loaded, simulating the environment and behavior of your extension as it will appear once published.

```bash
yarn start
```

#### yarn build

**Build for Production**: This command builds your extension for production. It optimizes and bundles your extension, preparing it for deployment to the target browser's store.

```bash
yarn build --browser=all --zip
```
