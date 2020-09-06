import * as changesets from './changesets'
import * as github from './github'

import main from './main'

describe('Main', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('#default', () => {
    const fakeInput = {
      repositoryRootPath: 'fake-repo-path',
      repositoryBaseBranch: 'fake-base-branch'
    }
    const changedPackageWithReleasePlan = {
      dir: './changed-package-with-release-plan',
      packageJson: {
        name: 'changed-package-with-release-plan',
        version: '1.0.0'
      }
    }
    const unchangedPackageWithReleasePlan = {
      dir: './unchanged-package-with-release-plan',
      packageJson: {
        name: 'unchanged-package-with-release-plan',
        version: '2.0.0'
      }
    }
    const changedPackageWithoutReleasePlan = {
      dir: './changed-package-without-release-plan',
      packageJson: {
        name: 'changed-package-without-release-plan',
        version: '3.0.0'
      }
    }

    beforeEach(() => {
      jest
        .spyOn(github, 'getOptionsFromGithubActionInput')
        .mockReturnValue(fakeInput)
      jest
        .spyOn(github, 'setGithubActionOutputFromResults')
        .mockImplementation(() => {})

      jest
        .spyOn(changesets, 'getPackagesWithReleasePlan')
        .mockResolvedValue([
          changedPackageWithReleasePlan,
          unchangedPackageWithReleasePlan
        ])

      jest
        .spyOn(changesets, 'getChangedPackages')
        .mockResolvedValue([
          changedPackageWithReleasePlan,
          changedPackageWithoutReleasePlan
        ])

      jest
        .spyOn(changesets, 'getChangedPackagesWithoutReleasePlan')
        .mockResolvedValue([changedPackageWithoutReleasePlan])

      jest
        .spyOn(changesets, 'getChangesetVersionByPackageName')
        .mockResolvedValue({
          [changedPackageWithReleasePlan.packageJson.name]: '1.0.1',
          [unchangedPackageWithReleasePlan.packageJson.name]: '2.0.1'
        })
    })

    it('should call helper functions with settings taken from Github action input', async () => {
      await expect(main()).resolves.toBeUndefined()

      expect(changesets.getPackagesWithReleasePlan).toHaveBeenCalledWith(
        fakeInput
      )
      expect(changesets.getChangedPackages).toHaveBeenCalledWith(fakeInput)
      expect(
        changesets.getChangedPackagesWithoutReleasePlan
      ).toHaveBeenCalledWith(fakeInput)
      expect(changesets.getChangesetVersionByPackageName).toHaveBeenCalledWith(
        fakeInput
      )
    })

    it('should set Github action output to values returned by helper functions', async () => {
      await expect(main()).resolves.toBeUndefined()

      expect(github.setGithubActionOutputFromResults).toHaveBeenCalledWith({
        packagesAffectedByReleasePlan: [
          changedPackageWithReleasePlan.packageJson.name,
          unchangedPackageWithReleasePlan.packageJson.name
        ],
        changedPackages: [
          changedPackageWithReleasePlan.packageJson.name,
          changedPackageWithoutReleasePlan.packageJson.name
        ],
        changedPackagesWithoutChangeset: [
          changedPackageWithoutReleasePlan.packageJson.name
        ],
        packagesVersionsAfterApplyingReleasePlan: {
          [changedPackageWithReleasePlan.packageJson.name]: '1.0.1',
          [unchangedPackageWithReleasePlan.packageJson.name]: '2.0.1'
        }
      })
    })
  })
})
