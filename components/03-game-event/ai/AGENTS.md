# 03. Game Event System — AI Agent Context

## Purpose & Scope
Provides enterprise-grade pub/sub event distribution with typed payloads, middleware filtering, telemetry inspection, and memory-safe unsubscription tokens.

## Rules for AI Agents
1. Always store the return value of `.on(...)` and call it upon unmount.
2. Middlewares can drop events by returning `false`.
3. Do not spam high-frequency frame events through the event bus; reserve for discrete domain state changes.

