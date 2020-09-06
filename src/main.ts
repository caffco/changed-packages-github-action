import {
  getOptionsFromGithubActionInput,
  setGithubActionOutputFromResults
} from './github'
import {
  getPackagesWithReleasePlan,
  getChangedPackages,
  getChangedPackagesWithoutReleasePlan,
  getChangesetVersionByPackageName
} from './changesets'

export default async function main(): Promise<void> {
  const options = getOptionsFromGithubActionInput()

  const packagesWithReleasePlan = await getPackagesWithReleasePlan(options)

  const packagesAffectedByReleasePlan = packagesWithReleasePlan.map(
    singlePackage => singlePackage.packageJson.name
  )
  const changedPackages = await getChangedPackages(options)
  const changedPackagesNames = changedPackages.map(
    singlePackage => singlePackage.packageJson.name
  )

  const changedPackagesWithoutReleasePlan = await getChangedPackagesWithoutReleasePlan(
    options
  )
  const changedPackagesWithoutChangesets = changedPackagesWithoutReleasePlan.map(
    singlePackage => singlePackage.packageJson.name
  )

  const packagesVersionsAfterApplyingReleasePlan = await getChangesetVersionByPackageName(
    options
  )

  const results = {
    packagesAffectedByReleasePlan,
    changedPackages: changedPackagesNames,
    changedPackagesWithoutChangeset: changedPackagesWithoutChangesets,
    packagesVersionsAfterApplyingReleasePlan
  }

  setGithubActionOutputFromResults(results)
}
