# AI as a tool

Many [https://coda.io/d/_d0SvdI3KSto/_su49pE5w](https://coda.io/d/_d0SvdI3KSto/_su49pE5w) 

Here is a structured summary of the repos you listed, plus a few closely related “peer” projects that belong in the same ecosystem of agentic/dev–automation tooling. Each sentence that cites features or positioning is drawn from public descriptions of the projects.

---

## Agent workspaces, context, and memory

### Hermes Workspace

- **URL**: [https://github.com/outsourc-e/hermes-workspace](https://github.com/outsourc-e/hermes-workspace) [github](https://github.com/outsourc-e/hermes-workspace)

- **One‑liner**: Native web workspace and “command center” UI for the Hermes Agent, combining chat, terminal, files, memory, skills, and an inspector in a single web app. [github](https://github.com/outsourc-e/hermes-workspace/releases)

- **Core description / purpose**:

  - Provides a browser-based workspace that connects to a Hermes agent backend and exposes conversations, a shell, agent skills, long‑term memory, and debugging/inspection tools. [github](https://github.com/outsourc-e/hermes-workspace/blob/main/README.md)

  - Ships a “portable mode” where you can use basic chat without the full Hermes gateway; advanced features (sessions, inspector) require a Hermes gateway or the outsourc‑e Hermes fork. [github](https://github.com/outsourc-e/hermes-workspace/issues)

  - Offers Docker-based deployment with support for Anthropic, OpenAI, OpenRouter, and local models via Ollama. [x](https://x.com/outsource_/status/2034329709740216503)

- **Tech / stack**: TypeScript-based web app (per ecosystem trackers), with a typical modern SPA stack and Docker deployment. [trendshift](https://trendshift.io/repositories/24743)

- **Notable features / columns worth capturing**:

  - Role: Agent workspace / web UI. [github](https://github.com/outsourc-e/hermes-workspace)

  - Capabilities: Chat, terminal, file browser, memory, skills panel, inspector. [oosmetrics](https://oosmetrics.com/repo/outsourc-e/hermes-workspace)

  - Deployment: Docker‑compose, .env‑driven config for different model backends. [x](https://x.com/outsource_/status/2034329709740216503)

---

### bloks

- **URL**: [https://github.com/parcadei/bloks](https://github.com/parcadei/bloks) [lib](https://lib.rs/crates/bloks)

- **One‑liner**: “Context blok generator” that turns libraries (npm, PyPI, [crates.io](http://crates.io), or local repos) into structured, hierarchical context units optimized for LLM consumption. [lib](https://lib.rs/crates/bloks)

- **Core description / purpose**:

  - CLI (Rust) that indexes libraries from package registries or local repositories, extracts API surfaces via AST analysis, and generates **deck → module → symbol** “bloks” for progressive disclosure to agents. [lib](https://lib.rs/crates/bloks)

  - Scrapes documentation, including special `llms.txt` files, and merges code + docs into a structured knowledge representation. [lib](https://lib.rs/crates/bloks)

  - Provides commands such as `bloks add` for external packages, `bloks add-local` for a local project, and `bloks list` to inspect indexed content. [lib](https://lib.rs/crates/bloks)

- **Tech / stack**: Rust command-line utility; built as a performant offline indexer for agent context. [lib](https://lib.rs/crates/bloks)

- **Notable features / columns**:

  - Role: Context builder / knowledge base for agents. [lib](https://lib.rs/crates/bloks)

  - Sources: npm, PyPI, [crates.io](http://crates.io), local repos; optional explicit docs URLs. [lib](https://lib.rs/crates/bloks)

  - Structure: Hierarchical deck / module / symbol representation for “LLM‑friendly” retrieval. [lib](https://lib.rs/crates/bloks)

---

### agentic-stack

- **URL**: [https://github.com/codejunkie99/agentic-stack](https://github.com/codejunkie99/agentic-stack) [github](https://github.com/codejunkie99/agentic-stack)

- **One‑liner**: “One brain, many harnesses” – a portable `.agent/` folder containing memory, skills, and protocols that you can plug into multiple IDEs and agent frontends. [github](https://github.com/codejunkie99/agentic-stack/activity)

- **Core description / purpose**:

  - Standardizes an agent’s internal state (memory, skill definitions, and protocol configuration) into a portable `.agent/` directory that can be mounted by various tools. [github](https://github.com/codejunkie99/agentic-stack/issues)

  - Targets compatibility with Claude Code, Cursor, Windsurf, OpenCode, OpenClaw, Hermes, and other agent shells so that “the same brain” can run across them. [github](https://github.com/codejunkie99/agentic-stack/issues)

  - Pairs naturally with agent workspaces and orchestrators, turning the agent’s configuration into a shareable, version‑controlled artifact. [github](https://github.com/codejunkie99/agentic-stack)

- **Notable features / columns**:

  - Role: Agent brain portability / configuration format. [github](https://github.com/codejunkie99/agentic-stack)

  - Concept: Single “brain” re‑used in multiple harnesses (editors, CLIs, workspaces). [github](https://github.com/codejunkie99/agentic-stack/issues)

---

### gradient-bang

- **URL**: [https://github.com/pipecat-ai/gradient-bang](https://github.com/pipecat-ai/gradient-bang)

- **One‑liner**: CLI + runtime for “bang‑style” agent commands built on Pipecat, optimized for fast, composable AI workflows.

- **Core description / purpose**:

  - Adds `!` (bang) style shortcuts/commands for invoking Pipecat agents and workflows from the terminal and scripts.

  - Focuses on declarative configuration of agents, streams, and tools using a lightweight syntax over the Pipecat runtime.

- **Notable features / columns**:

  - Role: Agent CLI / workflow shell.

  - Integration: Built on Pipecat for streaming / multimodal agent pipelines.

*(Note: gradient‑bang details are inferred from current repo descriptions; they are still evolving.)*

---

## Autonomous dev agents and IDE‑integrated assistants

### OpenHands

- **URL**: [https://github.com/OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) [github](https://github.com/OpenHands/OpenHands)

- **One‑liner**: Open source, model‑agnostic platform and SDK for cloud coding agents that can carry out end‑to‑end engineering tasks on real codebases. [openhands](https://openhands.dev)

- **Core description / purpose**:

  - Provides an SDK and runtime for agents that operate on large, complex, and legacy codebases, orchestrating changes in dependency‑aware order and running in secure cloud sandboxes. [github](https://github.com/OpenHands/OpenHands)

  - Focuses on “shipping changes end‑to‑end” rather than just suggesting snippets: agents read issues, plan work, edit code, run tests, and interact with real environments. [openhands](https://openhands.dev)

  - Model‑agnostic: can integrate multiple LLM backends via open APIs. [openhands](https://openhands.dev)

- **Notable features / columns**:

  - Role: Autonomous software engineer / cloud coding agent platform. [openhands](https://openhands.dev)

  - Architecture: Composable Python SDK, micro‑agents, secure sandboxes. [github](https://github.com/OpenHands/OpenHands)

---

### Aider

- **URL**: [https://github.com/Aider-AI/aider](https://github.com/Aider-AI/aider) [github](https://github.com/aider-ai/aider)

- **One‑liner**: AI pair programmer in your terminal that maps your codebase and edits multi‑file projects using local or cloud LLMs, with automatic git commits. [aider](https://aider.chat/docs/git.html)

- **Core description / purpose**:

  - CLI that connects to a wide set of LLMs (Claude, DeepSeek, OpenAI models, local models, etc.) and uses a codebase map to reason over larger projects. [github](https://github.com/aider-ai/aider)

  - Deep git integration: will initialize a repo if needed and automatically commit each change with descriptive messages, making it easy to audit and revert. [aider](https://aider.chat/docs/git.html)

  - Supports 100+ programming languages and is designed for iterative, conversational editing. [github](https://github.com/aider-ai/aider)

- **Notable features / columns**:

  - Role: Terminal pair programmer. [github](https://github.com/aider-ai/aider)

  - Capabilities: Multi‑file edits, git auto‑commit, multi‑LLM support. [aider](https://aider.chat/docs/git.html)

---

### Cline

- **URL**: [https://github.com/cline/cline](https://github.com/cline/cline) [github](https://github.com/cline/cline)

- **One‑liner**: VS Code AI assistant that uses your editor and CLI to handle complex software development tasks, including file navigation, editing, and running commands. [github](https://github.com/cline/cline/wiki)

- **Core description / purpose**:

  - A VS Code extension where the agent can open, edit, and create files, with diff views for review and undo. [github](https://github.com/cline/cline/wiki)

  - Connects to multiple model providers (Claude, GPT, DeepSeek, Gemini, local models) so you can pick cost/performance trade‑offs. [github](https://github.com/cline/cline/issues/9174)

  - Often compared with other IDE agents like Roo Code and Copilot, with a focus on open flexibility rather than a closed ecosystem. [github](https://github.com/cline/cline/issues/9174)

- **Notable features / columns**:

  - Role: Editor‑centric autonomous assistant. [github](https://github.com/cline/cline)

  - Strengths: Model flexibility, rich CLI integration, diff‑based editing. [github](https://github.com/cline/cline/issues/9174)

---

## Agentic orchestration, projects, and multi‑agent systems

### Claude Task Master

- **URL**: [https://github.com/eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master) [github](https://github.com/eyaltoledano/claude-task-master/issues/813)

- **One‑liner**: Task and project‑management layer for Claude‑based agents that turns product specs into structured task lists and coordinates longer‑running builds. [github](https://github.com/eyaltoledano/claude-task-master/issues/813)

- **Core description / purpose**:

  - Converts high‑level requirements into tracked tasks and orchestrates agents across those tasks, acting like a PM/coordination layer. [github](https://github.com/eyaltoledano/claude-task-master/issues/813)

  - Integrates coding agents like Aider as backends to perform code edits, git operations, and multi‑file changes as part of a broader workflow. [github](https://github.com/eyaltoledano/claude-task-master/issues/813)

- **Notable features / columns**:

  - Role: Agent project manager / orchestrator. [github](https://github.com/eyaltoledano/claude-task-master/issues/813)

  - Integrations: Aider and other coding agents as execution backends. [github](https://github.com/eyaltoledano/claude-task-master/issues/813)

---

### CrewAI

- **URL**: [https://github.com/crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) [github](https://github.com/crewaiinc/crewai)

- **One‑liner**: Python framework for orchestrating role‑playing AI agents (a “crew”) with defined responsibilities, tools, and handoffs for complex tasks. [github](https://github.com/crewaiinc/crewai)

- **Core description / purpose**:

  - Lean, from‑scratch framework (not built on LangChain) for multi‑agent workflows where each agent has a role, goal, tools, and collaboration patterns. [github](https://github.com/crewaiinc/crewai)

  - Surrounding repos provide examples, quickstarts, and tool packs for real‑world applications (game building, marketing, CV matching, markdown validation, etc.). [github](https://github.com/crewAIInc/crewAI-examples)

  - Includes an enterprise GitHub integration for code workflows and other integrations. [docs.crewai](https://docs.crewai.com/en/enterprise/integrations/github)

- **Notable features / columns**:

  - Role: Multi‑agent orchestration framework. [github](https://github.com/crewaiinc/crewai)

  - Ecosystem: Examples repo, quickstarts, and tool library (now migrated into main repo). [github](https://github.com/crewAIInc/crewAI-tools)

---

### LangGraph

- **URL**: [https://github.com/langchain-ai/langgraph](https://github.com/langchain-ai/langgraph) [github](https://github.com/langchain-ai/langgraph-example)

- **One‑liner**: Low‑level agent orchestration and state management layer for building stateful, multi‑actor LLM applications with persistent checkpoints and human‑in‑the‑loop control. [github](https://github.com/langchain-ai/langchain)

- **Core description / purpose**:

  - Designed for long‑running, multi‑step applications where you want cycles, retries, and human approvals in the loop. [github](https://github.com/langchain-ai/langgraph-example)

  - Used as the foundation of production agents, often coupled with LangChain and LangSmith for evaluation and observability. [github](https://github.com/langchain-ai/langchain)

  - Related repos like `langgraph-codeact` and `langgraph-101` provide advanced patterns (CodeAct architecture; educational material and tutorials). [github](https://github.com/langchain-ai/langgraph-codeact)

- **Notable features / columns**:

  - Role: Agent architecture / orchestration “kernel”. [github](https://github.com/langchain-ai/langgraph-example)

  - Features: Checkpoints, cycles, multi‑actor graphs, human‑in‑the‑loop. [github](https://github.com/langchain-ai/langchain)

---

## DevOps, workflows, product analytics, and support

### n8n

- **URL**: [https://github.com/n8n-io/n8n](https://github.com/n8n-io/n8n)

- **One‑liner**: Open source workflow automation platform with 400+ integrations and native AI nodes, used for internal tools and process orchestration.

- **Core description / purpose**:

  - Node‑based workflow builder similar to Zapier/Make, but self‑hostable and extensible.

  - Offers AI nodes for calling LLMs and can integrate with repos, CI, CRMs, etc., making it a glue layer for agentic systems and traditional SaaS.

- **Notable features / columns**:

  - Role: Workflow / ops automation.

  - Highlights: 400+ integrations, self‑hosting, AI steps.

---

### Coolify

- **URL**: [https://github.com/coollabsio/coolify](https://github.com/coollabsio/coolify)

- **One‑liner**: Self‑hosted PaaS that feels like Heroku/Vercel, offering git‑push deployment plus databases and one‑click services.

- **Core description / purpose**:

  - Provides an interface to deploy applications via git pushes, with automatic SSL and built‑in support for databases and containerized services.

  - Includes a large catalog (280+ in current descriptions) of one‑click services, which makes it a strong fit for deploying agent stacks and supporting databases/vector stores.

- **Notable features / columns**:

  - Role: DevOps / PaaS for self‑hosting.

  - Features: Git‑based deploys, databases, one‑click services.

---

### PostHog

- **URL**: [https://github.com/PostHog/posthog](https://github.com/PostHog/posthog) [github](https://github.com/posthog/posthog)

- **One‑liner**: All‑in‑one product OS with analytics, session replay, feature flags, experiments, and error tracking, available as self‑hosted or cloud. [github](https://github.com/posthog/posthog)

- **Core description / purpose**:

  - Provides event‑based product analytics via autocapture or manual instrumentation, plus feature flags and A/B testing, so you can track how users interact with features. [github](https://github.com/posthog/posthog)

  - Supports self‑hosting via a one‑line Docker deployment script for hobby setups, and scales up in their managed version. [github](https://github.com/posthog/posthog)

- **Notable features / columns**:

  - Role: Product analytics / QA / experimentation. [github](https://github.com/posthog/posthog)

  - Features: Analytics, replay, feature flags, experiments, error tracking. [github](https://github.com/posthog/posthog)

---

### Chatwoot

- **URL**: [https://github.com/chatwoot/chatwoot](https://github.com/chatwoot/chatwoot)

- **One‑liner**: Open source customer engagement platform with live chat, email, WhatsApp, and other channels in one inbox, with AI‑assisted workflows. [chatwoot](https://www.chatwoot.com/community/)

- **Core description / purpose**:

  - Multi‑channel support tool for customer messages, fully open source under MIT, with a strong community. [chatwoot](https://www.chatwoot.com/community/)

  - Ecosystem includes tooling like `chatwoot-contributors` for building contributor leaderboards using GitHub Actions. [github](https://github.com/chatwoot/chatwoot-contributors)

- **Notable features / columns**:

  - Role: Support / CX platform. [chatwoot](https://www.chatwoot.com/community/)

  - Channels: Live chat, email, WhatsApp, and other messaging channels.

---

## Suggested additional peers to include

To make this a more complete “agentic stack + dev automation” table, here are a few peers you might want to add explicitly:

Table 1

---

## Consolidated table (for your sheet or doc)

Here’s a concise table you can drop into a spreadsheet, then enrich with star counts, maturity, etc.:

Table 2
