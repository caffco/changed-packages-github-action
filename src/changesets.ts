import {Package, getPackages} from '@manypkg/get-packages'
import {getChangedPackagesSinceRef} from '@changesets/git'
import getReleasePlan from '@changesets/get-release-plan'

export async function getPackagesWithReleasePlan({
  repositoryRootPath,
  repositoryBaseBranch
}: {
  repositoryRootPath: string
  repositoryBaseBranch: string
}): Promise<Package[]> {
  const releasePlan = await getReleasePlan(
    repositoryRootPath,
    repositoryBaseBranch
  )
  const allPackages = await getPackages(repositoryRootPath)

  const packagesByName = allPackages.packages.reduce(
    (accum, singlePackage) => ({
      ...accum,
      [singlePackage.packageJson.name]: singlePackage
    }),
    {} as Record<string, Package>
  )

  const changedPackages = releasePlan.releases.map(
    release => packagesByName[release.name]
  )

  return changedPackages
}

export async function getChangedPackages({
  repositoryRootPath,
  repositoryBaseBranch
}: {
  repositoryRootPath: string
  repositoryBaseBranch: string
}): Promise<Package[]> {
  return getChangedPackagesSinceRef({
    cwd: repositoryRootPath,
    ref: repositoryBaseBranch
  })
}

export async function getChangedPackagesWithoutReleasePlan({
  repositoryRootPath,
  repositoryBaseBranch
}: {
  repositoryRootPath: string
  repositoryBaseBranch: string
}): Promise<Package[]> {
  const changedPackages = await getChangedPackagesSinceRef({
    cwd: repositoryRootPath,
    ref: repositoryBaseBranch
  })
  const packagesWithReleasePlan = await getPackagesWithReleasePlan({
    repositoryRootPath,
    repositoryBaseBranch
  })
  const packagesWithReleasePlanNames = packagesWithReleasePlan.map(
    singlePackage => singlePackage.packageJson.name
  )

  const changedPackagesWithoutReleasePlan = changedPackages.filter(
    singlePackage =>
      !packagesWithReleasePlanNames.includes(singlePackage.packageJson.name)
  )

  return changedPackagesWithoutReleasePlan
}

export async function getChangesetVersionByPackageName({
  repositoryRootPath,
  repositoryBaseBranch
}: {
  repositoryRootPath: string
  repositoryBaseBranch: string
}): Promise<Record<string, string>> {
  const releasePlan = await getReleasePlan(
    repositoryRootPath,
    repositoryBaseBranch
  )

  const releasedVersionByPackageName = releasePlan.releases.reduce(
    (accum, singleRelease) => ({
      ...accum,
      [singleRelease.name]: singleRelease.newVersion
    }),
    {} as Record<string, string>
  )

  return releasedVersionByPackageName
}
