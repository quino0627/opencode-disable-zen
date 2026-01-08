# opencode-disable-zen

OpenCode plugin to disable Zen provider for safe use at work.

## Why?

OpenCode Zen's free models may collect data for model training during their free period:

| Model | Data Collection |
|-------|-----------------|
| `grok-code` | May be used to improve Grok Code |
| `glm-4.7-free` | May be used to improve the model |
| `minimax-m2.1-free` | May be used to improve the model |
| `big-pickle` | May be used to improve the model |

Source: [OpenCode Zen Privacy Policy](https://opencode.ai/docs/zen/#privacy)

## Installation

### Quick Install (Recommended)

```bash
npx opencode-disable-zen install --global
```

### Manual Install

Add to your `~/.config/opencode/opencode.json`:

```json
{
  "plugin": ["opencode-disable-zen"]
}
```

## What it does

Adds `"opencode"` to `disabled_providers` list, preventing Zen models from being used.

## CLI Commands

```bash
npx opencode-disable-zen install --global  # Add to global config
npx opencode-disable-zen uninstall --global # Remove from global config
npx opencode-disable-zen --help            # Show help
```

## For oh-my-opencode users

If you're using oh-my-opencode, also update your agent models:

```json
{
  "agents": {
    "explore": { "model": "anthropic/claude-haiku-4-5" },
    "librarian": { "model": "anthropic/claude-sonnet-4-5" }
  }
}
```

## Alternative: Config-only approach

If you prefer not to use a plugin:

```json
{
  "disabled_providers": ["opencode"]
}
```

## License

MIT
