import { nextTestSetup } from 'e2e-utils'

describe('app-dir - metadata-streaming-config-customized', () => {
  const { next } = nextTestSetup({
    files: __dirname,
    overrideFiles: {
      'next.config.js': `
        module.exports = {
          htmlLimitedBots: /MyBot/i,
          cacheComponents: true,
        }
      `,
    },
  })

  it('should have the customized streaming metadata config output in routes-manifest.json', async () => {
    const requiredServerFiles = JSON.parse(
      await next.readFile('.next/required-server-files.json')
    )
    expect(requiredServerFiles.config.htmlLimitedBots).toBe('MyBot')

    const prerenderManifest = JSON.parse(
      await next.readFile('.next/prerender-manifest.json')
    )
    const { routes } = prerenderManifest

    const bypassConfigs = Object.keys(routes)
      .map((route) => [route, routes[route].experimentalBypassFor?.[2]])
      .filter(([, bypassConfig]) => Boolean(bypassConfig))
      .reduce((acc, [route, bypassConfig]) => {
        acc[route] = bypassConfig
        return acc
      }, {})

    expect(bypassConfigs).toMatchInlineSnapshot(`
     {
       "/": {
         "key": "user-agent",
         "type": "header",
         "value": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|Googlebot(?!-)|Googlebot$|MyBot",
       },
       "/_global-error": {
         "key": "user-agent",
         "type": "header",
         "value": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|Googlebot(?!-)|Googlebot$|MyBot",
       },
       "/_not-found": {
         "key": "user-agent",
         "type": "header",
         "value": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|Googlebot(?!-)|Googlebot$|MyBot",
       },
       "/ppr": {
         "key": "user-agent",
         "type": "header",
         "value": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight|Googlebot(?!-)|Googlebot$|MyBot",
       },
     }
    `)
  })
})
