import { Transaction } from './types';

export function insertSorted(array: Transaction[], item: Transaction): void {
  let low = 0;
  let high = array.length;

  while (low < high) {
      const mid = (low + high) >>> 1; // Equivalent to Math.floor((low + high) / 2) but faster
      if (array[mid].timeSubmitted < item.timeSubmitted) {
          low = mid + 1;
      } else {
          high = mid;
      }
  }

  // At this point, low is the index where the new item should be inserted
  array.splice(low, 0, item);
}