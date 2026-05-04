# Healing Workflow

The default git policy for this runner repo is:

1. Jenkins or the orchestrator identifies a repair candidate.
2. The Recovery Agent proposes a patch.
3. A human reviewer approves the patch.
4. The repair is applied on a feature branch:

```bash
./scripts/create-healing-branch.sh AEGIS-2026-MAY-1234 submit-selector
```

5. The branch is pushed and reviewed before merge.

## Branch naming

```text
healing/<forensic-id>/<repair-slug>
```

Example:

```text
healing/AEGIS-2026-MAY-855D/submit-selector
```
