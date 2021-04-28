# Netlify CMS - JSON Exporter

## Release

```sh
# Creates a new version by incrementing the major, minor, or patch number of the current version.
yarn version [--major | --minor | --patch]

# Creates a new prerelease version by incrementing the major, minor, or patch number of the current version and adding a prerelease number.
yarn version --preid beta [--premajor | --preminor | --prepatch]

# Increments the prerelease version number keeping the main version.
yarn version --prerelease

# Push branch and tags
git push origin main --follow-tags
```