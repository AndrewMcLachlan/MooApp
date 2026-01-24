# Commit Changes

Create an atomic commit with conventional commit format.

## Instructions

1. Run `git status` to see changes
2. Confirm the branch. Stop and do not commit if the local branch is `main` or is tracking the remote `main` branch
3. Run `git diff --stat` for summary
4. Determine the appropriate commit type:
   - `feature`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation only
   - `style`: Formatting, no code change
   - `refactor`: Code change that neither fixes nor adds
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks

5. Create commit message: `<type>(<scope>): <description>`

## Scopes

Common scopes for this project:
- `component` - Discrete component changes
- `icon` - Changes ot icons
- `app` - Changes to moo-app
- `infra` - Changes to infrastructure, DevOps, code layout etc.

## Rules

- Keep description under 72 characters
- Use imperative mood ("add" not "added")
- Use proper capitalisation and grammar
- Reference issue numbers if applicable: `fix(api): resolve null reference (#123)`
- For breaking changes, add `!` after scope: `feat(api)!: change auth flow`

## Examples

```
component(moo-ds/components/CloseBadge.tsx): Add support for custom close icon
icon(moo-icons/assets/BagOfMoney.svg): Add a bag of money icon
fix(moo-ds/component/Breadcrumb.tsx): Fix wrapping issue on small screens
refactor(moo-app): migrate account list to SectionTable component
chore: Update npm dependencies
docs: Add more stories
```

## Commit Message Format

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <description>

<optional body with more details>
EOF
)"
```
