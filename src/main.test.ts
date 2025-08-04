import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  getChangedPackages,
  getChangedPackagesWithoutReleasePlan,
  getChangesetVersionByPackageName,
  getPackagesWithReleasePlan
} from './changesets'
import {
  getOptionsFromGithubActionInput,
  setGithubActionOutputFromResults
} from './github'

import main from './main'

vi.mock('./changesets', () => ({
  getPackagesWithReleasePlan: vi.fn(),
  getChangedPackages: vi.fn(),
  getChangedPackagesWithoutReleasePlan: vi.fn(),
  getChangesetVersionByPackageName: vi.fn()
}))
vi.mock('./github', () => ({
  getOptionsFromGithubActionInput: vi.fn(),
  setGithubActionOutputFromResults: vi.fn()
}))

afterEach(() => {
  vi.clearAllMocks()
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
    vi.mocked(getOptionsFromGithubActionInput).mockReturnValue(fakeInput)
    vi.mocked(setGithubActionOutputFromResults).mockImplementation(() => {})

    vi.mocked(getPackagesWithReleasePlan).mockResolvedValue([
      changedPackageWithReleasePlan,
      unchangedPackageWithReleasePlan
    ])

    vi.mocked(getChangedPackages).mockResolvedValue([
      changedPackageWithReleasePlan,
      changedPackageWithoutReleasePlan
    ])

    vi.mocked(getChangedPackagesWithoutReleasePlan).mockResolvedValue([
      changedPackageWithoutReleasePlan
    ])

    vi.mocked(getChangesetVersionByPackageName).mockResolvedValue({
      [changedPackageWithReleasePlan.packageJson.name]: '1.0.1',
      [unchangedPackageWithReleasePlan.packageJson.name]: '2.0.1'
    })
  })

  it('should call helper functions with settings taken from Github action input', async () => {
    await expect(main()).resolves.toBeUndefined()

    expect(getPackagesWithReleasePlan).toHaveBeenCalledWith(fakeInput)
    expect(getChangedPackages).toHaveBeenCalledWith(fakeInput)
    expect(getChangedPackagesWithoutReleasePlan).toHaveBeenCalledWith(fakeInput)
    expect(getChangesetVersionByPackageName).toHaveBeenCalledWith(fakeInput)
  })

  it('should set Github action output to values returned by helper functions', async () => {
    await expect(main()).resolves.toBeUndefined()

    expect(setGithubActionOutputFromResults).toHaveBeenCalledWith({
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
