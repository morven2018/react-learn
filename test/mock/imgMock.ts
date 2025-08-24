export class MockFile {
  constructor(
    public content: BlobPart[],
    public name: string,
    public options: { type: string }
  ) {}

  async arrayBuffer(): Promise<ArrayBuffer> {
    const blob = new Blob(this.content, { type: this.options.type });

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read array buffer'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(blob);
    });
  }

  get type(): string {
    return this.options.type;
  }
}
