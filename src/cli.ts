#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { homedir } from "os"

const PLUGIN_NAME = "opencode-disable-zen"

function findOpencodeConfig(): string | null {
  const projectConfig = join(process.cwd(), "opencode.json")
  if (existsSync(projectConfig)) return projectConfig

  const projectJsonc = join(process.cwd(), "opencode.jsonc")
  if (existsSync(projectJsonc)) return projectJsonc

  return null
}

function getGlobalConfigPath(): string {
  return join(homedir(), ".config", "opencode", "opencode.json")
}

function ensureDirectoryExists(filePath: string): void {
  const dir = dirname(filePath)
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
}

function readJsonConfig(path: string): Record<string, unknown> {
  if (!existsSync(path)) return {}
  const content = readFileSync(path, "utf-8")
  if (path.endsWith(".jsonc")) {
    const cleanContent = content
      .replace(/^\s*\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
    return JSON.parse(cleanContent)
  }
  return JSON.parse(content)
}

function writeJsonConfig(path: string, config: Record<string, unknown>): void {
  ensureDirectoryExists(path)
  writeFileSync(path, JSON.stringify(config, null, 2) + "\n")
}

function install(global: boolean): void {
  const configPath = global ? getGlobalConfigPath() : findOpencodeConfig()
  
  if (!configPath && !global) {
    console.log("No opencode.json found in current directory.")
    console.log("Use --global to install globally, or create opencode.json first.\n")
    console.log("Creating opencode.json in current directory...")
    
    const newConfig = {
      "$schema": "https://opencode.ai/config.json",
      plugin: [PLUGIN_NAME],
    }
    writeJsonConfig(join(process.cwd(), "opencode.json"), newConfig)
    console.log("✅ Created opencode.json with plugin enabled")
    return
  }

  const targetPath = global ? getGlobalConfigPath() : configPath!
  const config = readJsonConfig(targetPath)

  if (!config.plugin) {
    config.plugin = []
  }

  const plugins = config.plugin as string[]
  if (plugins.includes(PLUGIN_NAME)) {
    console.log(`✅ ${PLUGIN_NAME} is already installed in ${targetPath}`)
    return
  }

  plugins.push(PLUGIN_NAME)
  writeJsonConfig(targetPath, config)

  console.log(`✅ Installed ${PLUGIN_NAME} to ${targetPath}`)
  console.log("\nZen provider will be disabled on next OpenCode startup.")
  console.log("\n⚠️  If using oh-my-opencode, also update your agent models:")
  console.log(`
{
  "agents": {
    "explore": { "model": "anthropic/claude-haiku-4-5" },
    "librarian": { "model": "anthropic/claude-sonnet-4-5" }
  }
}
`)
}

function uninstall(global: boolean): void {
  const configPath = global ? getGlobalConfigPath() : findOpencodeConfig()
  
  if (!configPath) {
    console.log("No opencode.json found.")
    return
  }

  const targetPath = global ? getGlobalConfigPath() : configPath
  if (!existsSync(targetPath)) {
    console.log(`Config not found: ${targetPath}`)
    return
  }

  const config = readJsonConfig(targetPath)
  const plugins = config.plugin as string[] | undefined

  if (!plugins || !plugins.includes(PLUGIN_NAME)) {
    console.log(`${PLUGIN_NAME} is not installed in ${targetPath}`)
    return
  }

  config.plugin = plugins.filter((p) => p !== PLUGIN_NAME)
  writeJsonConfig(targetPath, config)

  console.log(`✅ Removed ${PLUGIN_NAME} from ${targetPath}`)
}

function showHelp(): void {
  console.log(`
opencode-disable-zen - Disable OpenCode Zen for ZDR compliance

Usage:
  npx opencode-disable-zen install [--global]   Add plugin to opencode.json
  npx opencode-disable-zen uninstall [--global] Remove plugin from opencode.json
  npx opencode-disable-zen --help               Show this help

Options:
  --global, -g    Use global config (~/.config/opencode/opencode.json)

Why disable Zen?
  Free models (grok-code, glm-4.7-free, etc.) may collect data for training.
  See: https://opencode.ai/docs/zen/#privacy
`)
}

const args = process.argv.slice(2)
const command = args[0]
const isGlobal = args.includes("--global") || args.includes("-g")

switch (command) {
  case "install":
    install(isGlobal)
    break
  case "uninstall":
    uninstall(isGlobal)
    break
  case "--help":
  case "-h":
  case undefined:
    showHelp()
    break
  default:
    console.error(`Unknown command: ${command}`)
    showHelp()
    process.exit(1)
}
