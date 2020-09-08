import * as core from '@actions/core'
import {
  getOptionsFromGithubActionInput,
  setGithubActionOutputFromResults
} from './github'

describe('Github', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('#getOptionsFromGithubActionInput', () => {
    beforeEach(() => {
      jest.spyOn(core, 'getInput').mockImplementation(
        key =>
          (({
            repository_path: 'fake-repo-path',
            base_branch: 'fake-base-branch'
          } as Record<string, string>)[key])
      )
    })

    it('should return proper value for `repositoryRootPath`', () => {
      expect(getOptionsFromGithubActionInput()).toHaveProperty(
        'repositoryRootPath',
        'fake-repo-path'
      )
      expect(core.getInput).toHaveBeenCalledWith('repository_path')
    })

    it('should return proper value for `repositoryBaseBranch`', () => {
      expect(getOptionsFromGithubActionInput()).toHaveProperty(
        'repositoryBaseBranch',
        'fake-base-branch'
      )
      expect(core.getInput).toHaveBeenCalledWith('base_branch')
    })
  })

  describe('#setGithubActionOutputFromResults', () => {
    beforeEach(() => {
      jest.spyOn(core, 'setOutput').mockImplementation(() => {})
      jest.spyOn(core, 'info').mockImplementation(() => {})
      jest.spyOn(core, 'warning').mockImplementation(() => {})
    })

    it('should log packages affected by release plan', async () => {
      setGithubActionOutputFromResults({
        packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
        changedPackages: ['changed-package'],
        changedPackagesWithoutChangeset: [
          'changed-package-without-release-plan'
        ],
        packagesVersionsAfterApplyingReleasePlan: {
          'package-affected-by-release-plan': '2.0.0'
        }
      })

      expect(core.info).toHaveBeenCalledWith(
        'Packages affected by release plan: package-affected-by-release-plan'
      )
    })

    it('should set `packagesAffectedByReleasePlan` output to proper value', () => {
      setGithubActionOutputFromResults({
        packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
        changedPackages: ['changed-package'],
        changedPackagesWithoutChangeset: [
          'changed-package-without-release-plan'
        ],
        packagesVersionsAfterApplyingReleasePlan: {
          'package-affected-by-release-plan': '2.0.0'
        }
      })

      expect(
        core.setOutput
      ).toHaveBeenCalledWith('packages_affected_by_release_plan', [
        'package-affected-by-release-plan'
      ])
    })

    it('should log changed packages', async () => {
      setGithubActionOutputFromResults({
        packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
        changedPackages: ['changed-package'],
        changedPackagesWithoutChangeset: [
          'changed-package-without-release-plan'
        ],
        packagesVersionsAfterApplyingReleasePlan: {
          'package-affected-by-release-plan': '2.0.0'
        }
      })

      expect(core.info).toHaveBeenCalledWith(
        'Changed packages: changed-package'
      )
    })

    it('should set `changedPackages` output to proper value', () => {
      setGithubActionOutputFromResults({
        packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
        changedPackages: ['changed-package'],
        changedPackagesWithoutChangeset: [
          'changed-package-without-release-plan'
        ],
        packagesVersionsAfterApplyingReleasePlan: {
          'package-affected-by-release-plan': '2.0.0'
        }
      })

      expect(core.setOutput).toHaveBeenCalledWith('changed_packages', [
        'changed-package'
      ])
    })

    it('should log changed packages without changeset', async () => {
      setGithubActionOutputFromResults({
        packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
        changedPackages: ['changed-package'],
        changedPackagesWithoutChangeset: [
          'changed-package-without-release-plan'
        ],
        packagesVersionsAfterApplyingReleasePlan: {
          'package-affected-by-release-plan': '2.0.0'
        }
      })

      expect(core.info).toHaveBeenCalledWith(
        'Changed packages without changeset: changed-package-without-release-plan'
      )
    })

    it('should log a warning if there are changed packages without changeset', async () => {
      setGithubActionOutputFromResults({
        packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
        changedPackages: ['changed-package'],
        changedPackagesWithoutChangeset: [
          'changed-package-without-release-plan'
        ],
        packagesVersionsAfterApplyingReleasePlan: {
          'package-affected-by-release-plan': '2.0.0'
        }
      })

      expect(core.warning).toHaveBeenCalledWith(
        'There are changed packages without changeset'
      )
    })

    it('should set `all_changed_packages_have_changeset` to `false` if there are changed packages without changeset', async () => {
      setGithubActionOutputFromResults({
        packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
        changedPackages: ['changed-package'],
        changedPackagesWithoutChangeset: [
          'changed-package-without-release-plan'
        ],
        packagesVersionsAfterApplyingReleasePlan: {
          'package-affected-by-release-plan': '2.0.0'
        }
      })

      expect(core.setOutput).toHaveBeenCalledWith(
        'all_changed_packages_have_changeset',
        false
      )
    })

    it('should not log a warning if there are no changed packages without changeset', async () => {
      setGithubActionOutputFromResults({
        packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
        changedPackages: ['changed-package'],
        changedPackagesWithoutChangeset: [],
        packagesVersionsAfterApplyingReleasePlan: {
          'package-affected-by-release-plan': '2.0.0'
        }
      })

      expect(core.warning).not.toHaveBeenCalled()
    })

    it('should set `all_changed_packages_have_changeset` to `true` if there are no changed packages without changeset', async () => {
      setGithubActionOutputFromResults({
        packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
        changedPackages: ['changed-package'],
        changedPackagesWithoutChangeset: [],
        packagesVersionsAfterApplyingReleasePlan: {
          'package-affected-by-release-plan': '2.0.0'
        }
      })

      expect(core.setOutput).toHaveBeenCalledWith(
        'all_changed_packages_have_changeset',
        true
      )
    })

    it('should set `changedPackagesWithoutChangeset` output to proper value', () => {
      setGithubActionOutputFromResults({
        packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
        changedPackages: ['changed-package'],
        changedPackagesWithoutChangeset: [
          'changed-package-without-release-plan'
        ],
        packagesVersionsAfterApplyingReleasePlan: {
          'package-affected-by-release-plan': '2.0.0'
        }
      })

      expect(
        core.setOutput
      ).toHaveBeenCalledWith('changed_packages_without_changeset', [
        'changed-package-without-release-plan'
      ])
    })

    it('should log packages versions after applying release plan', async () => {
      setGithubActionOutputFromResults({
        packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
        changedPackages: ['changed-package'],
        changedPackagesWithoutChangeset: [
          'changed-package-without-release-plan'
        ],
        packagesVersionsAfterApplyingReleasePlan: {
          'package-affected-by-release-plan': '2.0.0'
        }
      })

      expect(core.info).toHaveBeenCalledWith(
        'Packages versions after applying release plan: package-affected-by-release-plan@2.0.0'
      )
    })

    it('should set `packagesVersionsAfterApplyingReleasePlan` output to proper value', () => {
      setGithubActionOutputFromResults({
        packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
        changedPackages: ['changed-package'],
        changedPackagesWithoutChangeset: [
          'changed-package-without-release-plan'
        ],
        packagesVersionsAfterApplyingReleasePlan: {
          'package-affected-by-release-plan': '2.0.0'
        }
      })

      expect(core.setOutput).toHaveBeenCalledWith(
        'packages_versions_after_applying_release_plan',
        {
          'package-affected-by-release-plan': '2.0.0'
        }
      )
    })
  })
})
