#!/usr/bin/env node

const os = require('os')
const crypto = require('crypto')
const prompts = require('prompts')
const semver = require('semver')
const fs = require('fs-extra')
const { execSync } = require('child_process')

const hash = (value) =>
  crypto.createHash('sha256').update(value).digest('hex').substring(0, 16)

const tempDir = os.tmpdir()

;(async () => {
  let tempVersion
  let cancel = false
  const response = await prompts(
    [
      {
        type: 'text',
        name: 'name',
        message: 'Please enter the package name you would like to use.',
      },
      {
        type: 'confirm',
        name: 'temporary',
        initial: true,
        message: (name) => {
          tempVersion = `0.0.0-temp.${hash(name)}`
          return `Temporary version number ${tempVersion}?`
        },
      },
      {
        type: (prev) => (prev ? null : 'text'),
        name: 'version',
        message: 'Please enter the version number you want.',
        validate: (value) => semver.valid(value) !== null,
      },
    ],
    {
      onCancel() {
        cancel = true
      },
    }
  )
  if (cancel) {
    return
  }

  const { name, temporary, version } = response

  const publishVersion = temporary ? tempVersion : version

  const dir = `${tempDir}/${name}-${publishVersion}`

  await fs.outputJson(`${dir}/package.json`, {
    name,
    version: publishVersion,
    publishConfig: {
      access: 'public',
      registry: 'https://registry.npmjs.org/',
    },
  })

  try {
    execSync('npm publish', { cwd: dir, stdio: 'inherit' })
  } finally {
    await fs.remove(dir)
  }
})()
