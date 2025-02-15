import * as yargs from 'yargs'

import { CommandConfig, CommandTypes, CreateCommand } from '../../types/common'

import checkIsOnline from '../../utils/checkIsOnline'
import checkIsTemplateExisted from '../../utils/checkIsTemplateExisted'
import checkIsYarnInstalled from '../../utils/checkIsYarnInstalled'
import clearConsole from '../../utils/clearConsole'
import downloadAndExtractTemplate from '../../utils/downloadAndExtractTemplate'
import * as fs from '../../utils/fs'
import * as gitHelpers from '../../utils/gitHelpers'
import installPackages from '../../utils/installPackages'
import * as localTemplates from '../../utils/localTemplates'
import * as paths from '../../utils/paths'
import { error, log } from '../../utils/print'
import { exit } from '../../utils/process'

import cloneFilesIfNotFound from './cloneFilesIfNotFound'
import createQuestionsConfirmOverride from './createQuestionsConfirmOverride'
import createQuestionsGetInfo from './createQuestionsGetInfo'
import generateTemplate from './generateTemplate'
import * as logs from './logs'
import updatePackageJson from './updatePackageJson'

const execute = async ({
  name: _name,
  // @ts-ignore
  template: _template,
}: yargs.Argv<CreateCommand>) => {
  const isOnline = await checkIsOnline()
  if (!isOnline) {
    logs.networkNotAvailable()
    return exit(1)
  }

  const answerInfo = await createQuestionsGetInfo({
    name: _name,
    template: _template,
  })

  if (!answerInfo) {
    throw new Error('Not have required info to create module!')
  }

  const { name, template, version, library } = answerInfo

  const moduleDir = paths.newApp(name)

  clearConsole()
  logs.notifyOnStart(name, moduleDir)

  const dirIsExisted = fs.exists(moduleDir)
  if (dirIsExisted) {
    const shouldOverride = await createQuestionsConfirmOverride(moduleDir)
    if (!shouldOverride) {
      return exit(1)
    }

    fs.remove(moduleDir)
    log()
  }

  fs.create(moduleDir)

  const isCloneTemplate = !!template
  if (isCloneTemplate) {
    const localIsExisted = localTemplates.exists(template)
    if (localIsExisted) {
      logs.templateCloning(name, template)
      await localTemplates.clone(template, moduleDir)
    } else {
      const remoteIsExisted = await checkIsTemplateExisted(template)
      if (!remoteIsExisted) {
        logs.templateIsNotFound(template)
        return exit(1)
      }

      logs.templateIsDownloading(name, template)
      await downloadAndExtractTemplate(moduleDir, template)
    }
  } else {
    // Should be generate template by questions about requirements
    logs.questionsToMakeConfig(name)
    await generateTemplate(moduleDir, { name, version, library })
  }

  logs.filesIsPreparing()
  await cloneFilesIfNotFound(moduleDir, ['.gitignore', 'package.json'])
  await updatePackageJson(moduleDir, { name, library, version })

  const useYarn = checkIsYarnInstalled()

  const toolName = useYarn ? 'Yarn' : 'Npm'
  logs.packagesInstalling(toolName)

  const installed = await installPackages(moduleDir, { useYarn })
  if (installed.failed) {
    error(`An error occurred, details:`, installed.stdout)
    return exit(1)
  }

  gitHelpers.initGitInDir(moduleDir)

  logs.packagesInstalled()
  logs.guide(name, useYarn)

  return true
}

const config: CommandConfig = {
  type: CommandTypes.create,
  description: 'Create a module in the Micro Frontends project',
  transform: (yarg) =>
    yarg
      .option('name', {
        alias: 'n',
        describe: 'Module name',
        type: 'string',
        required: false,
      })
      .option('template', {
        alias: 't',
        describe: 'Module template',
        type: 'string',
        required: false,
      }),
  execute,
}

export default config
