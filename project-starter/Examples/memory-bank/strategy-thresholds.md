# StrategyThresholds Class

The `StrategyThresholds` class in the `com.catmepim.strategy` package defines the thresholds for selecting different processing strategies based on file size and complexity. Here are the key points:

## Fields

- `standardToHybridMB`: The file size threshold (in MB) for transitioning from the standard strategy to the hybrid strategy. Default is 100 MB.
- `hybridToSegmentedMB`: The file size threshold (in MB) for transitioning from the hybrid strategy to the segmented strategy. Default is 500 MB.
- `segmentedToSaxCsvMB`: The file size threshold (in MB) for transitioning from the segmented strategy to the SAX CSV strategy. Default is 700 MB.
- `standardToSaxCsvMB`: The file size threshold (in MB) for transitioning from the standard strategy to the SAX CSV strategy for CSV output. Default is 200 MB.
- `complexityThreshold`: The complexity threshold (0.0-1.0) for aggressive segmentation. Higher values indicate more complex files requiring more aggressive segmentation. Default is 0.7.

## Constructors

- `StrategyThresholds()`: Initializes the thresholds with default values.
- `StrategyThresholds(long standardToHybridMB, long hybridToSegmentedMB)`: Initializes the thresholds for standard to hybrid and hybrid to segmented transitions.
- `StrategyThresholds(long standardToHybridMB, long hybridToSegmentedMB, double complexityThreshold)`: Initializes the thresholds for standard to hybrid, hybrid to segmented transitions, and the complexity threshold.
- `StrategyThresholds(long standardToHybridMB, long hybridToSegmentedMB, long segmentedToSaxCsvMB, long standardToSaxCsvMB)`: Initializes all the thresholds.

## Methods

- Getter and setter methods for each threshold field, allowing for dynamic adjustment of the thresholds.

### Purpose

The `StrategyThresholds` class is designed to provide a flexible and configurable way to determine which processing strategy to use based on the size and complexity of the input files. This helps optimize the processing pipeline by selecting the most appropriate strategy for different file characteristics.