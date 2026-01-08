import type { Plugin } from "@opencode-ai/plugin"

const ZEN_PROVIDER_ID = "opencode"

const DisableZenPlugin: Plugin = async () => ({
  config: async (config) => {
    if (!config.disabled_providers) {
      config.disabled_providers = []
    }
    if (!config.disabled_providers.includes(ZEN_PROVIDER_ID)) {
      config.disabled_providers.push(ZEN_PROVIDER_ID)
    }
  },
})

export default DisableZenPlugin
