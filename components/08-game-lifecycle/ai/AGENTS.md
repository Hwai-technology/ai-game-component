# 08. Game Lifecycle Manager — AI Agent Context

## Purpose & Scope
Supervises operating system lifecycle transitions (active, background, inactive) to safely suspend game loops, mute audio, and enforce resume policies.

## React Native Adapter
For React Native / Expo, wire `AppState.addEventListener('change', ...)` to the `ILifecyclePlatformAdapter` interface.
