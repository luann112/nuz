---
id: micro-frontends-architecture
title: Micro-Frontends Architecture
---

## What is Micro Frontends?

Micro Frontends architecture is a Microservices architecture approach to frontend web development. Micro Frontends allows building a feature-rich modern web application based on Microservices architecture.

The same Backend Monolith, The Frontend Monolith still meets some problems from Monolith architecture. To resolve these problems, Micro Frontends was mentioned, use Micro Frontends for the application to helps all teams can be released the new features independently, grows teams, develop and maintain the features easier, keep the codebase small and operations stable.

> The concept of Micro Frontends is to think about the application that will be developed by the independent teams, each team having owned and managed a distinct area of business that it specializes in.

## Why Micro Frontend matters?

At this time, the new web applications having rich-features and grow up every day, the codebase and team members will be larger and larger. This makes the manage and scalability get more difficult. 

The transformation is needed if the business wants to apply the new technologies, building many the features to compete, stuck at scalability or take much time don't necessary for the process at developing, maintain and release a feature or bugfix for the web application because the codebase large, build time is long or dependent by another team. Delayed to transform will be made the transformation process in the future is harder and consuming resources.

## Benefits of Micro Frontend

A Micro Frontend leads to easier, faster, and more efficient front-end development. But how does it do so? Here are some of the key advantages of Micro Frontends.

### Independent deployment

One of the key features of Micro Frontends is independent development. The team can be hosted each module or service has its own continuous delivery pipelines anywhere and by the self way. 

These pipelines are responsible for building, testing, and deploying each module all the way to production. Therefore, teams can be autonomous in developing, correcting, and releasing them freely without having to wait or be dependent on another party.

But remember, when an error occurs from a module or service it must be controlled and not affected by the other teams even on production.

### Better code management

The use of Micro Frontends in development makes the codebase of each module or service small and can be distributed in many places, managed by the teams. Also because the codebase is small, debugging and maintenance are much easier, the code is cleaner, and unit testing of the modules will be more efficient.

### Autonomous teams

Dividing teams by features, each member of the team will understand the functionality of the feature better, thereby making it easy to come up with ideas as well as update to better carry products. In addition, when a team has a full range of technical members from Backend to Frontend, they manage their own things, so when it comes to making technical decisions, it's more optimal.

### Reusable modules

With Micro Frontends, each component, module or service has to be independent, so it's easier to reuse those things, it can be reused in the application or in cross applications together. In addition, using Nuz you can do so much more.

## How Micro Frontends works?

There are many tutorials or examples of how Micro Frontends work, I have listed and updated below for references.

- [The Strengths and Benefits of Micro Frontends by Bob Myers](https://www.toptal.com/front-end/micro-frontends-strengths-benefits)
- [Micro Frontends by Cam Jackson](https://martinfowler.com/articles/micro-frontends.html)
- [Micro Frontend Architecture and Best Practices by XenonStack](https://www.xenonstack.com/insights/what-is-micro-frontend)
- [Micro Frontends by Michael Geers](https://micro-frontends.org)

## Micro Frontends with Nuz

Using Nuz to build a modern web application with Micro Frontends architecture. We built the best practices for this case, it easily applies to most current applications.

The advantage of this approach is that you can easily choose the best current frameworks for app management, it's easy to get started with. Alternatively, you can also mirgate from these applications to the Micro Frontends architecture using Nuz if the current application builds on Monolith architecture.

### Concepts

:::note

Everything that comes next will be a series of plans designed for the best integration with Nuz, which may not be required but you need to understand it.

:::

#### The application

This is the main application, it is the framework for demonstrating the modules placed within it. The application is also a place to store routing, initialize and manage state, and rendering (also for the server).

Recommended packages to create and build the application are:

- [Next.js](#) - Suitable for building a high-performance web application that supports server-side rendering. 
  - Fully compatible with Nuz, see the example [here](https://github.com/nuz-app/demo).
  - See how to integrate [here](../introduction/getting-started#nextjs-application).
- [Create React App](#) - Suitable for building a fast web application that doesn't require server-side rendering.
  - Fully compatible with Nuz, the example will be updated soon!
  - See how to integrate [here](../introduction/getting-started#react-application).

If you already use Nuz with other packages, PRs are welcome.

#### The module

This is a component, module, library, or anything exports like Node.js require module as [Nuz module](../reference/module) format. It is often a web component to render and includes logic to fetch and interact with APIs.

### Guides

Traditionally, each component in an application is often stored in the same repository as a directory, rather than a monorepo or module published to NPM.

To be able to dynamically use each module used in your web application, it is recommended that you try to keep it isolate and instead of publishing it to the NPM registry, approach and build it according to the Nuz standards and publish it to the [Nuz Registry](../services/nuz-registry) service (or similar registry service). Finally, let's use it as the normal dynamic Node.js module, see how to use it [here](../introduction/getting-started#usage). In addition to the modules that your enterprise develops and publishes, all other modules that are publicly published on the [Nuz Registry](../services/nuz-registry) service are available.

Now the components on the thing's web application are dynamic, each team can develop, bugfix, and deploy themselves at any time without affecting the others. Everything is managed and controlled by Nuz and to better understand how Nuz works, you can read more documents.

### Development

In a development environment, you need to see the module directly how the module works and display in the application and constantly try and fix it, which requires a hot reload of the system and linking the module to resolve from local instead of online.

To do this, need to use development mode in workspaces for the application and modules. Nuz now fully supports this, you can see more details [here](../reference/workspaces).

## Conclusion

The article will likely be updated in more detail in the future, but if you need it urgently you can create questions to be answered and guidance soon. 📮