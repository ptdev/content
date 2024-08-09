import { resolve } from 'pathe'
import { type Nuxt } from '@nuxt/schema'
import fsDriver, { type FSStorageOptions } from 'unstorage/drivers/fs'
import httpDriver, { type HTTPOptions } from 'unstorage/drivers/http'
import githubDriver, { type GithubOptions } from 'unstorage/drivers/github'
import type { MountOptions } from '../types/source'

export const MOUNT_PREFIX = ''

const unstorageDrivers = {
  fs: fsDriver,
  http: httpDriver,
  github: githubDriver,
}

/**
 * Resolve driver of a mount.
 */
export async function getMountDriver(options: MountOptions) {
  const dirverName = options.driver as keyof typeof unstorageDrivers
  switch (dirverName) {
    case 'fs':
      return fsDriver(options as FSStorageOptions)
    case 'http':
      return httpDriver(options as HTTPOptions)
    case 'github':
      return githubDriver(options as GithubOptions)
    default:
      try {
        return (await import(options.driver)).default(options)
      }
      catch (e) {
        console.error('Couldn\'t load driver', options.driver)
      }
  }
}

/**
 * Generate mount options for content storages
 */
export function generateStorageMountOptions(nuxt: Nuxt, storages: Array<string | MountOptions> | Record<string, MountOptions>) {
  const key = (path: string, prefix = '') => `${MOUNT_PREFIX}${path.replace(/[/:]/g, '_')}${prefix.replace(/\//g, ':')}`
  const baseDir = (nuxt.options.future as unknown as { compatibilityVersion: number })?.compatibilityVersion === 4
    ? nuxt.options.rootDir
    : nuxt.options.srcDir
  const storageKeys = Object.keys(storages)
  // TODO: remove array syntax
  if (
    Array.isArray(storages)
    // Detect object representation of array `{ '0': 'source1' }`. Nuxt converts this array to object when using `nuxt.config.ts`
    || (storageKeys.length > 0 && storageKeys.every(i => i === String(+i)))
  ) {
    storages = Object.values(storages)
    storages = storages.reduce((mounts, storage) => {
      if (typeof storage === 'string') {
        mounts[key(storage)] = {
          name: storage,
          driver: 'fs',
          prefix: '',
          base: resolve(baseDir, storage),
        } as MountOptions
      }

      if (typeof storage === 'object') {
        mounts[key(storage.name!, storage.prefix)] = storage
      }

      return mounts
    }, {} as Record<string, MountOptions>)
  }
  else {
    storages = Object.entries(storages).reduce((mounts, [name, storage]) => {
      mounts[key(storage.name || name, storage.prefix)] = storage
      return mounts
    }, {} as Record<string, MountOptions>)
  }

  const defaultStorage = key('content')
  if (!storages[defaultStorage]) {
    storages[defaultStorage] = {
      name: defaultStorage,
      driver: 'fs',
      base: resolve(baseDir, 'content'),
    } as MountOptions
  }

  return storages
}

export function* chunks<T>(arr: T[], size: number): Generator<T[], void, unknown> {
  for (let i = 0; i < arr.length; i += size) {
    yield arr.slice(i, i + size)
  }
}
