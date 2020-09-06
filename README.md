# Changed Packages

> Get information about packages with changes and packages included in your release plan.

## About

This action works with the [changesets][changesetsurl] versioning tool to allow you to conditionally run other actions based on whether a package has changed or it's included in a release plan.

## Usage

```yml
name: Run tests if package changed
on: [push, pull_request]
jobs:
  get-changed-packages:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Get changed packages
        uses: caffco/changed-packages-github-action@v1.0.0
        with:
          base_branch: main
          repository_path: .

  run-tests:
    runs-on: ubuntu-latest
    steps:
        - name: Run package-a tests
        needs: get-changed-packages
        if: ${{contains(needs.get-changed-packages.outputs.changed_packages, 'package-a')}}
        run: yarn test-package-a

        - name: Run package-b tests
        needs: get-changed-packages
        if: ${{contains(needs.get-changed-packages.outputs.changed_packages, 'package-b')}}
        run: yarn test-package-b
```

[changesetsurl]: https://github.com/atlassian/changesets
