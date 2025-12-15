# Mailchimp Open Commerce Quick Start

## At a Glance

There are two main routes to getting started with Mailchimp Open Commerce: installing the platform on your local computer or on a server. This guide focuses on local installation, which allows you to explore the main features of Open Commerce.

In this guide, we'll set up a full local instance of the Open Commerce platform, including core plugins provided by Mailchimp. We'll walk through installing the command line interface, creating the various projects, registering an account, and creating your first shop.

## What You'll Need

We recommend installing:

- [NVM](https://github.com/nvm-sh/nvm)
- [Node.js](https://nodejs.org/ja/blog/release/v14.18.1/) (any version between 14.18.1 and 16)
- [Git](https://git-scm.com/)
- [Yarn](https://yarnpkg.com/cli/install) (for the storefront)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

**Windows users:**
- [WSL 2](https://docs.microsoft.com/en-us/windows/wsl/install-win10)
- [Docker for WSL](https://docs.docker.com/docker-for-windows/wsl/)

In addition, you need to have your system set up for [SSH authentication with GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).

## Windows Install

If you're using Windows 10/11, you'll need to take a few extra steps before you can continue with the Open Commerce installation process. (If you're not using Windows, you can skip to the next section.)

### Steps for Windows Users

1. **Install WSL2**: Follow the [WSL2 installation guide](https://docs.microsoft.com/en-us/windows/wsl/install-win10). Note that the automatic Windows Insider install comes with the Ubuntu distro. If you manually install WSL2, you can choose any Linux distro, but this guide is written for Ubuntu.

2. **Install Docker Desktop WSL2 backend**: Follow the [Docker Desktop WSL2 installation guide](https://docs.docker.com/desktop/windows/wsl/). Once completed, open Docker and navigate to **Settings > Resources > WSL Integration**. Verify that everything on that page is activated.

3. **Enable Docker Compose v2**: Under **Experimental Features**, enable **Use Docker Compose v2 candidate**.

4. **Start Ubuntu**: You're now ready to install the CLI and the OC projects.

## Install the Command Line Interface

To install the Open Commerce CLI, run:

```bash
npm install -g reaction-cli
```

## Install the API Server

Your next task is to install the API server.

### Steps

1. **Create a project directory**:
   ```bash
   mkdir myproject
   cd myproject
   ```

2. **Create an API server**:
   ```bash
   reaction create-project api <myapiserver>
   ```
   You can substitute any directory name for `<myapiserver>`.

3. **Install dependencies**:
   ```bash
   cd <myapiserver>
   npm install
   ```

4. **Start the server**:
   ```bash
   reaction develop
   ```
   This will start the Open Commerce server in development mode.

Congrats! You've installed the Mailchimp Open Commerce API server. Next, you can install the storefront and admin applications.

**GraphQL Playground**: You can view the GraphQL playground locally at `http://localhost:3000/graphql`.

## Install the Storefront

Next on your list is to install the storefront app.

### Steps

1. **Open a new terminal window** and change to the root of the project directory you created earlier.

2. **Create the storefront**:
   ```bash
   reaction create-project storefront <mystorefront>
   ```
   As before, you can name this directory to suit your needs. We'll use `<mystorefront>` for this example.

3. **Install dependencies**:
   ```bash
   cd <mystorefront>
   yarn install
   ```

4. **Start the storefront**:
   ```bash
   reaction develop
   ```
   This starts the storefront in development mode.

Congratulations! You've installed the default storefront for Mailchimp Open Commerce.

**Access the storefront**: `http://localhost:4000`

## Install the Admin App

Next, you'll install the admin app.

### Steps

1. **Open a new terminal window** and change to the root of the project directory you created previously.

2. **Create the admin app**:
   ```bash
   reaction create-project admin <myadmin>
   ```
   As before, you can name this directory however best fits your needs.

3. **Install dependencies**:
   ```bash
   cd <myadmin>
   npm install
   ```

4. **Start the admin app**:
   ```bash
   reaction develop
   ```
   This starts the admin app in development mode. Note that the admin app can take a little time to start up the first time because it's built with Meteor.

**Access the admin app**: `http://localhost:4080`

## Access the Dashboard, Playground, and Storefront

Now that you have the entire Mailchimp Open Commerce project running locally, you can create a shop manager account for your local instance.

### Create Your Shop

1. **Visit the login page**: Navigate to `http://localhost:4080`.

2. **Register an account**: Click **Register** and enter your email address and create a password, which will grant you admin privileges.

3. **Log in and create a shop**: Log in with your new account to access the shop creation form. Enter a name for your shop and click the **Create Shop** button.

4. **Access the dashboard**: You should now see the Open Commerce admin dashboard, from which you can:
   - [Create products](https://mailchimp.com/developer/open-commerce/docs/creating-organizing-products/)
   - [Add tags](https://mailchimp.com/developer/open-commerce/docs/tags-navigation/)
   - [Manage your orders](https://mailchimp.com/developer/open-commerce/docs/fulfilling-orders/)

### GraphQL Playground

Once you've created a shop, you can visit the GraphQL playground at `http://localhost:3000/graphql`, where you can:
- Run test GraphQL queries and mutations
- View the complete Open Commerce GraphQL API reference in the **Docs** tab

### View Your Storefront

You can view your Open Commerce storefront at `http://localhost:4000`.

## Next Steps

Now that you're up and running, you can:

- Start managing your store by creating products
- Build a custom storefront on top of the GraphQL API
- Code your own plugins for use with Open Commerce (see the [Build an API Plugin](https://mailchimp.com/developer/open-commerce/guides/build-api-plugin/) guide)

### Stopping the Servers

Once you are done working with any of the servers, you can stop them by either:
- Pressing **Ctrl+C** in the terminal
- Simply closing the terminal window

## Quick Reference

| Component | Port | URL |
|-----------|------|-----|
| API Server | 3000 | http://localhost:3000 |
| GraphQL Playground | 3000 | http://localhost:3000/graphql |
| Storefront | 4000 | http://localhost:4000 |
| Admin Dashboard | 4080 | http://localhost:4080 |

## Resources

- [Mailchimp Marketing API](https://mailchimp.com/developer/marketing/)
- [Mailchimp Transactional](https://mailchimp.com/developer/transactional/)
- [Mailchimp Open Commerce](https://mailchimp.com/developer/open-commerce/)
- [API Status](https://status.mailchimp.com/)
- [Integration Partner Program](https://mailchimp.com/developer/integration-partner-program/)
