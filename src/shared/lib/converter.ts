const convertToBase64 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();

  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  );

  return `data:${file.type};base64,${base64}`;
};

export default convertToBase64;
