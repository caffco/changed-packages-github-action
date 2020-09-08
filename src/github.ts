import {getInput, setOutput, info, warning} from '@actions/core'

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
  info(
    `Packages affected by release plan: ${packagesAffectedByReleasePlan.join()}`
  )
  setOutput('packages_affected_by_release_plan', packagesAffectedByReleasePlan)

  info(`Changed packages: ${changedPackages.join()}`)
  setOutput('changed_packages', changedPackages)

  info(
    `Changed packages without changeset: ${changedPackagesWithoutChangeset.join()}`
  )
  setOutput(
    'changed_packages_without_changeset',
    changedPackagesWithoutChangeset
  )

  const allChangedPackagesHaveChangeset =
    changedPackagesWithoutChangeset.length === 0

  if (!allChangedPackagesHaveChangeset) {
    warning('There are changed packages without changeset')
  }

  setOutput(
    'all_changed_packages_have_changeset',
    allChangedPackagesHaveChangeset
  )

  const packagesVersionsAfterApplyingReleasePlanList = Object.keys(
    packagesVersionsAfterApplyingReleasePlan
  ).map(
    packageName =>
      `${packageName}@${packagesVersionsAfterApplyingReleasePlan[packageName]}`
  )
  info(
    `Packages versions after applying release plan: ${packagesVersionsAfterApplyingReleasePlanList.join()}`
  )
  setOutput(
    'packages_versions_after_applying_release_plan',
    packagesVersionsAfterApplyingReleasePlan
  )
}
