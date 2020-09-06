import {getInput, setOutput} from '@actions/core'

export function getOptionsFromGithubActionInput(): {
  repositoryRootPath: string
  repositoryBaseBranch: string
} {
  return {
    repositoryRootPath: getInput('repository_path'),
    repositoryBaseBranch: getInput('base_branch')
  }
}

export function setGithubActionOutputFromResults({
  packagesAffectedByReleasePlan,
  changedPackages,
  changedPackagesWithoutChangeset,
  packagesVersionsAfterApplyingReleasePlan
}: {
  packagesAffectedByReleasePlan: string[]
  changedPackages: string[]
  changedPackagesWithoutChangeset: string[]
  packagesVersionsAfterApplyingReleasePlan: Record<string, string>
}): void {
  setOutput('packages_affected_by_release_plan', packagesAffectedByReleasePlan)
  setOutput('changed_packages', changedPackages)
  setOutput(
    'changed_packages_without_changeset',
    changedPackagesWithoutChangeset
  )
  setOutput(
    'packages_versions_after_applying_release_plan',
    packagesVersionsAfterApplyingReleasePlan
  )
}
