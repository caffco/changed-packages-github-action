import { getInput, info, setOutput, summary, warning } from '@actions/core'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getOptionsFromGithubActionInput,
  setGithubActionOutputFromResults
} from './github'

vi.mock('@actions/core', () => ({
  getInput: vi.fn(),
  setOutput: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  summary: {
    addHeading: vi.fn(),
    addTable: vi.fn(),
    write: vi.fn()
  }
}))

describe('#getOptionsFromGithubActionInput', () => {
  beforeEach(() => {
    vi.mocked(getInput).mockImplementation(
      (key) =>
        (
          ({
            repository_path: 'fake-repo-path',
            base_branch: 'fake-base-branch'
          }) as Record<string, string>
        )[key]
    )
  })

  it('should return proper value for `repositoryRootPath`', () => {
    expect(getOptionsFromGithubActionInput()).toHaveProperty(
      'repositoryRootPath',
      'fake-repo-path'
    )
    expect(getInput).toHaveBeenCalledWith('repository_path')
  })

  it('should return proper value for `repositoryBaseBranch`', () => {
    expect(getOptionsFromGithubActionInput()).toHaveProperty(
      'repositoryBaseBranch',
      'fake-base-branch'
    )
    expect(getInput).toHaveBeenCalledWith('base_branch')
  })
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('#setGithubActionOutputFromResults', () => {
  beforeEach(() => {
    vi.mocked(setOutput).mockImplementation(() => {})
    vi.mocked(info).mockImplementation(() => {})
    vi.mocked(warning).mockImplementation(() => {})

    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(summary.addHeading).mockReturnThis()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(summary.addTable).mockReturnThis()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    vi.mocked(summary.write).mockReturnThis()
  })

  it('should log packages affected by release plan', async () => {
    setGithubActionOutputFromResults({
      packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
      changedPackages: ['changed-package'],
      changedPackagesWithoutChangeset: ['changed-package-without-release-plan'],
      packagesVersionsAfterApplyingReleasePlan: {
        'package-affected-by-release-plan': '2.0.0'
      }
    })

    expect(info).toHaveBeenCalledWith(
      'Packages affected by release plan: package-affected-by-release-plan'
    )
  })

  it('should set `packagesAffectedByReleasePlan` output to proper value', () => {
    setGithubActionOutputFromResults({
      packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
      changedPackages: ['changed-package'],
      changedPackagesWithoutChangeset: ['changed-package-without-release-plan'],
      packagesVersionsAfterApplyingReleasePlan: {
        'package-affected-by-release-plan': '2.0.0'
      }
    })

    expect(setOutput).toHaveBeenCalledWith(
      'packages_affected_by_release_plan',
      ['package-affected-by-release-plan']
    )
  })

  it('should log changed packages', async () => {
    setGithubActionOutputFromResults({
      packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
      changedPackages: ['changed-package'],
      changedPackagesWithoutChangeset: ['changed-package-without-release-plan'],
      packagesVersionsAfterApplyingReleasePlan: {
        'package-affected-by-release-plan': '2.0.0'
      }
    })

    expect(info).toHaveBeenCalledWith('Changed packages: changed-package')
  })

  it('should set `changedPackages` output to proper value', () => {
    setGithubActionOutputFromResults({
      packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
      changedPackages: ['changed-package'],
      changedPackagesWithoutChangeset: ['changed-package-without-release-plan'],
      packagesVersionsAfterApplyingReleasePlan: {
        'package-affected-by-release-plan': '2.0.0'
      }
    })

    expect(setOutput).toHaveBeenCalledWith('changed_packages', [
      'changed-package'
    ])
  })

  it('should log changed packages without changeset', async () => {
    setGithubActionOutputFromResults({
      packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
      changedPackages: ['changed-package'],
      changedPackagesWithoutChangeset: ['changed-package-without-release-plan'],
      packagesVersionsAfterApplyingReleasePlan: {
        'package-affected-by-release-plan': '2.0.0'
      }
    })

    expect(info).toHaveBeenCalledWith(
      'Changed packages without changeset: changed-package-without-release-plan'
    )
  })

  it('should log a warning if there are changed packages without changeset', async () => {
    setGithubActionOutputFromResults({
      packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
      changedPackages: ['changed-package'],
      changedPackagesWithoutChangeset: ['changed-package-without-release-plan'],
      packagesVersionsAfterApplyingReleasePlan: {
        'package-affected-by-release-plan': '2.0.0'
      }
    })

    expect(warning).toHaveBeenCalledWith(
      'There are changed packages without changeset'
    )
  })

  it('should set `all_changed_packages_have_changeset` to `false` if there are changed packages without changeset', async () => {
    setGithubActionOutputFromResults({
      packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
      changedPackages: ['changed-package'],
      changedPackagesWithoutChangeset: ['changed-package-without-release-plan'],
      packagesVersionsAfterApplyingReleasePlan: {
        'package-affected-by-release-plan': '2.0.0'
      }
    })

    expect(setOutput).toHaveBeenCalledWith(
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

    expect(warning).not.toHaveBeenCalled()
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

    expect(setOutput).toHaveBeenCalledWith(
      'all_changed_packages_have_changeset',
      true
    )
  })

  it('should set `changedPackagesWithoutChangeset` output to proper value', () => {
    setGithubActionOutputFromResults({
      packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
      changedPackages: ['changed-package'],
      changedPackagesWithoutChangeset: ['changed-package-without-release-plan'],
      packagesVersionsAfterApplyingReleasePlan: {
        'package-affected-by-release-plan': '2.0.0'
      }
    })

    expect(setOutput).toHaveBeenCalledWith(
      'changed_packages_without_changeset',
      ['changed-package-without-release-plan']
    )
  })

  it('should log packages versions after applying release plan', async () => {
    setGithubActionOutputFromResults({
      packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
      changedPackages: ['changed-package'],
      changedPackagesWithoutChangeset: ['changed-package-without-release-plan'],
      packagesVersionsAfterApplyingReleasePlan: {
        'package-affected-by-release-plan': '2.0.0'
      }
    })

    expect(info).toHaveBeenCalledWith(
      'Packages versions after applying release plan: package-affected-by-release-plan@2.0.0'
    )
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(summary.addHeading).toHaveBeenCalledWith('Changed packages')
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(summary.addTable).toHaveBeenCalledWith([
      [
        {
          data: 'Package',
          header: true
        },
        {
          data: 'New version',
          header: true
        }
      ],
      ['changed-package', '❌ (No changeset)'],
      ['package-affected-by-release-plan', '2.0.0']
    ])
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(summary.write).toHaveBeenCalled()
  })

  it('should set `packagesVersionsAfterApplyingReleasePlan` output to proper value', () => {
    setGithubActionOutputFromResults({
      packagesAffectedByReleasePlan: ['package-affected-by-release-plan'],
      changedPackages: ['changed-package'],
      changedPackagesWithoutChangeset: ['changed-package-without-release-plan'],
      packagesVersionsAfterApplyingReleasePlan: {
        'package-affected-by-release-plan': '2.0.0'
      }
    })

    expect(setOutput).toHaveBeenCalledWith(
      'packages_versions_after_applying_release_plan',
      {
        'package-affected-by-release-plan': '2.0.0'
      }
    )
  })
})
