import getReleasePlan from '@changesets/get-release-plan'
import { getChangedPackagesSinceRef } from '@changesets/git'
import { getPackages, type Package } from '@manypkg/get-packages'
import { describe, expect, it, vi } from 'vitest'

import {
  getChangedPackages,
  getChangedPackagesWithoutReleasePlan,
  getChangesetVersionByPackageName,
  getPackagesWithReleasePlan
} from './changesets'

const rootPackage = {
  dir: '.',
  packageJson: {
    name: 'fake-root-package',
    version: '1.0.0'
  }
} as Package
const packageWithReleasePlan = {
  dir: './package-with-release-plan',
  packageJson: {
    name: 'package-with-release-plan',
    version: '0.0.1'
  }
} as Package
const packageWithoutReleasePlan = {
  dir: './package-without-release-plan',
  packageJson: {
    name: 'package-without-release-plan',
    version: '3.0.0'
  }
} as Package
const unchangedPackageWithReleasePlan = {
  dir: './unchanged-package-with-release-plan',
  packageJson: {
    name: 'unchanged-package-with-release-plan',
    version: '1.5.0'
  }
} as Package
const unchangedPackageWithoutReleasePlan = {
  dir: './unchanged-package-without-release-plan',
  packageJson: {
    name: 'unchanged-package-without-release-plan',
    version: '2.0.0'
  }
} as Package

vi.mock('@changesets/get-release-plan', () => ({
  __esModule: true,
  default: vi.fn()
}))
vi.mock('@changesets/git', () => ({
  getChangedPackagesSinceRef: vi.fn()
}))
vi.mock('@manypkg/get-packages', () => ({
  getPackages: vi.fn()
}))

describe('#getPackagesWithReleasePlan', () => {
  it('should return packages affected by release plan', async () => {
    vi.mocked(getPackages).mockResolvedValue({
      tool: 'yarn',
      packages: [packageWithReleasePlan],
      root: rootPackage
    })
    vi.mocked(getReleasePlan).mockResolvedValue({
      changesets: [],
      releases: [
        {
          name: packageWithReleasePlan.packageJson.name,
          type: 'minor',
          oldVersion: '0.0.1',
          newVersion: '0.1.0',
          changesets: []
        }
      ],
      preState: undefined
    })

    await expect(
      getPackagesWithReleasePlan({
        repositoryRootPath: 'fake-repo-root-path',
        repositoryBaseBranch: 'fake-repo-base-branch'
      })
    ).resolves.toEqual([packageWithReleasePlan])

    expect(getPackages).toHaveBeenCalledWith('fake-repo-root-path')
    expect(getReleasePlan).toHaveBeenCalledWith(
      'fake-repo-root-path',
      'fake-repo-base-branch'
    )
  })

  it('should not return packages not affected by release plan', async () => {
    vi.mocked(getPackages).mockResolvedValue({
      tool: 'yarn',
      packages: [packageWithReleasePlan, packageWithoutReleasePlan],
      root: rootPackage
    })
    vi.mocked(getReleasePlan).mockResolvedValue({
      changesets: [],
      releases: [
        {
          name: packageWithReleasePlan.packageJson.name,
          type: 'minor',
          oldVersion: '0.0.1',
          newVersion: '0.1.0',
          changesets: []
        }
      ],
      preState: undefined
    })

    await expect(
      getPackagesWithReleasePlan({
        repositoryRootPath: 'fake-repo-root-path',
        repositoryBaseBranch: 'fake-repo-base-branch'
      })
    ).resolves.toEqual([packageWithReleasePlan])

    expect(getPackages).toHaveBeenCalledWith('fake-repo-root-path')
    expect(getReleasePlan).toHaveBeenCalledWith(
      'fake-repo-root-path',
      'fake-repo-base-branch'
    )
  })
})

describe('#getChangedPackages', () => {
  it('should return all changed packages', async () => {
    vi.mocked(getChangedPackagesSinceRef).mockResolvedValue([
      packageWithReleasePlan
    ])

    await expect(
      getChangedPackages({
        repositoryRootPath: 'fake-repo-root-path',
        repositoryBaseBranch: 'fake-repo-base-branch'
      })
    ).resolves.toEqual([packageWithReleasePlan])

    expect(getChangedPackagesSinceRef).toHaveBeenCalledWith({
      cwd: 'fake-repo-root-path',
      ref: 'fake-repo-base-branch'
    })
  })
})

describe('#getChangedPackagesWithoutReleasePlan', () => {
  it('should return changed packages not affected by release plan', async () => {
    vi.mocked(getChangedPackagesSinceRef).mockResolvedValue([
      packageWithoutReleasePlan
    ])
    vi.mocked(getPackages).mockResolvedValue({
      tool: 'yarn',
      packages: [packageWithReleasePlan],
      root: rootPackage
    })
    vi.mocked(getReleasePlan).mockResolvedValue({
      changesets: [],
      releases: [
        {
          name: packageWithReleasePlan.packageJson.name,
          type: 'minor',
          oldVersion: '0.0.1',
          newVersion: '0.1.0',
          changesets: []
        }
      ],
      preState: undefined
    })

    await expect(
      getChangedPackagesWithoutReleasePlan({
        repositoryRootPath: 'fake-repo-root-path',
        repositoryBaseBranch: 'fake-repo-base-branch'
      })
    ).resolves.toEqual([packageWithoutReleasePlan])

    expect(getChangedPackagesSinceRef).toHaveBeenCalledWith({
      cwd: 'fake-repo-root-path',
      ref: 'fake-repo-base-branch'
    })
    expect(getPackages).toHaveBeenCalledWith('fake-repo-root-path')
    expect(getReleasePlan).toHaveBeenCalledWith(
      'fake-repo-root-path',
      'fake-repo-base-branch'
    )
  })

  it('should not return changed packages affected by release plan', async () => {
    vi.mocked(getChangedPackagesSinceRef).mockResolvedValue([
      packageWithReleasePlan,
      packageWithoutReleasePlan
    ])
    vi.mocked(getPackages).mockResolvedValue({
      tool: 'yarn',
      packages: [packageWithReleasePlan, packageWithoutReleasePlan],
      root: rootPackage
    })
    vi.mocked(getReleasePlan).mockResolvedValue({
      changesets: [],
      releases: [
        {
          name: packageWithReleasePlan.packageJson.name,
          type: 'minor',
          oldVersion: '0.0.1',
          newVersion: '0.1.0',
          changesets: []
        }
      ],
      preState: undefined
    })

    await expect(
      getChangedPackagesWithoutReleasePlan({
        repositoryRootPath: 'fake-repo-root-path',
        repositoryBaseBranch: 'fake-repo-base-branch'
      })
    ).resolves.toEqual([packageWithoutReleasePlan])

    expect(getChangedPackagesSinceRef).toHaveBeenCalledWith({
      cwd: 'fake-repo-root-path',
      ref: 'fake-repo-base-branch'
    })
    expect(getPackages).toHaveBeenCalledWith('fake-repo-root-path')
    expect(getReleasePlan).toHaveBeenCalledWith(
      'fake-repo-root-path',
      'fake-repo-base-branch'
    )
  })

  it('should not return unchanged packages not affected by release plan', async () => {
    vi.mocked(getChangedPackagesSinceRef).mockResolvedValue([
      packageWithoutReleasePlan
    ])
    vi.mocked(getPackages).mockResolvedValue({
      tool: 'yarn',
      packages: [unchangedPackageWithoutReleasePlan, packageWithReleasePlan],
      root: rootPackage
    })
    vi.mocked(getReleasePlan).mockResolvedValue({
      changesets: [],
      releases: [
        {
          name: packageWithReleasePlan.packageJson.name,
          type: 'minor',
          oldVersion: '0.0.1',
          newVersion: '0.1.0',
          changesets: []
        }
      ],
      preState: undefined
    })

    await expect(
      getChangedPackagesWithoutReleasePlan({
        repositoryRootPath: 'fake-repo-root-path',
        repositoryBaseBranch: 'fake-repo-base-branch'
      })
    ).resolves.toEqual([packageWithoutReleasePlan])

    expect(getChangedPackagesSinceRef).toHaveBeenCalledWith({
      cwd: 'fake-repo-root-path',
      ref: 'fake-repo-base-branch'
    })
    expect(getPackages).toHaveBeenCalledWith('fake-repo-root-path')
    expect(getReleasePlan).toHaveBeenCalledWith(
      'fake-repo-root-path',
      'fake-repo-base-branch'
    )
  })

  it('should not return unchanged packages affected by release plan', async () => {
    vi.mocked(getChangedPackagesSinceRef).mockResolvedValue([
      packageWithoutReleasePlan
    ])
    vi.mocked(getPackages).mockResolvedValue({
      tool: 'yarn',
      packages: [unchangedPackageWithReleasePlan, packageWithReleasePlan],
      root: rootPackage
    })
    vi.mocked(getReleasePlan).mockResolvedValue({
      changesets: [],
      releases: [
        {
          name: packageWithReleasePlan.packageJson.name,
          type: 'minor',
          oldVersion: '0.0.1',
          newVersion: '0.1.0',
          changesets: []
        },
        {
          name: unchangedPackageWithReleasePlan.packageJson.name,
          type: 'minor',
          oldVersion: '1.5.0',
          newVersion: '1.6.0',
          changesets: []
        }
      ],
      preState: undefined
    })

    await expect(
      getChangedPackagesWithoutReleasePlan({
        repositoryRootPath: 'fake-repo-root-path',
        repositoryBaseBranch: 'fake-repo-base-branch'
      })
    ).resolves.toEqual([packageWithoutReleasePlan])

    expect(getChangedPackagesSinceRef).toHaveBeenCalledWith({
      cwd: 'fake-repo-root-path',
      ref: 'fake-repo-base-branch'
    })
    expect(getPackages).toHaveBeenCalledWith('fake-repo-root-path')
    expect(getReleasePlan).toHaveBeenCalledWith(
      'fake-repo-root-path',
      'fake-repo-base-branch'
    )
  })
})

describe('#getChangesetVersionByPackageName', () => {
  it('should return the resulting version of a package after applying changesets', async () => {
    vi.mocked(getReleasePlan).mockResolvedValue({
      changesets: [],
      releases: [
        {
          name: packageWithReleasePlan.packageJson.name,
          type: 'minor',
          oldVersion: '0.0.1',
          newVersion: '0.1.0',
          changesets: []
        }
      ],
      preState: undefined
    })

    await expect(
      getChangesetVersionByPackageName({
        repositoryRootPath: 'fake-repo-root-path',
        repositoryBaseBranch: 'fake-repo-base-branch'
      })
    ).resolves.toEqual({
      [packageWithReleasePlan.packageJson.name]: '0.1.0'
    })

    expect(getReleasePlan).toHaveBeenCalledWith(
      'fake-repo-root-path',
      'fake-repo-base-branch'
    )
  })
})
