# Data Archetypes Contract

## Metadata
| Attribute | Value |
|-----------|-------|
| Version | 1.0.0 |
| Status | Planned |
| Last Update | 2025-04-21 |
| Last Editor | AI |

## Change History
| Version | Date | Editor | Description |
|---------|------|--------|-------------|
| 1.0.0 | 2025-04-21 | AI | Initial version of the Data Archetypes Contract |

## Description

The Data Archetypes Contract defines standardized data patterns and structural templates that categorize and provide consistency across the CATMEPIM system. Data archetypes establish common patterns for data organization, validation, transformation, and presentation throughout the system, ensuring consistent handling of similar data across different contexts.

## Purpose

This contract:
- Defines core data archetypes used throughout the system
- Establishes a consistent approach to handling common data types
- Reduces redundancy by standardizing validation and transformation rules
- Supports the data lineage system by providing clear categorization of data
- Enables intelligent handling of data based on its archetype classification

## Data Archetype Definition

A data archetype in CATMEPIM consists of:

1. **Identifier**: A unique name for the archetype
2. **Description**: Purpose and characteristics of the archetype
3. **Structure Pattern**: The expected data structure
4. **Validation Rules**: Criteria for determining valid data
5. **Transformation Rules**: Standard transformations applicable to this archetype
6. **Presentation Guidelines**: How data of this type should be displayed
7. **Metadata Requirements**: Additional information required for this data type
8. **Related Archetypes**: Other archetypes that commonly interact with this one

## Core Archetypes

### Identifier Archetype

```json
{
  "identifier": "Identifier",
  "description": "A unique reference value that distinguishes an entity",
  "structure": {
    "type": "string or numeric",
    "pattern": "[A-Za-z0-9_-]+"
  },
  "validation": [
    "Must be unique within its domain",
    "Cannot contain special characters except underscore and hyphen",
    "Length constraints based on specific implementation"
  ],
  "transformation": [
    "Upper/lowercase normalization",
    "Whitespace removal",
    "Leading zero handling"
  ],
  "presentation": "Display in monospace font for readability",
  "metadata": {
    "domain": "The context in which uniqueness is guaranteed",
    "generation_method": "How IDs are created (sequential, UUID, etc.)"
  },
  "related_archetypes": ["ReferenceCode", "ExternalIdentifier"]
}
```

### Name Archetype

```json
{
  "identifier": "Name",
  "description": "A human-readable label for an entity",
  "structure": {
    "type": "string",
    "components": ["optional prefix", "main body", "optional suffix"]
  },
  "validation": [
    "Cannot be empty",
    "Length limits (minimum 1 character, maximum 255 characters)",
    "Valid character set constraints"
  ],
  "transformation": [
    "Trim whitespace",
    "Case normalization (as appropriate)",
    "Special character handling"
  ],
  "presentation": "Title case or as specified by locale settings",
  "metadata": {
    "language": "ISO language code",
    "is_translatable": "Boolean indicating if translation is required"
  },
  "related_archetypes": ["Title", "Label", "Description"]
}
```

### Description Archetype

```json
{
  "identifier": "Description",
  "description": "Detailed textual information about an entity",
  "structure": {
    "type": "string",
    "format": "plain text, markdown, or HTML"
  },
  "validation": [
    "Length constraints (minimum 1 character, maximum 10000 characters)",
    "Valid formatting syntax if markdown or HTML"
  ],
  "transformation": [
    "Sanitize HTML if applicable",
    "Format normalization"
  ],
  "presentation": "Formatted according to content type with appropriate line breaks",
  "metadata": {
    "format": "Format specification (plain/markdown/HTML)",
    "language": "ISO language code"
  },
  "related_archetypes": ["Name", "SummaryText", "RichContent"]
}
```

### Price Archetype

```json
{
  "identifier": "Price",
  "description": "Monetary value associated with a product or service",
  "structure": {
    "type": "composite",
    "components": {
      "amount": "decimal number",
      "currency": "ISO currency code",
      "type": "enum (list, retail, wholesale, etc.)"
    }
  },
  "validation": [
    "Amount must be a valid decimal number",
    "Currency must be a valid ISO currency code",
    "Type must be from defined enumeration"
  ],
  "transformation": [
    "Currency conversion",
    "Rounding rules",
    "Tax inclusion/exclusion"
  ],
  "presentation": "Formatted according to currency locale with appropriate symbols",
  "metadata": {
    "effective_date": "When this price becomes active",
    "expiration_date": "When this price expires",
    "tax_included": "Boolean indicating if taxes are included"
  },
  "related_archetypes": ["Discount", "TaxRate", "PriceRange"]
}
```

### Category Archetype

```json
{
  "identifier": "Category",
  "description": "Classification label for organizational grouping",
  "structure": {
    "type": "hierarchical",
    "components": {
      "code": "identifier string",
      "name": "display name",
      "parent": "reference to parent category (optional)"
    }
  },
  "validation": [
    "Code must be unique within hierarchy",
    "No circular references in parent relationships"
  ],
  "transformation": [
    "Path construction (breadcrumbs)",
    "Level determination"
  ],
  "presentation": "Display with hierarchical indentation or breadcrumb path",
  "metadata": {
    "depth": "Level in hierarchy",
    "path": "Full hierarchical path",
    "is_leaf": "Boolean indicating if category has children"
  },
  "related_archetypes": ["Tag", "Classification", "Taxonomy"]
}
```

### Attribute Archetype

```json
{
  "identifier": "Attribute",
  "description": "A characteristic or property that describes an entity",
  "structure": {
    "type": "composite",
    "components": {
      "name": "identifier string",
      "value": "any supported data type",
      "unit": "unit of measurement (optional)"
    }
  },
  "validation": [
    "Name must follow attribute naming conventions",
    "Value must conform to expected data type",
    "Unit must be valid for the attribute if applicable"
  ],
  "transformation": [
    "Unit conversion",
    "Value normalization"
  ],
  "presentation": "Display as name-value pair with optional unit",
  "metadata": {
    "data_type": "Type of the value",
    "is_localized": "Boolean indicating if attribute can vary by locale",
    "is_required": "Boolean indicating if attribute must have a value"
  },
  "related_archetypes": ["Property", "Feature", "Specification"]
}
```

### Media Reference Archetype

```json
{
  "identifier": "MediaReference",
  "description": "A reference to digital media (image, video, document, etc.)",
  "structure": {
    "type": "composite",
    "components": {
      "url": "resource location",
      "type": "media type (image, video, etc.)",
      "format": "file format or MIME type"
    }
  },
  "validation": [
    "URL must be properly formatted",
    "Type must be from supported media types",
    "Format must be compatible with type"
  ],
  "transformation": [
    "URL normalization",
    "CDN URL construction"
  ],
  "presentation": "Display appropriate to media type (thumbnails for images, etc.)",
  "metadata": {
    "dimensions": "For visual media",
    "size": "File size",
    "duration": "For time-based media",
    "is_primary": "Boolean indicating if this is the main media for an entity"
  },
  "related_archetypes": ["Image", "Document", "Video", "Audio"]
}
```

## Implementation Requirements

Systems within CATMEPIM must:

1. Use these defined archetypes as the basis for data models
2. Apply the validation rules defined for each archetype
3. Implement transformation logic in accordance with archetype definitions
4. Follow presentation guidelines when displaying data
5. Capture required metadata for each archetype
6. Establish relationships between related archetypes

## Extending Archetypes

New archetypes can be defined as needed by following these steps:

1. Propose the new archetype with complete definition
2. Review for overlap with existing archetypes
3. Validate against use cases
4. Document the new archetype
5. Add to the archetype registry

## Archetype Registry

The system maintains a central registry of all defined archetypes that can be queried at runtime. This registry includes:

- Complete definitions of each archetype
- Relationships between archetypes
- Implementation guidelines
- Examples of proper usage

## Relationship to Data Lineage

Archetypes integrate with the Data Lineage system by:

1. Providing classification for data elements in the lineage graph
2. Ensuring consistent handling of data as it moves through the system
3. Supporting validation at lineage transition points
4. Enabling automatic transformation based on archetype rules

## Related Contracts

- [Data Lineage Contract](./data_lineage_contract.md) - Defines how data movement is tracked
- [ETL Process Contract](../ETL-Process-Contract.md) - Specifies data transformation processes that use archetypes
- [Database Schema Contract](../database/database_schema_contract.md) - Defines how archetypes map to database structures

## Invariants

1. An entity can have multiple archetypes applied if they don't conflict
2. Archetype definitions cannot be changed once in use without a migration plan
3. Validation rules must be internally consistent and achievable
4. All archetypes must support serialization to standard formats (JSON, XML)

## Testing and Compliance

Systems implementing this contract must verify:

1. Data conforms to archetype validation rules
2. Transformations produce expected results
3. Metadata requirements are fulfilled
4. Presentation guidelines are followed
5. Relationships between archetypes are maintained

## Archetype Evolution

As the system evolves, archetypes may need to change. The process for managing archetype evolution is:

1. Create a new version of the archetype
2. Define migration rules from old to new version
3. Update dependent systems to recognize both versions during transition
4. Establish timeline for deprecation of old version 