# String Calculator Kata — Local LLM Agents

A working implementation of [Roy Osherove's String Calculator Kata](http://osherove.com/kata), built entirely by local LLM agents as a companion to the blog post [Local LLM Agents](https://otix.ai/blog/local-llm-agents.html).

The idea: instead of a human writing the code, a pipeline of specialized AI agents — running locally via Ollama — collaborates through a test-writer / implementer / reviewer loop to complete the kata from scratch. This repo is the output of that process and serves as a practical example for interview pairing sessions exploring AI-assisted TDD.

## How It Works

The orchestrator script (`run-kata.sh`) drives three agents in rounds:

```
┌─────────────┐     ┌──────────────┐     ┌────────────┐
│ Test Writer  │ ──▶ │ Implementer  │ ──▶ │  Reviewer   │
│  writes tests│     │  makes them  │     │  checks     │
│  from spec   │     │  pass        │     │  quality    │
└─────────────┘     └──────────────┘     └────────────┘
       ▲                    │
       └────── next round ──┘  (if tests still failing)
```

1. **Test Writer** reads the kata spec and existing code, then adds tests for uncovered requirements.
2. **Implementer** reads failing test output and edits `src/index.js` until green.
3. **Reviewer** audits the final code and test suite for correctness and completeness.

A verifier step runs `npm test` between each agent to provide structured feedback. The loop repeats for up to 3 rounds or until all tests pass.

## Agents & Models

Agents are defined as minimal system prompts in `.pi/agents/` and executed via [pi](https://github.com/otherjoel/pi), a lightweight CLI for running local LLM agents with tool use.

Tested with models running on Ollama:
- **Qwen3 Coder 30B** (default) — solid reasoning for code generation
- **GLM-4.7 Flash 30B** — fast alternative used in the shell script
- **MiniMax M2.5** via OpenRouter — cloud fallback

## The Kata

The String Calculator progresses through 12 incremental steps, each adding a new behavior:

| # | Behavior | Example |
|---|----------|---------|
| 1 | Empty string returns 0 | `"" -> 0` |
| 2 | One or two numbers | `"1,2" -> 3` |
| 3 | Any quantity of numbers | `"1,2,3,4" -> 10` |
| 4 | Newline as delimiter | `"1\n2,3" -> 6` |
| 5 | Custom single-char delimiter | `"//;\n1;2" -> 3` |
| 6 | Negative numbers throw | `"-1,2" -> throws` |
| 7 | Multiple negatives in error | `"-1,-2,3" -> throws` |
| 8 | Call count tracking | `3 calls -> getCalledCount() == 3` |
| 9 | Ignore numbers > 1000 | `"2,1001" -> 2` |
| 10 | Arbitrary-length delimiters | `"//[***]\n1***2***3" -> 6` |
| 11 | Multiple delimiters | `"//[*][%]\n1*2%3" -> 6` |
| 12 | Multiple multi-char delimiters | `"//[**][%%]\n1**2%%3" -> 6` |

## Running It

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run the full agent pipeline (requires Ollama with a model pulled)
./run-kata.sh
```

## Project Structure

```
.
├── src/index.js           # String calculator implementation
├── tests/index.test.js    # Jest test suite (12 describe blocks)
├── run-kata.sh            # Agent orchestration script
├── .pi/agents/            # Agent system prompts
│   ├── test-writer.md
│   ├── implementer.md
│   └── reviewer.md
├── .pi/agent/             # pi tool configuration
│   ├── settings.json
│   └── models.json
├── string_calculator_kata.md  # Full kata specification
└── AGENTS.md              # Agent-facing project context
```

## Interview Pairing Context

This repo is designed as a conversation starter for technical interviews. It demonstrates:

- **TDD discipline** — tests written before implementation, one step at a time
- **AI-assisted development** — understanding what local LLMs can and can't do autonomously
- **Agent architecture** — separating concerns into specialized roles with structured handoffs
- **Local-first AI** — running models on your own hardware via Ollama, no API keys required

The candidate can walk through how the agents collaborate, discuss trade-offs of local vs cloud models, and extend the kata live.

## License

ISC
