# squiddly

Disable the github merge button based on checks or a label.  This is all client side and could have bugs so this should not be the only thing preventing merging.

## Configuration:

<img width="572" height="254" alt="Screenshot 2025-07-31 205925" src="https://github.com/user-attachments/assets/72048586-fa9b-4e71-924d-00a722a420ba" />

To be clear: "or" means it will disable the merge button if either condition is true.

## failing check[s]

The merge button will also be disabled while checks are proceeding:

<img width="711" height="328" alt="Screenshot 2025-08-03 213111" src="https://github.com/user-attachments/assets/da05bf51-baa9-46b1-9a93-06c09f3ed62c" />

to failure:

<img width="698" height="329" alt="Screenshot 2025-08-03 213233" src="https://github.com/user-attachments/assets/3f97161d-27db-4679-b4b2-be93316dc96f" />

or success:

<img width="486" height="329" alt="Screenshot 2025-08-03 213128" src="https://github.com/user-attachments/assets/99895426-173d-4d00-b76f-add4736f57b0" />

## PR has label

<img width="691" height="105" alt="Screenshot 2025-08-03 214049" src="https://github.com/user-attachments/assets/eb8e0220-5e9d-428f-97fd-17dda272b3e9" />



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
yarn build
```
