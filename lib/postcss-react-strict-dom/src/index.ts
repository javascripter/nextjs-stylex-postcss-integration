import type { PluginCreator } from 'postcss'
import postcss from 'postcss'
import { createBuilder } from './builder'

interface PluginOptions {
  include: string[]
  exclude?: string[]
  cwd?: string
}

const PLUGIN_NAME = 'postcss-react-strict-dom'

const builder = createBuilder()

/**
 * PostCSS plugin for processing StyleX and React Strict DOM rules.
 * @param options - Configuration options for the plugin, including file patterns to include/exclude and the working directory.
 * @returns A PostCSS plugin object with async processing for StyleX at-rules.
 */
const plugin: PluginCreator<PluginOptions> = (options) => {
  const {
    include,
    exclude = [
      // Exclude TypeScript declaration files by default
      // because it never contains any CSS rules.
      '**/*.d.ts',
    ],
    cwd = process.cwd(),
  } = options

  return {
    postcssPlugin: PLUGIN_NAME,
    plugins: [
      /**
       * Processes the PostCSS root node to find and transform StyleX at-rules.
       * @param root - The PostCSS root node.
       * @param result - The PostCSS result object, used to store transformed output and messages.
       */
      async function (root, result) {
        const fileName = result.opts.from

        // Configure the builder with the provided options
        await builder.configure({
          include,
          exclude,
          cwd,
        })

        // Find the "@stylex" at-rule
        const styleXAtRule = builder.findStyleXAtRule(root)
        if (styleXAtRule == null) {
          return
        }

        // Get dependencies to be watched for changes
        const dependencies = builder.getDependencies()

        // Add each dependency to the PostCSS result messages
        // This seems to be unused in Expo Web at the moment (works without this).
        // However, this is useful for other tools like PostCSS CLI / other frameworks.
        for (const dependency of dependencies) {
          result.messages.push({
            plugin: PLUGIN_NAME,
            parent: fileName,
            ...dependency,
          })
        }

        // Build and parse the CSS from collected StyleX rules
        const css = await builder.build()
        const parsed = await postcss.parse(css, {
          from: fileName,
        })

        // Replace the "@stylex" rule with the generated CSS
        styleXAtRule.replaceWith(parsed)

        result.root = root
      },
    ],
  }
}

plugin.postcss = true

export = plugin