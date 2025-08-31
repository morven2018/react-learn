# Performance Profiling Report

- [Performance Profiling Report](#performance-profiling-report)
  - [Initial Loading](#initial-loading)
  - [Before Optimization](#before-optimization)
    - [Change year selection](#change-year-selection)
    - [Filtering by region](#filtering-by-region)
    - [Sorting by population](#sorting-by-population)
    - [Sorting by country name](#sorting-by-country-name)
    - [Searching countries](#searching-countries)
    - [Add new column](#add-new-column)
  - [After Optimization](#after-optimization)
    - [Change year selection](#change-year-selection-1)
    - [Filtering by region](#filtering-by-region-1)
    - [Sorting by population](#sorting-by-population-1)
    - [Sorting by country name](#sorting-by-country-name-1)
    - [Searching countries](#searching-countries-1)
    - [Add new column](#add-new-column-1)
  - [Summary](#summary)
    - [Table](#table)

Completed as part of React Performance [task](https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/performance.md#performance-profiling-task)

Profiling done by using React DevTools Profiler.

Shown difference of such interaction:

- Sorting
  - by population
  - by country name
- Change year selection
- Filtering by region
- Searching countries
- Add new column

The initial loading(fetching) that could not be optimized by useMemo or useCallback shown once in this section.

### Initial Loading

#### Commit Duration:

14.3s

#### Render Duration:

296.7ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-1.png)

## Before Optimization

### Change year selection

#### Commit Duration:

0.1s

#### Render Duration:

91.9ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image-2.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-3.png)

---

### Filtering by region

#### Commit Duration:

1.9s

#### Render Duration:

191.4ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image-5.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-4.png)

---

### Sorting by population

#### Commit Duration:

0.3s

#### Render Duration:

223.3ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image-8.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-9.png)

---

### Sorting by country name

#### Commit Duration:

0.7s

#### Render Duration:

188.7ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image-10.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-11.png)

---

### Searching countries

#### Commit Duration:

0.5s

#### Render Duration:

90.3ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image-12.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-13.png)

---

### Add new column

#### Commit Duration:

0.5s

#### Render Duration:

104.6ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image-14.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-15.png)

## After Optimization

### Change year selection

#### Commit Duration:

2.6s

#### Render Duration:

84.5ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image-16.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-17.png)

---

### Filtering by region

#### Commit Duration:

2.1s

#### Render Duration:

131.7ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image-22.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-23.png)

---

### Sorting by population

#### Commit Duration:

1.1s

#### Render Duration:

154.4ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image-18.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-19.png)

---

### Sorting by country name

#### Commit Duration:

1.2s

#### Render Duration:

171.2ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image-20.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-21.png)

---

### Searching countries

#### Commit Duration:

1.8s

#### Render Duration:

20.3ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image-24.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-25.png)

---

### Add new column

#### Commit Duration:

1.4s

#### Render Duration:

51.7ms

#### Interactions:

Profiler not capture interactions so only Commit and Render analyzed

#### Flame Graph:

![alt text](./screen-to-report/image-26.png)

#### Ranked Chart:

![alt text](./screen-to-report/image-27.png)

## Summary

### Table

| Interaction             | Commit Duration (before) | Commit Duration (after) | Render Duration (before) | Render Duration (after) |
| ----------------------- | ------------------------ | ----------------------- | ------------------------ | ----------------------- |
| Change year selection   | 0.1s                     | 2.6s                    | 91.9ms                   | 84.5ms                  |
| Filtering by region     | 1.9s                     | 2.1s                    | 191.4ms                  | 131.7ms                 |
| Sorting by population   | 0.3s                     | 1.1s                    | 223.3ms                  | 154.4ms                 |
| Sorting by country name | 0.7s                     | 1.2s                    | 188.7ms                  | 171.2ms                 |
| Searching countries     | 0.5s                     | 1.8s                    | 90.3ms                   | 20.3ms                  |
| Add new column          | 0.5s                     | 1.4s                    | 104.6ms                  | 51.7ms                  |

On screen photo you could se that the number of rerender was reduced
