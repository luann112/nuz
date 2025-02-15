import { Connection } from 'mongoose'

import {
  Models,
  ModuleDocument,
  ModuleModel,
  PublishInfo,
  PublishOptions,
  RollbackInfo,
} from '../types'

import { createModels } from '../models'
import createMongoConnection from '../utils/createMongoConnection'
import ensureVersion from '../utils/ensureVersion'
import getEmptyPackage from '../utils/getEmptyPackage'
import * as versionHelpers from '../utils/versionHelpers'

import ModelDB from './ModelDB'

export interface MongoOptions {
  url: string
}

const checkIsVersionExisted = (pkg: ModuleDocument, version: string) =>
  !!(
    pkg &&
    pkg.versions &&
    pkg.versions[version && versionHelpers.encode(version)]
  )

class MongoDB implements ModelDB {
  private readonly connection: Connection
  private readonly db: Models

  constructor(
    private readonly secretKey: string | undefined,
    options: MongoOptions,
  ) {
    const { url } = options

    // Check if url is not provided
    if (!url) {
      throw new Error('Missing mongodb url!')
    }

    // Create connection to db
    this.connection = createMongoConnection(url)

    // Create models
    this.db = createModels(this.connection)
  }

  private verifySecretKey(secretKey: string | undefined) {
    if (secretKey === this.secretKey) {
      return true
    }

    throw new Error('Secret key is invalid')
  }

  private async verifyToken(token: string) {
    const permission = await this.db.Permission.findById(token)
    if (permission) {
      return true
    }

    throw new Error('Token is invalid or Permission config not found!')
  }

  private async verifyModule(token: string, name: string) {
    const permission = await this.db.Permission.findOne({
      _id: token,
      scope: name,
    })
    if (permission) {
      return true
    }

    throw new Error('Token is invalid or Module not in scope allowed!')
  }

  // tslint:disable-next-line: no-empty
  async prepage() {}

  async createToken(secretKey: string | undefined, scope: string[]) {
    this.verifySecretKey(secretKey)

    const permission = new this.db.Permission({ scope })
    const { _id: token } = await permission.save()

    // Use _id as token
    return { token }
  }

  async deleteToken(secretKey: string | undefined, token: string) {
    this.verifySecretKey(secretKey)

    const { deletedCount: deleted = 0 } = await this.db.Permission.deleteOne({
      _id: token,
    })

    return { deleted }
  }

  async setScope(
    secretKey: string | undefined,
    token: string,
    scope: string[],
  ) {
    this.verifySecretKey(secretKey)
    await this.verifyToken(token)

    const { nModified: updated } = await this.db.Permission.updateOne(
      { _id: token },
      { $set: { scope } },
    )

    return { updated }
  }

  async removeScope(
    secretKey: string | undefined,
    token: string,
    scope: string[],
  ) {
    this.verifySecretKey(secretKey)
    await this.verifyToken(token)

    const { nModified: updated } = await this.db.Permission.updateOne(
      { _id: token },
      { $pull: { scope: { $in: scope } } },
    )

    return { updated }
  }

  async extendScope(
    secretKey: string | undefined,
    token: string,
    scope: string[],
  ) {
    this.verifySecretKey(secretKey)
    await this.verifyToken(token)

    const { nModified: updated } = await this.db.Permission.updateOne(
      { _id: token },
      { $push: { scope } },
    )

    return { updated }
  }

  async getModule(name: string, fields?: ModuleModel) {
    const module = await this.db.Module.findOne({ name }, fields)
    return module
  }

  async getModules(fields?: ModuleModel) {
    const modules = await this.db.Module.find({}, fields)
    return modules
  }

  async publishModule(
    token: string,
    publishInfo: PublishInfo,
    options: PublishOptions,
  ) {
    const {
      name,
      version,
      library,
      alias,
      exportsOnly,
      resolve,
    } = Object.assign({ alias: {} }, publishInfo)

    const { schedule, fallback } = Object.assign({ fallback: true }, options)

    // Verify token and scope is included package
    await this.verifyModule(token, name)

    const pkg = await this.getModule(name)
    if (!pkg) {
      throw new Error(`Can not found module by name ${name}`)
    }

    const versionName = versionHelpers.encode(version)
    const versionInfo = await ensureVersion({
      version,
      library,
      alias,
      exportsOnly,
      resolve,
    })

    const versionIsDuplicated = checkIsVersionExisted(pkg, version)
    if (versionIsDuplicated) {
      throw new Error(`Cannot publish an existed version`)
    }

    if (!pkg) {
      const data = getEmptyPackage() as any
      data.name = name
      data.tags.upstream = version
      data.versions[versionName] = versionInfo

      const module = new this.db.Module(data)
      const created = await module.save()

      return {
        _id: created._id,
        name: created.name,
        version: created.versions,
        updatedAt: created.updatedAt,
        tags: created.tags,
        updated: 0,
      }
    }

    const updateFields = {
      'tags.upstream': version,
      [`versions.${versionName}`]: versionInfo,
    }
    if (fallback) {
      const fallbackTag = fallback === true ? pkg.tags.upstream : fallback
      updateFields['tags.fallback'] = fallbackTag

      const fallbackVersion = versionHelpers.encode(fallbackTag)
      if (!pkg.versions[fallbackVersion]) {
        throw new Error('Fallback version is not existed!')
      }
    }

    const { nModified: updated } = await this.db.Module.updateOne(
      { _id: pkg._id },
      {
        $set: updateFields,
      },
    )

    return {
      _id: pkg._id,
      name: pkg.name,
      version: pkg.versions,
      updatedAt: pkg.updatedAt,
      tags: pkg.tags,
      updated,
    }
  }
  async rollbackModule(token: string, rollbackInfo: RollbackInfo) {
    const { name, upstream, fallback } = rollbackInfo

    // Verify token and scope is included package
    await this.verifyModule(token, name)

    const pkg = await this.getModule(name)
    if (!pkg) {
      throw new Error(`Can not found module by name ${name}`)
    }

    const upstreamVersionIsExisted = checkIsVersionExisted(pkg, upstream)
    if (!upstreamVersionIsExisted) {
      throw new Error(
        `Can not set undefined version for upstream by ${upstream}.`,
      )
    }

    const fallbackVersionIsExisted =
      fallback && checkIsVersionExisted(pkg, fallback)
    if (fallback && !fallbackVersionIsExisted) {
      throw new Error(
        `Can not set undefined version for fallback by ${fallback}.`,
      )
    }

    const updateFields = {
      'tags.upstream': upstream,
      'tags.fallback': fallback,
    }

    const { nModified: updated } = await this.db.Module.updateOne(
      { _id: pkg._id },
      {
        $set: updateFields,
      },
    )

    return {
      _id: pkg._id,
      name: pkg.name,
      rollbacked: rollbackInfo,
      updated,
    }
  }
  // tslint:disable-next-line: no-empty
  async lockModule(token: string, name: string) {}
  // tslint:disable-next-line: no-empty
  async unlockModule(token: string, name: string) {}

  async getConfig() {
    const modules = await this.getModules()

    const transformed = modules.reduce(
      (acc: any, { name, tags, versions }: any) => {
        const upstreamTag = versionHelpers.encode(tags.upstream)
        const upstream =
          upstreamTag && Object.assign({ host: 'self' }, versions[upstreamTag])

        const fallbackTag = versionHelpers.encode(tags.fallback)
        const fallback =
          fallbackTag && Object.assign({ host: 'self' }, versions[fallbackTag])

        return Object.assign(acc, { [name]: { upstream, fallback } })
      },
      {},
    )

    return {
      modules: transformed,
    }
  }
}

export default MongoDB
