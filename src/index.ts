import type { Plugin } from "@opencode-ai/plugin"

const ZEN_PROVIDER_ID = "opencode"

const DisableZenPlugin: Plugin = async () => {
  console.warn(`
================================================================================
  OpenCode Zen Provider DISABLED for ZDR Compliance
================================================================================
  Free models (grok-code, glm-4.7-free, etc.) may collect data for training.
  To re-enable: remove 'opencode-disable-zen' from plugins.
================================================================================
`)

  return {
    config: async (config) => {
      if (!config.disabled_providers) {
        config.disabled_providers = []
      }
      if (!config.disabled_providers.includes(ZEN_PROVIDER_ID)) {
        config.disabled_providers.push(ZEN_PROVIDER_ID)
      }
    },
  }
}

export default DisableZenPlugin
