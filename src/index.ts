import type { Plugin } from "@opencode-ai/plugin"

/**
 * OpenCode Disable Zen Plugin
 *
 * Disables OpenCode Zen provider to ensure ZDR (Zero Data Retention) compliance.
 *
 * Why disable Zen?
 * - Free models (grok-code, glm-4.7-free, minimax-m2.1-free, big-pickle) may collect
 *   data for model improvement during their free period
 * - This violates ZDR requirements for enterprise/privacy-conscious users
 * - Zen's anonymous access is undocumented behavior (docs say sign-in required)
 *
 * @see https://opencode.ai/docs/zen/#privacy
 */
export const DisableZenPlugin: Plugin = async ({ client }) => {
  const ZEN_PROVIDER_ID = "opencode"

  const ZDR_WARNING = `
================================================================================
  OpenCode Zen Provider DISABLED for ZDR Compliance
================================================================================

  Free models in Zen (grok-code, glm-4.7-free, etc.) may collect data for
  model training during their free period.

  If you need these models, use paid alternatives:
  - explore agent: anthropic/claude-haiku-4-5
  - librarian agent: anthropic/claude-sonnet-4-5

  To re-enable Zen, remove 'opencode-disable-zen' from your plugins.
================================================================================
`

  // Log warning at startup
  console.warn(ZDR_WARNING)

  await client.app.log({
    body: {
      service: "opencode-disable-zen",
      level: "warn",
      message: "OpenCode Zen disabled for ZDR compliance",
      extra: {
        reason: "Free models may collect data for training",
        affected_models: ["grok-code", "glm-4.7-free", "minimax-m2.1-free", "big-pickle"],
        documentation: "https://opencode.ai/docs/zen/#privacy",
      },
    },
  })

  return {
    /**
     * Config hook - modifies OpenCode configuration at startup
     * Adds 'opencode' to disabled_providers list
     */
    config: async (config) => {
      // Initialize disabled_providers if not exists
      if (!config.disabled_providers) {
        config.disabled_providers = []
      }

      // Add Zen provider to disabled list if not already present
      if (!config.disabled_providers.includes(ZEN_PROVIDER_ID)) {
        config.disabled_providers.push(ZEN_PROVIDER_ID)

        await client.app.log({
          body: {
            service: "opencode-disable-zen",
            level: "info",
            message: `Added '${ZEN_PROVIDER_ID}' to disabled_providers`,
          },
        })
      }
    },

    /**
     * Event hook - monitors for any attempts to use Zen models
     */
    event: async ({ event }) => {
      // Log if session starts (for audit trail)
      if (event.type === "session.created") {
        await client.app.log({
          body: {
            service: "opencode-disable-zen",
            level: "debug",
            message: "Session created with Zen disabled",
          },
        })
      }
    },
  }
}

// Default export for OpenCode plugin loader
export default DisableZenPlugin
