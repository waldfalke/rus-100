# Series and BookSeries Contract

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
| 1.0.0 | 2025-04-21 | AI | Initial version of the Series and BookSeries Contract |

## Description

This contract defines the structure, relationships, and behaviors of book series and their associations with individual books within the CATMEPIM system. It establishes standard patterns for representing series hierarchies, book ordering, and series metadata management.

## Purpose

This contract:
- Establishes consistent representation of series information
- Defines the relationship between books and series
- Supports complex series hierarchies (main series, subseries)
- Enables accurate ordering of books within series
- Standardizes series metadata management
- Facilitates search and discovery of series-related content

## Series Entity Definition

### Core Attributes

```json
{
  "series_id": "unique identifier for the series",
  "title": "primary title of the series",
  "alternate_titles": [
    {
      "title": "alternate title text",
      "language_code": "ISO language code",
      "region_code": "optional region specification",
      "usage_context": "publishing context where this title is used"
    }
  ],
  "description": "descriptive text about the series",
  "series_type": "classification (fiction, non-fiction, periodical, etc.)",
  "planned_volumes": "expected total number of volumes (nullable)",
  "current_volumes": "current number of published volumes",
  "status": "ongoing, completed, cancelled, or hiatus",
  "publication_schedule": {
    "frequency": "regularity of publication",
    "next_expected_date": "anticipated date of next volume"
  },
  "start_year": "year the series began",
  "end_year": "year the series ended (nullable)",
  "topics": ["subject matter categories"],
  "genres": ["genre classifications"],
  "target_audience": ["intended audience categories"],
  "publishers": [
    {
      "publisher_id": "reference to publisher entity",
      "imprint": "specific imprint name",
      "start_date": "when publisher began publishing the series",
      "end_date": "when publisher stopped (nullable)",
      "regions": ["geographic regions where publisher handles the series"]
    }
  ],
  "creators": [
    {
      "creator_id": "reference to creator entity",
      "role": "creator's role in the series",
      "volumes": ["specific volumes contributor worked on, if not all"],
      "is_primary": "boolean indicating if this is a primary creator"
    }
  ],
  "parent_series_id": "reference to parent series, if applicable",
  "metadata": {
    "created_date": "record creation timestamp",
    "modified_date": "last modification timestamp",
    "source": "origin of the series data",
    "completeness_score": "measure of metadata completeness"
  }
}
```

## BookSeries Relationship Definition

The BookSeries entity defines the relationship between a book and a series:

```json
{
  "book_series_id": "unique identifier for this relationship",
  "book_id": "reference to book entity",
  "series_id": "reference to series entity",
  "volume_number": "position in numbered series (nullable)",
  "chronology_position": "position in internal chronology (nullable)",
  "reading_order": "recommended reading position (nullable)",
  "title_in_series": "book title as presented in series context",
  "is_omnibus": "boolean - whether this book contains multiple series volumes",
  "contained_volumes": ["volume numbers contained if omnibus"],
  "relationship_type": "primary, spinoff, companion, etc.",
  "standalone": "boolean - whether book can be read independently",
  "metadata": {
    "created_date": "record creation timestamp",
    "modified_date": "last modification timestamp",
    "source": "origin of the relationship data" 
  }
}
```

## Series Hierarchies

Series can exist in hierarchical relationships:

1. **Parent-Child Series**: A main series can contain multiple subseries
2. **Series Continuations**: One series can be a continuation of another
3. **Universe Groupings**: Multiple series can belong to a shared universe

The hierarchy is defined through:
- Parent-child relationships between Series entities
- Series group associations that combine related series
- Universe designations for shared fictional worlds

## Book Ordering in Series

A book's position in a series can be expressed in multiple ways:

1. **Volume Number**: Sequential position in publication order (e.g., "Book 3")
2. **Chronological Order**: Position in internal story timeline
3. **Reading Order**: Recommended order for optimal reading experience

When these orders differ, all relevant ordering schemes must be recorded to support different browsing and sorting options.

## Series Interface

```java
public interface SeriesService {
    /**
     * Retrieve series details by ID
     */
    Series getSeriesById(String seriesId);
    
    /**
     * Find series by title search
     */
    List<Series> findSeriesByTitle(String titlePattern);
    
    /**
     * Get all books in a series
     */
    List<BookSeries> getBooksInSeries(String seriesId);
    
    /**
     * Get books in a series sorted by specified order
     */
    List<BookSeries> getBooksInSeriesByOrder(String seriesId, OrderType orderType);
    
    /**
     * Get all series a book belongs to
     */
    List<BookSeries> getSeriesForBook(String bookId);
    
    /**
     * Get all subseries of a parent series
     */
    List<Series> getSubseries(String parentSeriesId);
    
    /**
     * Add a book to a series
     */
    BookSeries addBookToSeries(String bookId, String seriesId, BookSeriesDetails details);
    
    /**
     * Update book's position or details within a series
     */
    BookSeries updateBookSeriesRelationship(String bookSeriesId, BookSeriesDetails details);
    
    /**
     * Remove a book from a series
     */
    boolean removeBookFromSeries(String bookSeriesId);
    
    /**
     * Create a new series
     */
    Series createSeries(SeriesDetails details);
    
    /**
     * Update series information
     */
    Series updateSeries(String seriesId, SeriesDetails details);
    
    /**
     * Merge two series (when determined to be the same series)
     */
    Series mergeSeries(String primarySeriesId, String secondarySeriesId, MergeStrategy strategy);
}
```

## Series Validation Rules

1. **Series Title**: Cannot be empty and must be unique within a publisher
2. **Volume Numbers**: Must be unique within a series
3. **Series Hierarchy**: Cannot contain circular references
4. **Publication Years**: Start year must precede end year if both provided
5. **Planned Volumes**: Must be equal to or greater than current volumes

## BookSeries Validation Rules

1. **Uniqueness**: A book-series relationship must be unique for each book-series pair
2. **Volume Number**: Must be unique within a series unless specified as an alternate edition
3. **Relationship Type**: Must be one of the defined relationship types
4. **Omnibus Validation**: If marked as omnibus, must specify contained volumes

## Series Visibility and Access Control

Series information may have different visibility requirements based on:

1. **Publication Status**: Unpublished series may be restricted
2. **Regional Availability**: Series available only in certain regions
3. **Contract Limitations**: Series with special publishing arrangements

The system must support:
1. **Region-based Access**: Controlling series visibility by region
2. **Embargoed Content**: Managing series announcement dates
3. **Permission-based Editing**: Restricting who can modify series data

## Series Data Operations

### Series Merging

When two series entries are determined to be duplicates, the system must:
1. Designate a primary record to retain
2. Transfer all book relationships to the primary record
3. Preserve alternate titles and identifiers
4. Maintain a record of the merge for audit purposes

### Series Splitting

When a series needs to be divided:
1. Create new series records as needed
2. Reassign books to appropriate series
3. Establish parent-child relationships if applicable
4. Update all affected metadata

## Implementation Requirements

Systems implementing this contract must:

1. Support all defined attributes and relationships
2. Implement the specified interface
3. Enforce validation rules
4. Handle hierarchical series relationships
5. Support multiple ordering schemes
6. Maintain data integrity during merges and splits

## Related Contracts

- [Book Contract](./book_contract.md) - Defines the book entity
- [Creator Contract](./creator_contract.md) - Defines author and other creator entities
- [Publisher Contract](./publisher_contract.md) - Defines publisher entities
- [Data Archetypes Contract](./data_archetypes_contract.md) - Defines core data patterns

## Invariants

1. Every BookSeries relationship must reference valid Book and Series entities
2. Series hierarchies cannot contain cycles
3. A book can belong to multiple series but with only one primary relationship per series
4. Series metadata must maintain consistency with related books' metadata

## Testing and Compliance

Systems implementing this contract must verify:

1. Series relationships maintain referential integrity
2. Hierarchical relationships are properly maintained
3. Ordering schemes are consistently applied
4. Merging and splitting operations preserve data integrity
5. Access controls correctly limit visibility

## Series Evolution

The contract supports series evolution through:

1. **Status Updates**: Tracking changes in series publication status
2. **Volume Additions**: Recording new books added to series
3. **Publisher Transitions**: Managing changes in publishing rights
4. **Series Rebranding**: Handling title changes while maintaining continuity 