# Database Views Definition Contract

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
| 1.0.0 | 2025-04-22 | AI | Initial version of the Database Views Definition Contract |

## Description

This contract defines the standards, structure, and governance for database views within the CATMEPIM system. Database views provide abstracted, consistent access points to the underlying data model, enabling simplified queries, enforcing access control, and presenting data in business-ready formats.

## Purpose

This contract:
- Establishes naming conventions and structural standards for views
- Defines view categories and their intended usage patterns
- Specifies performance and security requirements for views
- Outlines governance processes for view creation and modification
- Supports consistent data access across application components

## View Categories

Views in the CATMEPIM system are categorized according to their purpose:

1. **Business Domain Views**: Present data organized by business domain
2. **Reporting Views**: Optimized for analytics and reporting
3. **Integration Views**: Facilitate data exchange with external systems
4. **Operational Views**: Support day-to-day system operations
5. **Administrative Views**: Aid in system administration and monitoring
6. **Archival Views**: Provide access to historical data

## Naming Conventions

View names must follow these patterns:

1. **Standard Views**: `v_{domain}_{entity}[_{variant}]`
   - Example: `v_catalog_products_active`

2. **Materialized Views**: `mv_{domain}_{entity}[_{variant}]`
   - Example: `mv_sales_monthly_summary`
   
3. **Reporting Views**: `vr_{report_area}_{report_subject}[_{variant}]`
   - Example: `vr_inventory_stock_levels_by_supplier`
   
4. **Integration Views**: `vi_{system}_{entity}[_{direction}]`
   - Example: `vi_erp_products_outbound`
   
5. **Administrative Views**: `va_{admin_area}_{subject}`
   - Example: `va_security_user_permissions`

## View Structure Standards

### Standard View Template

Each view should follow this basic structure:

```sql
/**
 * View: v_[domain]_[entity]
 * Category: [view category]
 * Description: [detailed description of the view's purpose and content]
 *
 * Columns:
 * - [column_name]: [data type] - [description]
 * - ...
 *
 * Usage Contexts:
 * - [context where this view should be used]
 * - ...
 *
 * Performance Characteristics:
 * - [expected performance behavior]
 * - [any known limitations]
 *
 * Dependencies:
 * - [tables/views this view depends on]
 * - ...
 *
 * Refresh Requirements (for materialized views):
 * - [refresh frequency]
 * - [refresh method]
 *
 * Security:
 * - [security constraints]
 * - [access requirements]
 *
 * Change History:
 * - [date] - [editor] - [description of change]
 */
CREATE OR REPLACE VIEW v_[domain]_[entity] AS
SELECT
    -- Fields structured for clarity
    -- Related fields grouped together
    -- Calculated fields clearly noted with comments
FROM
    -- Main table first
    -- Joins ordered by relationship (1:1 joins before 1:many)
WHERE
    -- Fundamental filters that define the view's scope
;
```

### Materialized View Template

Materialized views have additional requirements:

```sql
/**
 * Materialized View: mv_[domain]_[entity]
 * [standard documentation as above]
 *
 * Materialization Schedule:
 * - Refresh Frequency: [how often the view should be refreshed]
 * - Refresh Method: [COMPLETE or INCREMENTAL]
 * - Refresh Timing: [when refreshes should occur]
 * - Dependencies: [views that must be refreshed before this one]
 *
 * Indexing Strategy:
 * - [indexes to be created]
 * - [indexing rationale]
 */
CREATE MATERIALIZED VIEW mv_[domain]_[entity]
WITH (
    [materialized view parameters]
)
AS
SELECT
    -- View definition as above
;

-- Indexes explicitly defined after view creation
CREATE INDEX idx_mv_[domain]_[entity]_[column] ON mv_[domain]_[entity] ([column]);
```

## Core Business Domain Views

### Product Catalog Views

#### v_catalog_products_full

```sql
/**
 * View: v_catalog_products_full
 * Category: Business Domain
 * Description: Complete view of products with all associated attributes and categories
 */
CREATE OR REPLACE VIEW v_catalog_products_full AS
SELECT
    p.id AS product_id,
    p.title AS product_title,
    p.isbn,
    p.sku,
    p.description,
    p.short_description,
    p.status,
    p.created_at AS product_created_at,
    p.updated_at AS product_updated_at,
    
    -- Publisher information
    pub.id AS publisher_id,
    pub.name AS publisher_name,
    
    -- Author information (concatenated for simplicity)
    string_agg(DISTINCT a.name, ', ' ORDER BY a.name) AS authors,
    
    -- Category information
    c.id AS primary_category_id,
    c.name AS primary_category_name,
    
    -- Pricing information
    p.list_price,
    p.sale_price,
    p.currency,
    
    -- Series information
    s.id AS series_id,
    s.name AS series_name,
    ps.sequence_number AS series_sequence,
    
    -- Aggregated attributes
    jsonb_object_agg(pa.attribute_name, pa.attribute_value) FILTER (WHERE pa.attribute_name IS NOT NULL) AS attributes,
    
    -- Stock information
    SUM(stock.quantity) AS total_stock,
    
    -- Media
    string_agg(DISTINCT pm.url, ', ' ORDER BY pm.is_primary DESC) FILTER (WHERE pm.media_type = 'image') AS image_urls,
    
    -- Metadata
    p.search_data,
    p.flags,
    p.view_count,
    p.last_stock_update
FROM
    products p
LEFT JOIN publishers pub ON p.publisher_id = pub.id
LEFT JOIN product_authors pa_join ON p.id = pa_join.product_id
LEFT JOIN authors a ON pa_join.author_id = a.id
LEFT JOIN categories c ON p.primary_category_id = c.id
LEFT JOIN product_series ps ON p.id = ps.product_id
LEFT JOIN series s ON ps.series_id = s.id
LEFT JOIN product_attributes pa ON p.id = pa.product_id
LEFT JOIN stock ON p.id = stock.product_id
LEFT JOIN product_media pm ON p.id = pm.product_id
GROUP BY
    p.id, pub.id, c.id, s.id, ps.sequence_number;
```

#### v_catalog_products_simple

```sql
/**
 * View: v_catalog_products_simple
 * Category: Business Domain
 * Description: Simplified view of products for basic listing and browsing scenarios
 */
CREATE OR REPLACE VIEW v_catalog_products_simple AS
SELECT
    p.id AS product_id,
    p.title AS product_title,
    p.isbn,
    p.sku,
    p.short_description,
    p.status,
    pub.name AS publisher_name,
    string_agg(DISTINCT a.name, ', ' ORDER BY a.name) AS authors,
    c.name AS primary_category_name,
    p.list_price,
    p.sale_price,
    p.currency,
    (SELECT url FROM product_media WHERE product_id = p.id AND is_primary = true AND media_type = 'image' LIMIT 1) AS primary_image_url
FROM
    products p
LEFT JOIN publishers pub ON p.publisher_id = pub.id
LEFT JOIN product_authors pa_join ON p.id = pa_join.product_id
LEFT JOIN authors a ON pa_join.author_id = a.id
LEFT JOIN categories c ON p.primary_category_id = c.id
WHERE
    p.status = 'active'
GROUP BY
    p.id, pub.id, c.name;
```

### Series Views

#### v_catalog_series_with_books

```sql
/**
 * View: v_catalog_series_with_books
 * Category: Business Domain
 * Description: Series information with associated books and ordering
 */
CREATE OR REPLACE VIEW v_catalog_series_with_books AS
SELECT
    s.id AS series_id,
    s.name AS series_name,
    s.description AS series_description,
    pub.id AS publisher_id,
    pub.name AS publisher_name,
    s.editor AS series_editor,
    s.start_year,
    s.end_year,
    s.status AS series_status,
    p.id AS product_id,
    p.title AS product_title,
    p.isbn,
    ps.sequence_number,
    ps.volume_title,
    string_agg(DISTINCT a.name, ', ' ORDER BY a.name) AS authors,
    COUNT(*) OVER (PARTITION BY s.id) AS total_books_in_series
FROM
    series s
LEFT JOIN product_series ps ON s.id = ps.series_id
LEFT JOIN products p ON ps.product_id = p.id
LEFT JOIN publishers pub ON s.publisher_id = pub.id
LEFT JOIN product_authors pa ON p.id = pa.product_id
LEFT JOIN authors a ON pa.author_id = a.id
GROUP BY
    s.id, pub.id, p.id, ps.sequence_number, ps.volume_title
ORDER BY
    s.name, ps.sequence_number;
```

## Reporting Views

### mv_sales_daily_summary

```sql
/**
 * Materialized View: mv_sales_daily_summary
 * Category: Reporting
 * Description: Daily summary of sales by product and category
 *
 * Materialization Schedule:
 * - Refresh Frequency: Daily
 * - Refresh Method: COMPLETE
 * - Refresh Timing: After daily sales processing (approximately 03:00 AM)
 */
CREATE MATERIALIZED VIEW mv_sales_daily_summary AS
SELECT
    date_trunc('day', o.created_at) AS sale_date,
    p.id AS product_id,
    p.title AS product_title,
    c.id AS category_id,
    c.name AS category_name,
    SUM(oi.quantity) AS units_sold,
    SUM(oi.price * oi.quantity) AS total_revenue,
    COUNT(DISTINCT o.id) AS order_count,
    COUNT(DISTINCT o.customer_id) AS customer_count
FROM
    orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
LEFT JOIN categories c ON p.primary_category_id = c.id
WHERE
    o.status IN ('completed', 'shipped', 'delivered')
GROUP BY
    date_trunc('day', o.created_at), p.id, p.title, c.id, c.name;

-- Indexes for common query patterns
CREATE INDEX idx_mv_sales_daily_summary_date ON mv_sales_daily_summary (sale_date);
CREATE INDEX idx_mv_sales_daily_summary_product ON mv_sales_daily_summary (product_id);
CREATE INDEX idx_mv_sales_daily_summary_category ON mv_sales_daily_summary (category_id);
```

### v_reporting_stock_alerts

```sql
/**
 * View: v_reporting_stock_alerts
 * Category: Reporting
 * Description: Real-time view of products with low stock or stock issues
 */
CREATE OR REPLACE VIEW v_reporting_stock_alerts AS
SELECT
    p.id AS product_id,
    p.title AS product_title,
    p.isbn,
    p.status AS product_status,
    SUM(s.quantity) AS total_stock,
    COUNT(DISTINCT s.supplier_id) AS supplier_count,
    MIN(s.updated_at) AS oldest_stock_update,
    MAX(CASE WHEN s.quantity <= s.reorder_threshold THEN 1 ELSE 0 END) AS needs_reorder,
    SUM(CASE WHEN s.quantity = 0 THEN 1 ELSE 0 END) AS out_of_stock_suppliers,
    AVG(s.reorder_threshold) AS avg_reorder_threshold,
    
    -- Daily sales rate (from materialized view)
    COALESCE(ds.avg_daily_units, 0) AS avg_daily_sales,
    
    -- Days of inventory
    CASE 
        WHEN COALESCE(ds.avg_daily_units, 0) > 0 
        THEN ROUND(SUM(s.quantity) / ds.avg_daily_units)
        ELSE NULL
    END AS estimated_days_of_inventory
FROM
    products p
JOIN stock s ON p.id = s.product_id
LEFT JOIN (
    SELECT 
        product_id, 
        AVG(units_sold) AS avg_daily_units
    FROM 
        mv_sales_daily_summary
    WHERE 
        sale_date >= CURRENT_DATE - interval '30 days'
    GROUP BY 
        product_id
) ds ON p.id = ds.product_id
WHERE
    p.status = 'active'
GROUP BY
    p.id, p.title, p.isbn, p.status, ds.avg_daily_units
HAVING
    SUM(s.quantity) <= MAX(s.reorder_threshold) * 1.5 OR
    SUM(s.quantity) = 0;
```

## Integration Views

### vi_erp_products_outbound

```sql
/**
 * View: vi_erp_products_outbound
 * Category: Integration
 * Description: Product data formatted for integration with ERP systems
 *
 * Security:
 * - Requires 'integration_erp' role for access
 */
CREATE OR REPLACE VIEW vi_erp_products_outbound AS
SELECT
    p.id AS product_id,
    p.sku AS product_code,
    p.title AS product_name,
    p.isbn AS isbn_code,
    pub.name AS supplier_name,
    c.name AS product_category,
    p.list_price AS retail_price,
    COALESCE(p.cost_price, p.list_price * 0.6) AS cost_price,
    p.currency AS price_currency,
    p.status AS product_status,
    SUM(s.quantity) AS available_quantity,
    p.created_at AS creation_date,
    p.updated_at AS last_update
FROM
    products p
LEFT JOIN publishers pub ON p.publisher_id = pub.id
LEFT JOIN categories c ON p.primary_category_id = c.id
LEFT JOIN stock s ON p.id = s.product_id
GROUP BY
    p.id, pub.name, c.name;
```

## Operational Views

### v_operations_pending_orders

```sql
/**
 * View: v_operations_pending_orders
 * Category: Operational
 * Description: Orders requiring attention or processing
 */
CREATE OR REPLACE VIEW v_operations_pending_orders AS
SELECT
    o.id AS order_id,
    o.customer_id,
    c.name AS customer_name,
    o.order_number,
    o.created_at AS order_date,
    o.status AS order_status,
    o.payment_status,
    o.shipping_status,
    SUM(oi.quantity) AS total_items,
    SUM(oi.price * oi.quantity) AS order_total,
    o.shipping_method,
    o.shipping_address,
    o.notes,
    (SELECT COUNT(*) FROM order_items oix 
     JOIN stock s ON oix.product_id = s.product_id 
     WHERE oix.order_id = o.id AND s.quantity < oix.quantity) AS items_with_insufficient_stock,
    CASE
        WHEN o.payment_status = 'completed' AND o.shipping_status = 'ready' THEN 'Ready to Ship'
        WHEN o.payment_status = 'pending' AND o.status = 'confirmed' THEN 'Awaiting Payment'
        WHEN EXISTS (SELECT 1 FROM order_items oix 
                    JOIN stock s ON oix.product_id = s.product_id 
                    WHERE oix.order_id = o.id AND s.quantity < oix.quantity) THEN 'Stock Issue'
        ELSE 'Process Order'
    END AS required_action
FROM
    orders o
JOIN customers c ON o.customer_id = c.id
JOIN order_items oi ON o.id = oi.order_id
WHERE
    o.status NOT IN ('completed', 'canceled', 'delivered')
GROUP BY
    o.id, c.name;
```

## Administrative Views

### va_security_user_permissions

```sql
/**
 * View: va_security_user_permissions
 * Category: Administrative
 * Description: Consolidated view of user permissions across the system
 *
 * Security:
 * - Requires 'admin' role for access
 */
CREATE OR REPLACE VIEW va_security_user_permissions AS
SELECT
    u.id AS user_id,
    u.username,
    u.email,
    u.status AS user_status,
    r.id AS role_id,
    r.name AS role_name,
    p.id AS permission_id,
    p.name AS permission_name,
    p.resource_type,
    p.action,
    ur.assigned_at AS role_assigned_at,
    ur.assigned_by AS role_assigned_by
FROM
    users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id;
```

## Materialized View Refresh Strategy

### Refresh Schedule

| View Name | Refresh Frequency | Refresh Method | Dependencies | Timing Window |
|-----------|-------------------|----------------|--------------|---------------|
| mv_sales_daily_summary | Daily | COMPLETE | None | 03:00-04:00 |
| mv_catalog_product_attributes | Weekly | COMPLETE | None | Sunday 02:00-03:00 |
| mv_customer_activity_summary | Daily | COMPLETE | None | 04:00-05:00 |
| mv_search_optimization | Daily | INCREMENTAL | mv_sales_daily_summary | 05:00-06:00 |

### Refresh Implementation

```sql
-- Example refresh function for a materialized view
CREATE OR REPLACE FUNCTION refresh_materialized_view(view_name text)
RETURNS void AS $$
BEGIN
    EXECUTE 'REFRESH MATERIALIZED VIEW ' || view_name;
    EXECUTE 'ANALYZE ' || view_name;
END;
$$ LANGUAGE plpgsql;

-- Example scheduling stored procedure
CREATE OR REPLACE FUNCTION schedule_materialized_view_refresh()
RETURNS void AS $$
DECLARE
    current_time time := LOCALTIME;
    current_dow integer := EXTRACT(DOW FROM CURRENT_DATE);
BEGIN
    -- Daily refreshes
    IF current_time BETWEEN '03:00:00' AND '03:15:00' THEN
        PERFORM refresh_materialized_view('mv_sales_daily_summary');
    END IF;
    
    IF current_time BETWEEN '04:00:00' AND '04:15:00' THEN
        PERFORM refresh_materialized_view('mv_customer_activity_summary');
    END IF;
    
    -- Weekly refreshes
    IF current_dow = 0 AND current_time BETWEEN '02:00:00' AND '02:15:00' THEN
        PERFORM refresh_materialized_view('mv_catalog_product_attributes');
    END IF;
    
    -- Dependent refreshes
    IF current_time BETWEEN '05:00:00' AND '05:15:00' THEN
        PERFORM refresh_materialized_view('mv_search_optimization');
    END IF;
END;
$$ LANGUAGE plpgsql;
```

## Performance Requirements

1. **Standard Views**:
   - Must execute within 500ms for common query patterns
   - Must use appropriate joins and filters to minimize data scan
   - Must have documented execution plans for common access patterns

2. **Materialized Views**:
   - Must include appropriate indexes for all common query patterns
   - Must refresh within their designated time windows
   - Must not interfere with operational system performance during refresh
   - Must include concurrency control for refresh operations

3. **Query Optimization**:
   - Views should leverage existing table indexes
   - Filters should be structured to maximize index usage
   - Complex calculations should be minimized in view definitions
   - View chaining (views that reference other views) should be limited

## Security Requirements

1. **Access Control**:
   - Views must respect row-level security policies
   - Access to views must be controlled through database roles
   - Administrative views must be restricted to administrative roles

2. **Data Masking**:
   - Views exposing sensitive data must implement data masking
   - PII must be handled according to privacy requirements
   - Integration views must only expose necessary data fields

3. **Auditing**:
   - Views that modify data must include audit columns
   - Usage of administrative views must be logged
   - Regular reviews of view access patterns must be conducted

## Implementation Requirements

Systems implementing this contract must:

1. Follow all naming conventions and structural standards
2. Document all views according to the templated format
3. Implement appropriate performance optimization for views
4. Configure security and access control for views
5. Establish refresh schedules for materialized views
6. Regularly monitor view performance and usage

## View Governance

### View Creation Process

1. Proposal: Submit view requirements with purpose and expected usage
2. Review: Database administrators review for standards compliance
3. Design: Create view definition following contract standards
4. Testing: Validate performance, security, and correctness
5. Documentation: Complete view documentation
6. Deployment: Deploy to development, testing, then production
7. Monitoring: Track usage and performance

### View Modification Process

1. Impact Analysis: Determine affected applications and processes
2. Version Control: Document changes with rationale
3. Backwards Compatibility: Ensure existing queries remain valid
4. Testing: Validate changes don't affect performance
5. Deployment: Communicate changes before deploying

## Related Contracts

- [Database Schema Contract](./database_schema_contract.md) - Defines underlying data structures
- [SQL Analytics Functions Contract](./sql_analytics_functions_contract.md) - Defines analytical SQL functions
- [Data Access Control Contract](./data_access_control_contract.md) - Defines access control policies
- [Data Lineage Contract](../data/data_lineage_contract.md) - Defines data tracking systems

## Invariants

1. Views must not modify underlying data
2. Materialized views must have documented refresh schedules
3. All views must adhere to naming conventions
4. View documentation must be complete and accurate
5. Views must respect security boundaries and access controls

## Testing and Compliance

Systems implementing this contract must verify:

1. Views execute within performance requirements
2. Security controls function as intended
3. Materialized view refreshes complete successfully
4. View documentation matches actual implementation
5. Applications can successfully access views as intended

## Extensions

### Custom View Generators

The system supports generation of views from metadata:

```sql
/**
 * Function: generate_domain_view
 * Description: Generates a standard domain view from metadata
 * 
 * Parameters:
 *   @domain_name text - Business domain name
 *   @entity_name text - Main entity name
 *   @columns jsonb - Column definitions
 *   @filters jsonb - Standard filters to apply
 * 
 * Returns: text containing the generated view definition
 */
CREATE OR REPLACE FUNCTION generate_domain_view(
    domain_name text,
    entity_name text,
    columns jsonb,
    filters jsonb
)
RETURNS text AS $$
DECLARE
    view_name text := 'v_' || domain_name || '_' || entity_name;
    view_def text;
BEGIN
    -- Implementation details
    -- ...
    RETURN view_def;
END;
$$ LANGUAGE plpgsql;
``` 