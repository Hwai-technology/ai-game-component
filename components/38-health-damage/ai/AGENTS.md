# 38. Health and Damage System — AI Agent Context

## Purpose & Scope
Calculates hit damage with defense mitigation ($Damage_{net} = Damage_{raw} \cdot \frac{100}{100 + Defense}$), temporary shields, invulnerability frames (i-frames) to prevent spam deaths, and death callbacks.
