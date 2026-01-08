# opencode-disable-zen

OpenCode plugin to disable Zen provider for ZDR (Zero Data Retention) compliance.

## Why?

OpenCode Zen's free models may collect data for model training during their free period:

| Model | Data Collection |
|-------|-----------------|
| `grok-code` | May be used to improve Grok Code |
| `glm-4.7-free` | May be used to improve the model |
| `minimax-m2.1-free` | May be used to improve the model |
| `big-pickle` | May be used to improve the model |

Source: [OpenCode Zen Privacy Policy](https://opencode.ai/docs/zen/#privacy)

Additionally, Zen's anonymous access (no sign-in required for free models) is **undocumented behavior** - the official documentation states sign-in is required.

## Installation

### Quick Install (Recommended)

```bash
npx opencode-disable-zen install
```

For global installation:
```bash
npx opencode-disable-zen install --global
```

### Manual Install

```bash
npm install opencode-disable-zen
```

Then add to your `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-disable-zen"]
}
```

Or global config at `~/.config/opencode/opencode.json`.

## What it does

1. Adds `"opencode"` to `disabled_providers` list
2. Logs a warning at startup about ZDR implications
3. Provides audit trail for compliance

## CLI Commands

```bash
npx opencode-disable-zen install          # Add to local opencode.json
npx opencode-disable-zen install --global # Add to ~/.config/opencode/opencode.json
npx opencode-disable-zen uninstall        # Remove from local config
npx opencode-disable-zen --help           # Show help
```

## For oh-my-opencode users

If you're using oh-my-opencode with free model defaults, also update your agent models:

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
  "$schema": "https://opencode.ai/config.json",
  "disabled_providers": ["opencode"]
}
```

## License

MIT
