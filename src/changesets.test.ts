import {
  getPackagesWithReleasePlan,
  getChangedPackagesWithoutReleasePlan,
  getChangesetVersionByPackageName,
  getChangedPackages
} from './changesets'

import * as manypkgGetPackages from '@manypkg/get-packages'
import * as changesetsGit from '@changesets/git'
import * as changesetsGetReleasePlan from '@changesets/get-release-plan'

const rootPackage = {
  dir: '.',
  packageJson: {
    name: 'fake-root-package',
    version: '1.0.0'
  }
}
const packageWithReleasePlan = {
  dir: './package-with-release-plan',
  packageJson: {
    name: 'package-with-release-plan',
    version: '0.0.1'
  }
}
const packageWithoutReleasePlan = {
  dir: './package-without-release-plan',
  packageJson: {
    name: 'package-without-release-plan',
    version: '3.0.0'
  }
}
const unchangedPackageWithReleasePlan = {
  dir: './unchanged-package-with-release-plan',
  packageJson: {
    name: 'unchanged-package-with-release-plan',
    version: '1.5.0'
  }
}
const unchangedPackageWithoutReleasePlan = {
  dir: './unchanged-package-without-release-plan',
  packageJson: {
    name: 'unchanged-package-without-release-plan',
    version: '2.0.0'
  }
}

describe('Changesets', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('#getPackagesWithReleasePlan', () => {
    it('should return packages affected by release plan', async () => {
      jest.spyOn(manypkgGetPackages, 'getPackages').mockResolvedValue({
        tool: 'yarn',
        packages: [packageWithReleasePlan],
        root: rootPackage
      })
      jest.spyOn(changesetsGetReleasePlan, 'default').mockResolvedValue({
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

      expect(manypkgGetPackages.getPackages).toHaveBeenCalledWith(
        'fake-repo-root-path'
      )
      expect(changesetsGetReleasePlan.default).toHaveBeenCalledWith(
        'fake-repo-root-path',
        'fake-repo-base-branch'
      )
    })

    it('should not return packages not affected by release plan', async () => {
      jest.spyOn(manypkgGetPackages, 'getPackages').mockResolvedValue({
        tool: 'yarn',
        packages: [packageWithReleasePlan, packageWithoutReleasePlan],
        root: rootPackage
      })
      jest.spyOn(changesetsGetReleasePlan, 'default').mockResolvedValue({
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

      expect(manypkgGetPackages.getPackages).toHaveBeenCalledWith(
        'fake-repo-root-path'
      )
      expect(changesetsGetReleasePlan.default).toHaveBeenCalledWith(
        'fake-repo-root-path',
        'fake-repo-base-branch'
      )
    })
  })

  describe('#getChangedPackages', () => {
    it('should return all changed packages', async () => {
      jest
        .spyOn(changesetsGit, 'getChangedPackagesSinceRef')
        .mockResolvedValue([packageWithReleasePlan])

      await expect(
        getChangedPackages({
          repositoryRootPath: 'fake-repo-root-path',
          repositoryBaseBranch: 'fake-repo-base-branch'
        })
      ).resolves.toEqual([packageWithReleasePlan])

      expect(changesetsGit.getChangedPackagesSinceRef).toHaveBeenCalledWith({
        cwd: 'fake-repo-root-path',
        ref: 'fake-repo-base-branch'
      })
    })
  })

  describe('#getChangedPackagesWithoutReleasePlan', () => {
    it('should return changed packages not affected by release plan', async () => {
      jest
        .spyOn(changesetsGit, 'getChangedPackagesSinceRef')
        .mockResolvedValue([packageWithoutReleasePlan])
      jest.spyOn(manypkgGetPackages, 'getPackages').mockResolvedValue({
        tool: 'yarn',
        packages: [packageWithReleasePlan],
        root: rootPackage
      })
      jest.spyOn(changesetsGetReleasePlan, 'default').mockResolvedValue({
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

      expect(changesetsGit.getChangedPackagesSinceRef).toHaveBeenCalledWith({
        cwd: 'fake-repo-root-path',
        ref: 'fake-repo-base-branch'
      })
      expect(manypkgGetPackages.getPackages).toHaveBeenCalledWith(
        'fake-repo-root-path'
      )
      expect(changesetsGetReleasePlan.default).toHaveBeenCalledWith(
        'fake-repo-root-path',
        'fake-repo-base-branch'
      )
    })

    it('should not return changed packages affected by release plan', async () => {
      jest
        .spyOn(changesetsGit, 'getChangedPackagesSinceRef')
        .mockResolvedValue([packageWithReleasePlan, packageWithoutReleasePlan])
      jest.spyOn(manypkgGetPackages, 'getPackages').mockResolvedValue({
        tool: 'yarn',
        packages: [packageWithReleasePlan, packageWithoutReleasePlan],
        root: rootPackage
      })
      jest.spyOn(changesetsGetReleasePlan, 'default').mockResolvedValue({
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

      expect(changesetsGit.getChangedPackagesSinceRef).toHaveBeenCalledWith({
        cwd: 'fake-repo-root-path',
        ref: 'fake-repo-base-branch'
      })
      expect(manypkgGetPackages.getPackages).toHaveBeenCalledWith(
        'fake-repo-root-path'
      )
      expect(changesetsGetReleasePlan.default).toHaveBeenCalledWith(
        'fake-repo-root-path',
        'fake-repo-base-branch'
      )
    })

    it('should not return unchanged packages not affected by release plan', async () => {
      jest
        .spyOn(changesetsGit, 'getChangedPackagesSinceRef')
        .mockResolvedValue([packageWithoutReleasePlan])
      jest.spyOn(manypkgGetPackages, 'getPackages').mockResolvedValue({
        tool: 'yarn',
        packages: [unchangedPackageWithoutReleasePlan, packageWithReleasePlan],
        root: rootPackage
      })
      jest.spyOn(changesetsGetReleasePlan, 'default').mockResolvedValue({
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

      expect(changesetsGit.getChangedPackagesSinceRef).toHaveBeenCalledWith({
        cwd: 'fake-repo-root-path',
        ref: 'fake-repo-base-branch'
      })
      expect(manypkgGetPackages.getPackages).toHaveBeenCalledWith(
        'fake-repo-root-path'
      )
      expect(changesetsGetReleasePlan.default).toHaveBeenCalledWith(
        'fake-repo-root-path',
        'fake-repo-base-branch'
      )
    })

    it('should not return unchanged packages affected by release plan', async () => {
      jest
        .spyOn(changesetsGit, 'getChangedPackagesSinceRef')
        .mockResolvedValue([packageWithoutReleasePlan])
      jest.spyOn(manypkgGetPackages, 'getPackages').mockResolvedValue({
        tool: 'yarn',
        packages: [unchangedPackageWithReleasePlan, packageWithReleasePlan],
        root: rootPackage
      })
      jest.spyOn(changesetsGetReleasePlan, 'default').mockResolvedValue({
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

      expect(changesetsGit.getChangedPackagesSinceRef).toHaveBeenCalledWith({
        cwd: 'fake-repo-root-path',
        ref: 'fake-repo-base-branch'
      })
      expect(manypkgGetPackages.getPackages).toHaveBeenCalledWith(
        'fake-repo-root-path'
      )
      expect(changesetsGetReleasePlan.default).toHaveBeenCalledWith(
        'fake-repo-root-path',
        'fake-repo-base-branch'
      )
    })
  })

  describe('#getChangesetVersionByPackageName', () => {
    it('should return the resulting version of a package after applying changesets', async () => {
      jest.spyOn(changesetsGetReleasePlan, 'default').mockResolvedValue({
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

      expect(changesetsGetReleasePlan.default).toHaveBeenCalledWith(
        'fake-repo-root-path',
        'fake-repo-base-branch'
      )
    })
  })
})
