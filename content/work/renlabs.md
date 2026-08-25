I architect and build the web applications for Torus, a Substrate-based blockchain in the Polkadot ecosystem, and lead the 5-person web development team behind them — technical direction, code review, and hands-on delivery across multiple production apps.

**What Renlabs does:** Renlabs builds Torus, a blockchain designed to coordinate networks of autonomous agents — handling how they earn and distribute emissions, how authority and capabilities get delegated between them, and how the network governs itself. I built the Turborepo monorepo hosting all four production apps, backed by shared packages including a `chain` package that transpiles types straight from the Rust Substrate codebase into TypeScript — making the entire stack typesafe end to end through tRPC and Drizzle.

![Renlabs](/previews/renlabs.png)

### Bridge

The wallet app is where users hold and manage their TORUS tokens. Inside it, I built a bridge between Torus and Base (Ethereum L2) that has securely moved more than $5 million in value with zero security incidents to date — letting TORUS holders move value in and out of the broader Ethereum L2 ecosystem without compromising security.

### Portal — Hypergraph & Permission System

Portal is the most technically demanding app I've built at Renlabs, and it's home to two systems I'm proud of.

The first is a live hypergraph of every agent on the network: a three-dimensional force-directed graph (Three.js + React Three Fiber) where each node is an agent and the flow of emissions between them forms the edges, radiating out from a root node. It turns an abstract, constantly-shifting economic network into something you can actually see move.

The second is the interface for Torus's permission system — a recursive delegation mechanism that lets any agent delegate emissions, capabilities, or even governance authority to another agent, who can then delegate that same authority further down the chain, to unlimited depth. Every delegation is validated against its parent — a child permission can never exceed the scope or duration it inherited — which makes the whole thing safe to build on without a central authority checking every link. Building the UI for this meant taking a deeply recursive, protocol-level Rust data structure and turning it into something a person could actually inspect, grant, and revoke with confidence — leaning heavily on the same Rust-to-TypeScript type pipeline that keeps the rest of the stack safe.

![Renlabs](/previews/renlabs-2.png)

### Governance

Torus is governed by its token holders, and I built the governance interface where that happens. Users votes directly decide what gets funded, how the network's economics evolve, and what direction the protocol takes — so the interface had to make a fairly abstract governance mechanism feel as simple as reading a proposal and clicking a button.

![Renlabs](/previews/renlabs-3.png)

### Prediction Swarm

The Prediction Swarm is a proof-of-concept product built on Torus: a decentralized swarm of coordinating agents that discover and verify public predictions about the future at scale, grouped by topic, and refined over time through community contribution and incentives. I built the interface that surfaces this — presenting the swarm's aggregated, verified predictions to users in a way that makes an otherwise invisible network of coordinating agents legible and useful.

![Renlabs](/previews/renlabs-4.png)
