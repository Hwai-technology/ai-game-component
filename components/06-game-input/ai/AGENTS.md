# 06. Game Input Controller — AI Agent Context

## Purpose & Scope
Translates raw pointer/touch screen interactions into discrete gameplay gestures (tap, drag, swipe_up, swipe_down, swipe_left, swipe_right, long_press) and dispatches configurable gameplay actions.

## Integration
In React Native, wrap your game view with PanResponder or GestureHandler, and forward coordinates to `controller.onPointerDown`, `onPointerMove`, and `onPointerUp`.
