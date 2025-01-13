/**
 * The Stack class is a generic data structure that follows the Last-In-First-Out (LIFO) principle. It provides basic operations for adding, removing, and inspecting elements.
 * docLinks : https://www.blackbox.ai/share/8f155899-4ed3-4a69-8382-14ddb75fbfa8
 */
export default class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length == 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
  log(): void {
    console.log(this.items);
  }
  getFirst(equal: (item: T) => boolean): T | undefined {
    for (let i = this.size() - 1; i >= 0; i--) {
      const item = this.items[i];
      if (equal(item)) return item;
    }
    return undefined;
  }
}
