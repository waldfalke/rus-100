# SQL Analytics Functions Contract

## Metadata
| Attribute | Value |
|-----------|-------|
| Version | 1.0.0 |
| Status | Planned |
| Last Update | 2025-04-22 |
| Last Editor | AI |

## Change History
| Version | Date | Editor | Description |
|---------|------|--------|-------------|
| 1.0.0 | 2025-04-22 | AI | Initial version of the SQL Analytics Functions Contract |

## Description

This contract defines the standard SQL analytics functions that are available for data analysis and reporting within the CATMEPIM system. It establishes patterns for consistent query construction, performance optimization, and result formatting across the platform, enabling efficient data extraction and insight generation.

## Purpose

This contract:
- Defines core SQL analytics functions that can be reused across the system
- Establishes standards for function naming, parameters, and return types
- Ensures consistent performance characteristics across analytics operations
- Provides a foundation for reporting and dashboard capabilities
- Enables cross-domain data analysis through standardized approaches

## Function Categories

The SQL analytics functions are organized into the following categories:

1. **Inventory Analytics**: Functions for analyzing product stock, availability, and movement
2. **Sales Analytics**: Functions for analyzing sales performance, trends, and patterns
3. **Catalog Analytics**: Functions for analyzing product catalog structure and coverage
4. **User Analytics**: Functions for analyzing user behavior and engagement
5. **Temporal Analytics**: Functions for time-based analysis and forecasting
6. **Text Analytics**: Functions for analyzing textual content and metadata
7. **Relationship Analytics**: Functions for analyzing connections between entities

## Function Definition Format

Each SQL analytics function follows this standard definition pattern:

```sql
/**
 * Function: function_name
 * Category: category_name
 * Description: Detailed description of what the function does
 * 
 * Parameters:
 *   @param_name1 param_type - Description of parameter
 *   @param_name2 param_type - Description of parameter
 * 
 * Returns: Return type with description of returned data
 * 
 * Performance: Expected performance characteristics
 * Caching: Caching recommendations (if applicable)
 * Example: Usage example
 */
CREATE OR REPLACE FUNCTION function_name(param1 type, param2 type)
RETURNS return_type AS $$
BEGIN
    -- Function implementation
END;
$$ LANGUAGE plpgsql;
```

## Core Analytics Functions

### Inventory Analytics

#### Product Availability Analysis

```sql
/**
 * Function: analyze_product_availability
 * Category: Inventory Analytics
 * Description: Analyzes product availability across suppliers
 * 
 * Parameters:
 *   @product_ids integer[] - Array of product IDs to analyze (null for all)
 *   @time_period interval - Time period for historical analysis
 * 
 * Returns: TABLE with product availability statistics
 * 
 * Performance: O(n) where n is the number of products
 * Caching: Results can be cached for up to 4 hours
 * Example: SELECT * FROM analyze_product_availability(ARRAY[1,2,3], interval '30 days');
 */
CREATE OR REPLACE FUNCTION analyze_product_availability(
    product_ids integer[] = NULL,
    time_period interval = interval '90 days'
)
RETURNS TABLE (
    product_id integer,
    product_name text,
    total_suppliers integer,
    always_available_suppliers integer,
    availability_percentage numeric,
    avg_stock_level numeric,
    stock_level_volatility numeric,
    last_out_of_stock timestamp,
    expected_availability_days integer
) AS $$
BEGIN
    RETURN QUERY
    WITH product_list AS (
        SELECT p.id, p.title as product_name
        FROM products p
        WHERE product_ids IS NULL OR p.id = ANY(product_ids)
    ),
    availability_data AS (
        -- Detailed availability calculation logic
        SELECT 
            product_id,
            COUNT(DISTINCT supplier_id) as total_suppliers,
            COUNT(DISTINCT CASE WHEN always_available THEN supplier_id END) as always_available_suppliers,
            -- More aggregations for other metrics
            -- ...
        FROM inventory_history
        WHERE updated_at >= CURRENT_DATE - time_period
        GROUP BY product_id
    )
    SELECT 
        p.id as product_id,
        p.product_name,
        COALESCE(a.total_suppliers, 0) as total_suppliers,
        COALESCE(a.always_available_suppliers, 0) as always_available_suppliers,
        CASE 
            WHEN COALESCE(a.total_suppliers, 0) = 0 THEN 0
            ELSE (a.always_available_suppliers * 100.0 / a.total_suppliers)
        END as availability_percentage,
        -- Additional calculated fields
        -- ...
    FROM product_list p
    LEFT JOIN availability_data a ON p.id = a.product_id;
END;
$$ LANGUAGE plpgsql;
```

#### Stock Movement Analysis

```sql
/**
 * Function: analyze_stock_movement
 * Category: Inventory Analytics
 * Description: Analyzes product stock movement patterns
 * 
 * Parameters:
 *   @product_ids integer[] - Array of product IDs to analyze (null for all)
 *   @time_period interval - Time period for historical analysis
 *   @grouping_interval interval - Interval for grouping results (day, week, month)
 * 
 * Returns: TABLE with stock movement metrics over time
 * 
 * Performance: O(n*t) where n is products and t is time periods
 * Caching: Results can be cached for up to 24 hours for historical data
 * Example: SELECT * FROM analyze_stock_movement(NULL, interval '6 months', interval '1 week');
 */
CREATE OR REPLACE FUNCTION analyze_stock_movement(
    product_ids integer[] = NULL,
    time_period interval = interval '90 days',
    grouping_interval interval = interval '1 day'
)
RETURNS TABLE (
    product_id integer,
    product_name text,
    time_period timestamp,
    beginning_stock integer,
    ending_stock integer,
    inbound_quantity integer,
    outbound_quantity integer,
    adjustments integer,
    turnover_rate numeric,
    days_of_supply numeric
) AS $$
BEGIN
    -- Implementation details
    -- ...
END;
$$ LANGUAGE plpgsql;
```

### Sales Analytics

#### Product Sales Performance

```sql
/**
 * Function: analyze_product_sales
 * Category: Sales Analytics
 * Description: Analyzes sales performance of products
 * 
 * Parameters:
 *   @product_ids integer[] - Array of product IDs to analyze (null for all)
 *   @time_period interval - Time period for analysis
 *   @grouping_interval interval - Interval for grouping results
 *   @include_returns boolean - Whether to include returns in calculations
 * 
 * Returns: TABLE with sales performance metrics
 * 
 * Performance: O(n*t) where n is products and t is time periods
 * Caching: Can be cached up to 8 hours for completed time periods
 * Example: SELECT * FROM analyze_product_sales(NULL, interval '1 year', interval '1 month', true);
 */
CREATE OR REPLACE FUNCTION analyze_product_sales(
    product_ids integer[] = NULL,
    time_period interval = interval '365 days',
    grouping_interval interval = interval '1 month',
    include_returns boolean = true
)
RETURNS TABLE (
    product_id integer,
    product_name text,
    time_bucket timestamp,
    quantity_sold integer,
    revenue numeric,
    average_price numeric,
    return_rate numeric,
    revenue_growth_from_previous numeric,
    quantity_growth_from_previous numeric,
    percent_of_category_sales numeric
) AS $$
BEGIN
    -- Implementation details
    -- ...
END;
$$ LANGUAGE plpgsql;
```

#### Sales Trend Analysis

```sql
/**
 * Function: analyze_sales_trends
 * Category: Sales Analytics
 * Description: Identifies sales trends and seasonality patterns
 * 
 * Parameters:
 *   @category_id integer - Category ID to analyze (null for all)
 *   @time_period interval - Historical time period for analysis
 *   @seasonality_type text - Type of seasonality to analyze (daily, weekly, monthly, yearly)
 * 
 * Returns: TABLE with trend and seasonality metrics
 * 
 * Performance: O(c*t) where c is categories and t is time periods
 * Caching: Results can be cached for up to 24 hours
 * Example: SELECT * FROM analyze_sales_trends(5, interval '2 years', 'monthly');
 */
CREATE OR REPLACE FUNCTION analyze_sales_trends(
    category_id integer = NULL,
    time_period interval = interval '2 years',
    seasonality_type text = 'monthly'
)
RETURNS TABLE (
    category_id integer,
    category_name text,
    time_period timestamp,
    sales_volume numeric,
    trend_value numeric,
    seasonal_index numeric,
    is_peak boolean,
    is_trough boolean,
    year_over_year_change numeric,
    forecast_next_period numeric
) AS $$
BEGIN
    -- Implementation details
    -- ...
END;
$$ LANGUAGE plpgsql;
```

### Catalog Analytics

#### Catalog Coverage Analysis

```sql
/**
 * Function: analyze_catalog_coverage
 * Category: Catalog Analytics
 * Description: Analyzes the coverage and completeness of the product catalog
 * 
 * Parameters:
 *   @category_id integer - Category ID to analyze (null for all)
 *   @min_completeness numeric - Minimum completeness threshold (0-100)
 * 
 * Returns: TABLE with catalog coverage metrics
 * 
 * Performance: O(n) where n is number of products
 * Caching: Results can be cached for up to 12 hours
 * Example: SELECT * FROM analyze_catalog_coverage(NULL, 80);
 */
CREATE OR REPLACE FUNCTION analyze_catalog_coverage(
    category_id integer = NULL,
    min_completeness numeric = 0
)
RETURNS TABLE (
    category_id integer,
    category_name text,
    total_products integer,
    complete_products integer,
    incomplete_products integer,
    coverage_percentage numeric,
    average_completeness_score numeric,
    missing_required_attributes text[],
    most_common_missing_attribute text,
    products_without_images integer
) AS $$
BEGIN
    -- Implementation details
    -- ...
END;
$$ LANGUAGE plpgsql;
```

#### Product Relationship Analysis

```sql
/**
 * Function: analyze_product_relationships
 * Category: Catalog Analytics
 * Description: Analyzes relationships between products (cross-sells, up-sells, etc.)
 * 
 * Parameters:
 *   @product_id integer - Product ID to analyze relationships for
 *   @relationship_types text[] - Types of relationships to include
 *   @min_strength numeric - Minimum relationship strength (0-1)
 * 
 * Returns: TABLE with product relationship metrics
 * 
 * Performance: O(r) where r is number of relationships
 * Caching: Results can be cached for up to 24 hours
 * Example: SELECT * FROM analyze_product_relationships(1001, ARRAY['purchased_together', 'viewed_together'], 0.5);
 */
CREATE OR REPLACE FUNCTION analyze_product_relationships(
    product_id integer,
    relationship_types text[] = ARRAY['purchased_together', 'viewed_together', 'substitutes', 'complements'],
    min_strength numeric = 0.2
)
RETURNS TABLE (
    source_product_id integer,
    source_product_name text,
    related_product_id integer,
    related_product_name text,
    relationship_type text,
    relationship_strength numeric,
    conversion_rate numeric,
    times_offered integer,
    times_accepted integer
) AS $$
BEGIN
    -- Implementation details
    -- ...
END;
$$ LANGUAGE plpgsql;
```

### Text Analytics

#### Content Similarity Analysis

```sql
/**
 * Function: analyze_content_similarity
 * Category: Text Analytics
 * Description: Analyzes similarity between text content of products
 * 
 * Parameters:
 *   @product_id integer - Source product ID
 *   @field_name text - Field to analyze (title, description, etc.)
 *   @min_similarity numeric - Minimum similarity threshold (0-1)
 *   @limit_results integer - Maximum number of results
 * 
 * Returns: TABLE with similarity metrics
 * 
 * Performance: O(n) where n is number of products compared
 * Caching: Results can be cached for up to 7 days if products unchanged
 * Example: SELECT * FROM analyze_content_similarity(1001, 'description', 0.7, 10);
 */
CREATE OR REPLACE FUNCTION analyze_content_similarity(
    product_id integer,
    field_name text,
    min_similarity numeric = 0.6,
    limit_results integer = 100
)
RETURNS TABLE (
    source_product_id integer,
    source_product_name text,
    compared_product_id integer,
    compared_product_name text,
    similarity_score numeric,
    matching_phrases text[],
    likely_duplicate boolean
) AS $$
BEGIN
    -- Implementation leveraging PostgreSQL text search and similarity functions
    -- ...
END;
$$ LANGUAGE plpgsql;
```

## Query Pattern Standards

All analytics functions must adhere to these standards:

1. **Consistent Parameters**:
   - Time periods are specified as PostgreSQL intervals
   - Entity IDs are passed as integer arrays for batch processing
   - Threshold parameters use consistent scales (typically 0-1 or 0-100)

2. **Return Values**:
   - All functions return a TABLE type with well-defined columns
   - Column names follow consistent naming conventions
   - Each column has a clear data type appropriate for its content

3. **NULL Handling**:
   - NULL input parameters have defined default behaviors
   - NULL results in calculations are handled gracefully
   - Functions include COALESCE where appropriate

4. **Error Handling**:
   - Functions validate input parameters
   - Invalid inputs result in empty result sets or clearly indicated errors
   - Performance degradation is prevented for edge cases

## Performance Requirements

1. **Query Optimization**:
   - Functions must use appropriate indexes
   - Complex calculations should leverage materialized views where possible
   - Functions should include execution plans for common use cases

2. **Scaling Characteristics**:
   - Each function must document its computational complexity
   - Functions must define resource usage expectations
   - Performance must scale linearly with data volume when possible

3. **Caching Strategy**:
   - Each function must specify if/how its results can be cached
   - Time-sensitive functions must indicate staleness thresholds
   - Partial result caching must be supported for large datasets

## Security Considerations

1. **Data Access Control**:
   - Functions must respect row-level security policies
   - Sensitive metrics must be filtered based on user permissions
   - Aggregate results must maintain privacy guarantees

2. **Resource Protection**:
   - Functions must include computational safeguards
   - Resource-intensive operations must support cancellation
   - Functions must specify maximum resource consumption

## Implementation Requirements

Systems implementing this contract must:

1. Create all defined analytics functions
2. Ensure query performance meets defined expectations
3. Implement specified caching mechanisms
4. Add appropriate indexes to support efficient queries
5. Document any system-specific optimizations
6. Provide monitoring for function performance
7. Support version management of functions

## Related Contracts

- [Database Schema Contract](./database_schema_contract.md) - Defines underlying data structures
- [Data Lineage Contract](../data/data_lineage_contract.md) - Defines data tracking systems
- [Reporting Contract](../reporting/reporting_contract.md) - Defines report generation process
- [Data Archetypes Contract](../data/data_archetypes_contract.md) - Defines core data patterns

## Invariants

1. Functions must maintain data integrity (no side effects)
2. Results must be consistent for the same inputs within caching window
3. Performance characteristics must be preserved across data volumes
4. Results must be reproducible given the same data state
5. Query patterns must be compatible with database engine optimizations

## Testing and Compliance

Systems implementing this contract must verify:

1. Function results match expected outputs for test cases
2. Performance meets specified targets across data volumes
3. Resource usage stays within defined boundaries
4. Results maintain consistency with changing data
5. Security controls properly restrict access to sensitive metrics

## Extensions

### Custom Analytical Models

The system supports implementation of custom analytical models:

```sql
/**
 * Function: register_custom_analytical_model
 * Category: System
 * Description: Registers a custom analytical model for use in analytics functions
 * 
 * Parameters:
 *   @model_name text - Unique name for the model
 *   @model_definition jsonb - Definition of the model including parameters
 *   @model_implementation text - SQL implementation of the model
 * 
 * Returns: boolean indicating success
 */
CREATE OR REPLACE FUNCTION register_custom_analytical_model(
    model_name text,
    model_definition jsonb,
    model_implementation text
)
RETURNS boolean AS $$
BEGIN
    -- Implementation details
    -- ...
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

### Analytics Function Extensions

The system provides a mechanism for extending existing analytics functions:

```sql
/**
 * Function: extend_analytics_function
 * Category: System
 * Description: Extends an existing analytics function with additional capabilities
 * 
 * Parameters:
 *   @base_function_name text - Name of function to extend
 *   @extension_name text - Name of the extension
 *   @additional_parameters jsonb - Additional parameters for extended function
 *   @additional_return_columns jsonb - Additional return columns
 *   @extension_implementation text - SQL implementation of the extension
 * 
 * Returns: boolean indicating success
 */
CREATE OR REPLACE FUNCTION extend_analytics_function(
    base_function_name text,
    extension_name text,
    additional_parameters jsonb,
    additional_return_columns jsonb,
    extension_implementation text
)
RETURNS boolean AS $$
BEGIN
    -- Implementation details
    -- ...
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
``` 