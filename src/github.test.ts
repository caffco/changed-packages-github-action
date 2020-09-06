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
