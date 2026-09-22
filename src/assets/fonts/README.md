# Fonts

`Bungee-Regular.ttf` is the display font of the site, under the SIL Open Font
License 1.1 (https://fonts.google.com/specimen/Bungee/license).

The pages load Bungee through `next/font`, which serves it from our own
domain. This copy exists for one other reason: the social share image is
drawn at build time by `next/og`, which needs the font as a file and does not
read WOFF2. Keeping the file here means the build never calls Google.
