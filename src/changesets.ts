import getReleasePlan from '@changesets/get-release-plan'
import { getChangedPackagesSinceRef } from '@changesets/git'
import { getPackages, type Package } from '@manypkg/get-packages'

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

  const packagesByName: Record<string, Package> = {}
  for (const singlePackage of allPackages.packages) {
    packagesByName[singlePackage.packageJson.name] = singlePackage
  }

  const changedPackages = releasePlan.releases.map(
    (release) => packagesByName[release.name]
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
    (singlePackage) => singlePackage.packageJson.name
  )

  const changedPackagesWithoutReleasePlan = changedPackages.filter(
    (singlePackage) =>
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

  const releasedVersionByPackageName: Record<string, string> = {}
  for (const singleRelease of releasePlan.releases) {
    releasedVersionByPackageName[singleRelease.name] = singleRelease.newVersion
  }

  return releasedVersionByPackageName
}
