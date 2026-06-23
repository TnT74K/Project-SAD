# Class Diagram Fix

| Scope                       | Description                                           | Pirority   | Reference (0ptional) |
| --------------------------- | ----------------------------------------------------- | ---------- | -------------------- |
| All classes                 | `Fix`: Attribute visibility is not demostrated        | High       | CH5 P26              |
| Organization + Business     | `Fix`:They shoubd be one class with the name 'ORG'    | High       |                      |
| OrganizationAdmin           | `Fix`: name should be 'ORGSupport'                    | Unapproved |                      |
| BusinessManager             | `Fix`: name should be 'ORGAdmin'                      | Unapproved |                      |
| BusinessSearch              | `Fix`: name should be 'ORGSearch'                     | Unapproved |                      |
| Customer + Admin + Employee | `Remove`: Only one class for all users?               | ???        |                      |
| All dashboards              | `Apply`: Move them into separate page                 | Unapproved |                      |
| All classes                 | `Remove`: CRUD operations to make the diagram simpler | Unapproved | CH5 P27              |